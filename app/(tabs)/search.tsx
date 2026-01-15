import { FlatList, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAppwrite from '@/lib/useAppwrite'
import { getCategories, getMenu } from '@/lib/appWrite'
import { useLocalSearchParams } from 'expo-router'
import CartButton from '@/components/CartButton'
import cn from 'clsx';

const search = () => {
  const {category, query} = useLocalSearchParams<{query: string; category: string}>();
  const {data, refetch, loading} = useAppwrite({fn: getMenu, params: { category, query, limit: 6, } });

  const {data: categories} = useAppwrite({fn: getCategories});

  useEffect(() => {
    refetch({category, query, limit: 6});
  }, [category, query]);

  console.log("Data : ", data);
  console.log("Categories : ", categories); 

  return (
    <SafeAreaView className='bg-white h-full'>
      <FlatList
        data={data}
        renderItem={({item, index}) => {
          const isFirstRightColItem = index % 2 === 0;

          return (
            <View className={cn("flex-1 max-w-[48%]", !isFirstRightColItem ? "mt-16" : "mt-0")}>
              <Text>{item.name}</Text>
            </View>
          )
        }}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        columnWrapperClassName='gap-7'
        contentContainerClassName='gap-7 px-5 pb-32'
        ListHeaderComponent={()=> (
          <View className='my-5 gap-5'>
            <View className='flex-between flex-row w-full'>
              <View className='flex-start'>
                <Text className='small-bold uppercase text-primary'>Search</Text>
                <View className='flex-start flex-row gap-x-1 mt-0.5'>
                  <Text className='paragraph-semibold text-dark-100'>Find your favorite food</Text>
                </View>
              </View>
              <CartButton />
            </View>
            <Text>Search Input</Text>
            <Text>Filter</Text>
          </View>
        )}
        ListEmptyComponent={() => (!loading &&
          <View className='flex-center min-h-[65vh]'>
            <Text className='text-lg font-semibold text-gray-600'>No results found</Text>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

export default search