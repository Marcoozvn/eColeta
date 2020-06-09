import React, { useState, useEffect } from 'react'
import { RectButton } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import { View, Image, Text, ImageBackground } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import PickerSelect from 'react-native-picker-select'
import axios from 'axios'

import styles from './styles'

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

const Home: React.FC = () => {
  const navigation = useNavigation()
  
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [address, setAddress] = useState<[string, string]>(['', ''])

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then( response => {
      const names = response.data.map( item => item.sigla )
      setUfs(names)
    })
  }, [])

  useEffect(() => {
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${address[0]}/municipios`).then( response => {
      const names = response.data.map( item => item.nome )
      setCities(names)
    })
  }, [address[0]])

  function handleNavigation() {
    navigation.navigate('Points', { uf: address[0], city: address[1] })
  }

  return (
    <ImageBackground source={require('../../assets/home-background.png')} style={styles.container} imageStyle={{ width: 274, height: 368 }}>
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
      </View>

      <View style={styles.footer}>
        <PickerSelect
          placeholder={{ label: 'Escolha a UF', value: null }}          
          onValueChange={value => setAddress([value, ''])}
          style={{ placeholder: {color: '#6C6C80' }, inputIOS: { ...styles.input }, inputAndroid: { ...styles.input } }}
          items={ufs.map(item => ({ label: item, value: item }))} />
          
        <PickerSelect 
          placeholder={{ label: 'Escolha a cidade', value: null }}  
          onValueChange={value => setAddress([address[0], value])} 
          style={{ placeholder: {color: '#6C6C80' }, inputIOS: { ...styles.input }, inputAndroid: { ...styles.input } }}
          items={cities.map(item => ({ label: item, value: item }))} />

        <RectButton style={styles.button} onPress={handleNavigation}>
          <View style={styles.buttonIcon}>
            <Feather name='arrow-right' color='#FFF' size={24} />
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  )
}

export default Home