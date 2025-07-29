import { firestore } from '@/config/firebase'
import { colors } from '@/constants/theme'
import { responseType, TransactionType, WalletType } from '@/types'
import { getLast12Months, getLast7Days, getYearRange } from '@/utils/common'
import { scale } from '@/utils/styling'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where
} from 'firebase/firestore'
import { uploadFileToCloudnary } from './imageService'
import { createOrUpdateWalletData } from './walletServices'

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<responseType> => {
  try {
    const { amount, date, type, walletId, category, description, image, id } =
      transactionData
    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: 'Invalid transaction data' }
    }
    if (id) {
      const oldTransactionSnapshot = await getDoc(
        doc(firestore, 'transaction', id)
      )
      const oldTransaction = oldTransactionSnapshot.data() as TransactionType
      const shouldRevortOriginal =
        oldTransaction.type != type ||
        oldTransaction.amount != amount ||
        oldTransaction.walletId != walletId

      if (shouldRevortOriginal) {
        let res = await revertAndUpdateWallet(
          oldTransaction,
          Number(amount),
          type,
          walletId
        )
        if (!res.success) return res
      }
    } else {
      let res = await updateWalletForNewTransaction(
        walletId!,
        Number(amount!),
        type
      )
      if (!res.success) return res
    }
    if (image) {
      const imageUploadRes = await uploadFileToCloudnary(image, 'transaction')
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || 'Failed to upload image'
        }
      }
      transactionData.image = imageUploadRes.data
    }

    const transactionRef = id
      ? doc(firestore, 'transaction', id)
      : doc(collection(firestore, 'transaction'))

    await setDoc(transactionRef, transactionData, { merge: true })
    return {
      success: true,
      data: { ...transactionData, id: transactionRef.id }
    }
  } catch (error: any) {
    return {
      success: false,
      msg: error.message
    }
  }
}

const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: string
): Promise<responseType> => {
  try {
    const walletref = doc(firestore, 'wallets', walletId)

    const walletSnapshot = await getDoc(walletref)
    if (!walletSnapshot.exists) {
      return {
        success: false,
        msg: 'wallet not found'
      }
    }


    const walletdata = walletSnapshot.data() as WalletType
    if (type == 'expense' && walletdata.amount! - amount < 0) {
      return {
        success: false,
        msg: 'Selected wallet dont have balance'
      }
    }
    const updateType = type == 'income' ? 'totalIncome' : 'totalExpenses'
    const updatedWalletAmount =
      type == 'income'
        ? Number(walletdata.amount) + amount
        : Number(walletdata.amount) - amount

    const updatedTotals =
      type == 'income'
        ? Number(walletdata.totalIncome) + amount
        : Number(walletdata.totalExpenses) + amount

    await updateDoc(walletref, {
      amount: updatedWalletAmount,
      [updateType]: updatedTotals
    })
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      msg: error.message
    }
  }
}
const revertAndUpdateWallet = async (
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: string,
  newWalletId: string
): Promise<responseType> => {
  try {
    const originalWalletSnapShot = await getDoc(
      doc(firestore, 'wallets', oldTransaction.walletId)
    )
    const originalWallet = originalWalletSnapShot.data() as WalletType
    let newWalletSnapsort = await getDoc(doc(firestore, 'wallets', newWalletId))
    let newWallet = newWalletSnapsort.data() as WalletType

    const revertType =
      oldTransaction.type == 'income' ? 'totalIncome' : 'totalExpenses'

    const revertIncomeExpense: number =
      oldTransaction.type == 'income'
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount)
    const revertedWalletAmount =
      Number(originalWallet.amount) + revertIncomeExpense

    const revertedIncomeExpenseAmount =
      Number(originalWallet[revertType]) - Number(oldTransaction.amount)

    if (newTransactionType == 'expense') {
      if (
        oldTransaction.walletId == newWalletId &&
        revertedWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          msg: 'The selected wallet dont have enough balance'
        }
      }
      if (newWallet.amount! < newTransactionAmount) {
        return {
          success: false,
          msg: 'The selected wallet dont have enough balance'
        }
      }
    }

    await createOrUpdateWalletData({
      id: oldTransaction.walletId,
      amount: revertedWalletAmount,
      [revertType]: revertedIncomeExpenseAmount
    })

    newWalletSnapsort = await getDoc(doc(firestore, 'wallets', newWalletId))
    newWallet = newWalletSnapsort.data() as WalletType

    const updateType =
      newTransactionType == 'income' ? 'totalIncome' : 'totalExpenses'
    const updatedTransactionAmount: number =
      newTransactionType == 'income'
        ? Number(newTransactionAmount)
        : -Number(newTransactionAmount)

    const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount
    const newIncomeExpenseAmount = Number(
      newWallet[updateType]! + Number(newTransactionAmount)
    )

    await createOrUpdateWalletData({
      id: newWalletId,
      amount: newWalletAmount,
      [revertType]: newIncomeExpenseAmount
    })
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      msg: error.message
    }
  }
}

export const deleteTransaction = async (
  transactionId: string,
  walletId: string
): Promise<responseType> => {
  try {
    const transactionRef = doc(firestore, 'transaction', transactionId)
    const transactionSnapshot = await getDoc(transactionRef)
    if (!transactionSnapshot.exists) {
      return { success: false, msg: 'Transaction not found' }
    }
    const transactionData = transactionSnapshot.data() as TransactionType

    const transactionType = transactionData?.type
    const transactionAmount = transactionData?.amount

    const walletSnapShot = await getDoc(doc(firestore, 'wallets', walletId))
    const walletData = walletSnapShot.data() as WalletType

    const updateType =
      transactionType == 'income' ? 'totalIncome' : 'totalExpenses'

    const newWalletAmount =
      walletData?.amount! -
      (transactionType == 'income' ? transactionAmount : -transactionAmount)

    const newIncomeExpenseAmount = walletData[updateType]! - transactionAmount

    if (transactionType == 'expense' && newWalletAmount < 0) {
      return { success: false, msg: "You can't delete this transaction" }
    }

    await createOrUpdateWalletData({
      id: walletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount
    })
    await deleteDoc(transactionRef)

    return { success: true, msg: 'Transaction deleted successfully!' }
  } catch (error: any) {
    return {
      success: false,
      msg: error.message
    }
  }
}

export const fetchWeeklyStats = async (uid: string): Promise<responseType> => {
  try {
    const db = firestore
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 7)

    const transactionQuery = query(
      collection(db, 'transaction'),
      where('date', '>=', Timestamp.fromDate(sevenDaysAgo)),
      where('date', '<=', Timestamp.fromDate(today)),
      orderBy('date', 'desc'),
      where('uid', '==', uid)
    )
    const querySnapShot = await getDocs(transactionQuery)

    const weeklyData = getLast7Days()
    const transactions: TransactionType[] = []

    querySnapShot.forEach(doc => {
      const transaction = doc.data() as TransactionType
      transaction.id = doc.id
      transactions.push(transaction)
      const transactionDate = (transaction.date as Timestamp)
        .toDate()
        .toISOString()
        .split('T')[0]
      const dayData = weeklyData.find(day => day.date == transactionDate)
      if (dayData) {
        if (transaction.type == 'income') {
          dayData.income += transaction.amount
        } else if(transaction.type == "expense"){
          dayData.expense += transaction.amount
        }
      }
    })

    const starts = weeklyData.flatMap((day)=>[
      {
        value:day.income,
        label:day.day,
        spacing:scale(4),
        labelWidth:scale(30),
        frontColor:colors.primary
      },
      {
        value:day.expense,
        frontColor:colors.rose
      }
    ]);


    return {success:true,data:{
       starts,
      transactions
    }}

  } catch (error: any) {
    return {
      success: false,
      msg: error.message
    }
  }
}
export const fetchMonthlyStats = async (uid: string): Promise<responseType> => {
  try {
    const db = firestore
    const today = new Date()
    const twelveMonthsAgo = new Date(today)
    twelveMonthsAgo.setMonth(today.getMonth() - 12)

    const transactionQuery = query(
      collection(db, 'transaction'),
      where('date', '>=', Timestamp.fromDate(twelveMonthsAgo)),
      where('date', '<=', Timestamp.fromDate(today)),
      orderBy('date', 'desc'),
      where('uid', '==', uid)
    )
    const querySnapShot = await getDocs(transactionQuery)

    const monthlyData = getLast12Months()
    const transactions: TransactionType[] = []

    querySnapShot.forEach(doc => {
      const transaction = doc.data() as TransactionType
      transaction.id = doc.id
      transactions.push(transaction)
      const transactionDate = (transaction.date as Timestamp)
        .toDate()
      const monthName = transactionDate.toLocaleString("default",{
        month:"short"
      });

      const shortYear = transactionDate.getFullYear().toString().slice(-2);

      const monthData = monthlyData.find((month)=>month.month === `${monthName} ${shortYear}`)
      if (monthData) {
        if (transaction.type == 'income') {
          monthData.income += transaction.amount
        } else if(transaction.type == "expense"){
          monthData.expense += transaction.amount
        }
      }
    })

    const starts = monthlyData.flatMap((month)=>[
      {
        value:month.income,
        label:month.month,
        spacing:scale(4),
        labelWidth:scale(30),
        frontColor:colors.primary
      },
      {
        value:month.expense,
        frontColor:colors.rose
      }
    ]);


    return {success:true,data:{
       starts,
      transactions
    }}

  } catch (error: any) {
    return {
      success: false,
      msg: error.message
    }
  }
}

export const fetchYearlyStats = async (uid: string): Promise<responseType> => {
  try {
    const db = firestore
    const transactionQuery = query(
      collection(db, 'transaction'),
      orderBy('date', 'desc'),
      where('uid', '==', uid)
    )
    const querySnapShot = await getDocs(transactionQuery)

    const transactions: TransactionType[] = []

    const firstTransaction = querySnapShot.docs.reduce((earliest,doc)=>{
      const transactionDate = doc.data().date.toDate();
      return transactionDate < earliest ? transactionDate : earliest;
    },new Date());

    const firstYear = firstTransaction.getFullYear();
    const currentYear = new Date().getFullYear();
     const yearlyData = getYearRange(firstYear,currentYear);


    querySnapShot.forEach(doc => {
      const transaction = doc.data() as TransactionType
      transaction.id = doc.id
      transactions.push(transaction)
      const transactionYear = (transaction.date as Timestamp)
        .toDate().getFullYear();

      const yearData = yearlyData.find((item:any)=>item.year === transactionYear.toString())
      if (yearData) {
        if (transaction.type == 'income') {
          yearData.income += transaction.amount
        } else if(transaction.type == "expense"){
          yearData.expense += transaction.amount
        }
      }
    })

    const starts = yearlyData.flatMap((year:any)=>[
      {
        value:year.income,
        label:year.year,
        spacing:scale(4),
        labelWidth:scale(30),
        frontColor:colors.primary
      },
      {
        value:year.expense,
        frontColor:colors.rose
      }
    ]);


    return {success:true,data:{
       starts,
      transactions
    }}

  } catch (error: any) {
    return {
      success: false,
      msg: error.message
    }
  }
}
