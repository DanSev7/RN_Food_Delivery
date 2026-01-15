import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { signIn } from '@/lib/appWrite'
import useAuthStore from '@/store/auth.store'
import * as Sentry from '@sentry/react-native'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const SignIn = () => {
  const { fetchAuthenticatedUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const submit = async () => {
    const { email, password } = form;
    if(!email || !password) return Alert.alert('Error', 'Please fill in all fields')
    
    setIsSubmitting(true); 
    try {
      // Call Appwrite Sign In Function
      await signIn({email, password})
      
      // Fetch the authenticated user to update the store
      await fetchAuthenticatedUser();
      
      Alert.alert('Success', 'User signed in successfully')
      router.replace("/")
    } catch (error: any) {
      Alert.alert('Error', error.message)
      Sentry.captureException(error)
    } finally {
      setIsSubmitting(false);
    }

  }


  return (
    <View className='gap-10 bg-white rounded-lg p-5 mt-5'>
        <CustomInput
          placeholder='Enter Your email' 
          value={form.email} 
          onChangeText={(text)=> setForm({...form, email: text})} 
          label='Email' 
          keyboardType='email-address' 
        />

        <CustomInput
          placeholder='Enter Your password' 
          value={form.password} 
          onChangeText={(text)=> setForm({...form, password: text})} 
          label='Password' 
          secureTextEntry={true} 
        />

        <CustomButton 
          title="Sign In" 
          onPress={submit}
          isLoading={isSubmitting}
        />

        <View className='flex justify-center mt-5 flex-row gap-2'>
          <Text className='base-regular text-gray-100'>Don't have an account?{' '}
            <Link className='base-bold text-primary' href="/sign-up">Sign Up</Link>
          </Text>
        </View>
    </View>
  )
}

export default SignIn
