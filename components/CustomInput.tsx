import { CustomInputProps } from '@/type'
import cn from 'clsx'
import React, { useState } from 'react'
import { Text, TextInput, View } from 'react-native'

const CustomInput = ({ 
    placeholder='Enter text', 
    value,
    onChangeText,
    label,
    secureTextEntry=false, // if we set to true, then we would not be able to see what we are typing. but we will use true for password 
    keyboardType='default',
}: CustomInputProps) => {

    const [isFocused, setIsFocused] = useState(false);

  return (
    <View className='w-full'>
      <Text className='label' style={{ color: isFocused ? '#000' : '#999' }}>{label}</Text>
      <TextInput
        autoCapitalize='none'
        autoCorrect={false}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor="#888"
        className={cn('input', (
            isFocused? 'border-primary' : 'broder-gray-300'
        ))}
      />
    </View>
  )
}

export default CustomInput