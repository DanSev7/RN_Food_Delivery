import { Slot } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const AuthLayout = () => {
  return (
    <SafeAreaView>
      <Slot />
    </SafeAreaView>
  )
}

export default AuthLayout
