import ScreenWrapper from '@/components/ScreenWrapper'
import { useAuth } from '@/contexts/authContext'
import React from 'react'
import { Text } from 'react-native'

const Home = () => {

  const {user} = useAuth()

  console.log("user",user)
  return (
    <ScreenWrapper>
      <Text>Home</Text>
    </ScreenWrapper>
  )
}

export default Home

