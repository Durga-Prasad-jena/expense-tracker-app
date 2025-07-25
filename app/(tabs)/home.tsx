import HomeCard from '@/components/HomeCard'
import ScreenWrapper from '@/components/ScreenWrapper'
import TransactionList from '@/components/TransactionList'
import Typo from '@/components/Typo'
import { colors, radius, spacingX } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import useFetchData from '@/hooks/useFetchData'
import { TransactionType } from '@/types'
import { scale, verticalScale } from '@/utils/styling'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import { useRouter } from 'expo-router'
import { limit, where } from 'firebase/firestore'
import React from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

const Home = () => {
  const { user } = useAuth()
  const router = useRouter()
  const {
    data: recentTransaction,
    error,
    loading: transactionLoading
  } = useFetchData<TransactionType>('transaction', [
    where('uid', '==', user?.uid),
    limit(30)
  ])

  console.log("recent transaction",recentTransaction[0])


  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Typo size={16} color={colors.neutral500}>
              Hii!
            </Typo>
            <Typo size={16} color={colors.white}>
              {user?.name}
            </Typo>
          </View>
          <TouchableOpacity style={styles.serachIcon}>
            <Feather
              name='search'
              size={verticalScale(22)}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.containerStyle}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingVertical: 10 }}>
            <HomeCard />
          </View>
          <View>
        
              <TransactionList
                title='Recent Transaction'
                data={recentTransaction}
                loading={transactionLoading}
                emptyListMessage='No transaction added yet'
              />
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={() => router.push('/(modals)/transactionModal')}
          style={styles.floatingButton}
        >
          <AntDesign name='pluscircle' size={scale(40)} color={colors.grenn} />
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(12)
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  serachIcon: {
    padding: verticalScale(7),
    backgroundColor: colors.neutral600,
    borderRadius: radius._17
  },
  containerStyle: {
    // height:auto
  },
  floatingButton: {
    position: 'absolute',
    bottom: spacingX._25,
    right: spacingX._20
  }
})
