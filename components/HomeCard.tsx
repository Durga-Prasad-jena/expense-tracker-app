//import liraries
import { colors, radius } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import useFetchData from '@/hooks/useFetchData'
import { WalletType } from '@/types'
import { scale, verticalScale } from '@/utils/styling'
import AntDesign from '@expo/vector-icons/AntDesign'
import Entypo from '@expo/vector-icons/Entypo'
import { orderBy, where } from 'firebase/firestore'
import React from 'react'
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import Typo from './Typo'

// create a component
const HomeCard = () => {
  const { user } = useAuth()
  const {
    data: wallets,
    error,
    loading: isWalletLoading
  } = useFetchData<WalletType>('wallets', [
    where('uid', '==', user?.uid),
    orderBy('created', 'desc')
  ])

  const getTotals = () => {
    return wallets.reduce(
      (totals: any, item: WalletType) => {
        totals.balance = totals.balance + Number(item.amount)
        totals.income = totals.income + Number(item.totalIncome)
        totals.expense = totals.expense + Number(item.totalExpenses)
        return totals
      },
      { balance: 0, income: 0, expense: 0 }
    )
  }
  return (
    <ImageBackground
      style={styles.bgImage}
      source={require('../assets/images/card.png')}
    >
      <View style={styles.container}>
        <View style={styles.balanceView}>
          <Typo size={14} color={colors.neutral800} fontWeight={'500'}>
            Total Balance
          </Typo>
          <TouchableOpacity>
            <Entypo
              name='dots-three-horizontal'
              size={20}
              color={colors.black}
            />
          </TouchableOpacity>
        </View>
        <Typo size={scale(28)} color={colors.neutral900} fontWeight={'bold'}>
          $ {getTotals()?.balance?.toFixed(2)}
        </Typo>
        <View style={styles.priceView}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.wrapper}>
              <View style={styles.imageView}>
                <AntDesign
                  name='arrowdown'
                  size={20}
                  color={colors.neutral600}
                />
              </View>
              <Typo color={colors.neutral600} fontWeight={'600'}>
                Income
              </Typo>
            </View>
            <Typo size={verticalScale(23)} color={colors.grenn}>
              $ {isWalletLoading ? '-----' : getTotals()?.income?.toFixed(2)}
            </Typo>
          </View>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.wrapper}>
              <View style={styles.imageView}>
                <AntDesign name='arrowup' size={20} color={colors.neutral600} />
              </View>
              <Typo color={colors.neutral600} fontWeight={'600'}>
                Expenses
              </Typo>
            </View>
            <Typo size={verticalScale(23)} color={colors.rose}>
              $ {isWalletLoading ? '-----' : getTotals()?.expense?.toFixed(2)}
            </Typo>
          </View>
        </View>
      </View>
    </ImageBackground>
  )
}

// define your styles
const styles = StyleSheet.create({
  bgImage: {
    width: '100%',
    height: scale(210),
    borderRadius: radius._15
  },
  container: {
    width: '100%',
    height: '87%',
    paddingHorizontal: scale(15),
    padding: scale(10)
  },
  balanceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  priceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(30)
  },
  wrapper: {
    flexDirection: 'row',
    gap: verticalScale(10),
    alignItems: 'center'
  },
  imageView: {
    padding: verticalScale(4),
    backgroundColor: colors.neutral400,
    borderRadius: radius._30
  }
})

//make this component available to the app
export default HomeCard
