import { View, Text, Button } from 'react-native'
import React from 'react'
import { signOut } from '@/lib/appWrite'

const profile = () => {
 
  return (
    <View>
      <Text>profile</Text>
      <Button title='Sign Out' onPress={() => signOut().catch((error) => console.log(error, 'sign out error'))}/>
    </View>
  )
}

export default profile