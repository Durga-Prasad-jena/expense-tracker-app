import Header from '@/components/Header'
import Loading from '@/components/Loading'
import ScreenWrapper from '@/components/ScreenWrapper'
import TransactionList from '@/components/TransactionList'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import { fetchMonthlyStats, fetchWeeklyStats, fetchYearlyStats } from '@/services/transactionService'
import { scale, verticalScale } from '@/utils/styling'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import { BarChart } from "react-native-gifted-charts"


const Statitics = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [transaction,setTransaction]= useState([])

  const {user} = useAuth()

  useEffect(() => {
    if (activeIndex == 0) {
      getWeeklyState()
    }
    if (activeIndex == 1) {
      getMonthlyState()
    }
    if (activeIndex == 2) {
      getYearlyState()
    }
  }, [activeIndex]);



  const getWeeklyState = async() => { 
      setChartLoading(true);
      const res = await fetchWeeklyStats(user?.uid as string)
      setChartLoading(false);
      if(res.success){
        setChartData(res?.data?.starts)
        setTransaction(res?.data?.transactions)
      }else{
        Alert.alert("Error",res.msg)
      }
  }
  const getMonthlyState = async() => { 
       setChartLoading(true);
      const res = await fetchMonthlyStats(user?.uid as string)
      setChartLoading(false);
      if(res.success){
        setChartData(res?.data?.starts)
        setTransaction(res?.data?.transactions)
      }else{
        Alert.alert("Error",res.msg)
      }
  }
  const getYearlyState = async() => {
     setChartLoading(true);
      const res = await fetchYearlyStats(user?.uid as string)
      setChartLoading(false);
      if(res.success){
        setChartData(res?.data?.starts)
        setTransaction(res?.data?.transactions)
      }else{
        Alert.alert("Error",res.msg)
      }
   }
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header title='Statitics' />
        </View>
        <ScrollView
          contentContainerStyle={{
            gap: spacingY._20,
            paddingTop: spacingY._15,
            paddingBottom: verticalScale(100)
          }}
          showsVerticalScrollIndicator={false}
        >
          <SegmentedControl
            values={['Weekly', 'Monthly', 'Yearly']}
            selectedIndex={activeIndex}
            onChange={event => {
              setActiveIndex(event.nativeEvent.selectedSegmentIndex)
            }}
            tintColor={colors.neutral200}
            backgroundColor={colors.neutral800}
            appearance='dark'
            activeFontStyle={styles.segmentFontStyle}
            style={styles.segmentStyle}
            fontStyle={{ ...styles.segmentFontStyle, color: colors.white }}
          />
          <View style={styles.chartContainer}>
            {
              chartData.length > 0 ? (

                <BarChart
                  data={chartData}
                  barWidth={scale(12)}
                  spacing={[1, 2].includes(activeIndex) ? scale(25) : scale(16)}
                  roundedTop
                  roundedBottom
                  hideRules
                  yAxisLabelPrefix='$'
                  yAxisThickness={0}
                  xAxisThickness={0}
                  yAxisLabelWidth={[1, 2].includes(activeIndex) ? scale(38) : scale(35)}
                  yAxisTextStyle={{ color: colors.neutral350 }}
                  xAxisLabelTextStyle={{
                    color: colors.neutral350,
                    fontSize: scale(12)
                  }}
                  noOfSections={3}
                  minHeight={5}
                  isAnimated={true}
                />

              ) : <View style={styles.noChart} />
            }
            {
              chartLoading && (<View style={styles.chartLoadingContainer}><Loading /></View>)
            }
          </View>

          {/* trnsaction list */}

          <View>
            <TransactionList
            data={transaction}
            title='Transaction'
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default Statitics

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    paddingVertical: spacingY._5,
    gap: spacingX._25
  },
  header: {},
  segmentFontStyle: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: colors.black
  },
  segmentStyle: {
    height: scale(37)
  },
  chartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center"
  },
  chartLoadingContainer: {
    position: "absolute",
    height: "100%",
    width: "100%"
  },
  noChart: {
    backgroundColor: "rgba(0,0,0,0.6)",
    height: verticalScale(210)
  }
})
