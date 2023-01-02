import { useCallback, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import { Card, CardProps } from '../../components/Card';
import { HeaderHome } from '../../components/HeaderHome';
import { useFocusEffect } from '@react-navigation/native';

import { styles } from './styles';
import { Button } from '../../components/Button';

export function Home() {
  const [data, setData] = useState<CardProps[]>([]);

  const { getItem, setItem, removeItem } = useAsyncStorage("@savepass:passwords")

  async function handleFetchData() {
    const response = await getItem();
    const data = response ? JSON.parse(response) : [];
    setData(data);
  }

  async function handleRemove(id: string) {
    try {
      const response = await getItem()
      const previousData = response ? JSON.parse(response) : []

      const data = previousData.filter((item: CardProps) => item.id !== id)
      await setItem(JSON.stringify(data))

      Toast.show({
        type: "success",
        text1: "Removido com sucesso!"
      })

      setData(data)
    } catch (e) {
      console.error(e)
      Toast.show({
        type: "error",
        text1: "Não foi possível remover esse item."
      })
    }
  }

  async function handleClear() {
    try {
      await removeItem()

      Toast.show({
        type: "success",
        text1: "A lista foi limpada com sucesso!"
      })

      setData([])
    } catch (e) {
      console.error(e)
      Toast.show({
        type: "error",
        text1: "Não foi possível limpar essa lista."
      })
    }
  }

  useFocusEffect(useCallback(() => {
    handleFetchData();
  }, []));


  return (
    <View style={styles.container}>
      <HeaderHome />

      <View style={styles.listHeader}>
        <Text style={styles.title}>
          Suas senhas
        </Text>

        <Text style={styles.listCount}>
          {`${data.length} ao total`}
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) =>
          <Card
            data={item}
            onPress={() => handleRemove(item.id)}
          />
        }
      />

      <View style={styles.footer}>
        <Button
          title="Limpar lista"
          onPress={() => handleClear()}
        />
      </View>
    </View>
  );
}