import { firestore } from '@/config/firebase'
import { responseType, TransactionType, WalletType } from '@/types'
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
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
      console.log('wallet not found')
      return {
        success: false,
        msg: 'wallet not found'
      }
    }

    console.log('walletSnalshot', walletSnapshot.data())

    const walletdata = walletSnapshot.data() as WalletType
    if (type == 'expense' && walletdata.amount! - amount < 0) {
      console.log('Selected wallet dont have balance')
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
      id:newWalletId,
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
