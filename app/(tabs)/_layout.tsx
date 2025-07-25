import CustomTabs from '@/components/CustomTabs'
import { Tabs } from 'expo-router'
import React from 'react'

const _layout = () => {
  return (
   <Tabs tabBar={CustomTabs} screenOptions={{headerShown:false}}>
    <Tabs.Screen name='home'/>
    <Tabs.Screen name='statitics'/>
    <Tabs.Screen name='wallet'/>
    <Tabs.Screen name='profile'/>
   </Tabs>
  )
}

export default _layout