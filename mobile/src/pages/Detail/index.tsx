import React, { useEffect, useState  } from 'react'
import { View, Text, TouchableOpacity, Image, SafeAreaView, Linking } from 'react-native'
import { Feather, FontAwesome } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import * as MailComposer from 'expo-mail-composer'
import api from '../../services/api'

import styles from './styles'

interface DetailParams {
  pointId: number
}

interface Point {
  name: string
  image: string
  items: { title: string }[]
  city: string
  uf: string
  whatsapp: string
  email: string
}

const Detail: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const [pointData, setPointData] = useState<Point>({} as Point)

  const routeParams = route.params as DetailParams

  useEffect(() => {
    api.get<Point>(`points/${routeParams.pointId}`).then(res => {
      setPointData(res.data)
    })
  }, [])

  function handleSendMail() {
    console.log('aa')
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [pointData.email]
    })
  }

  function handleWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=${pointData.whatsapp}&text=Tenho interesse na coleta de resíduos`)
  }

  if (!pointData.name) {
    return null;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name='arrow-left' size={20} color='#34cb79' />
        </TouchableOpacity>

        <Image style={styles.pointImage} source={{ uri: pointData.image }} />
        <Text style={styles.pointName}>{pointData.name}</Text>
        <Text style={styles.pointItems}>{pointData.items.map(item => item.title).join(', ')}</Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>{pointData.city}, {pointData.uf}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name='whatsapp' size={20} color='#fff'/>
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={handleSendMail}>
          <Feather name='mail' size={20} color='#fff'/>
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  )
}

export default Detail