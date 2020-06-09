import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Text, ScrollView, Image, Alert } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { SvgUri } from 'react-native-svg'
import * as Location from 'expo-location'

import styles from './styles'
import api from '../../services/api'

interface Item {
  id: number
  title: string
  image_url: string
}

interface Point {
  id: number
  name: string
  latitude: number
  longitude: number
  image: string
}

interface Params {
  uf: string
  city: string
}

const Points: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const params = route.params as Params

  const [items, setItems] = useState<Item[]>([])
  const [points, setPoints] = useState<Point[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync()

      if (status !== 'granted') {
        Alert.alert('Ooops...', 'Precisamos da sua permissão para obter a localização')
        return
      }

      const location = await Location.getCurrentPositionAsync()
      const { latitude, longitude } = location.coords

      setInitialPosition([latitude, longitude])
    }

    loadPosition()
  }, [])

  useEffect(() => {
    api.get<Item[]>('items').then(res => {
      setItems(res.data)
      const items = res.data.map(item => item.id)
      setSelectedItems(items)
    })
  }, [])

  useEffect(() => {
    api.get(`points`, {
      params: {
        ...params,
        items: selectedItems.join(',')
      }
    }).then(res => setPoints(res.data))
  }, [selectedItems])

  function handleNavigateToDetail(id: number) {
    navigation.navigate('Detail', { pointId: id })
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.includes(id)

    if (alreadySelected) {
      const filteredList = selectedItems.filter(item => item !== id)
      setSelectedItems(filteredList)
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name='arrow-left' size={20} color='#34cb79' />
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

        <View style={styles.mapContainer}>
          {initialPosition[0] !== 0 &&
            <MapView style={styles.map} initialRegion={{ latitude: initialPosition[0], longitude: initialPosition[1], latitudeDelta: 0.014, longitudeDelta: 0.014 }}>
              {points.map(point => (
                <Marker
                  key={point.id}
                  style={styles.mapMarker}
                  onPress={() => handleNavigateToDetail(point.id)}
                  coordinate={{ latitude: point.latitude, longitude: point.longitude }}>
                  <View style={styles.mapMarkerContainer}>
                    <Image style={styles.mapMarkerImage} source={{ uri: point.image }} />
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          }
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {items.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.item, selectedItems.includes(item.id) ? styles.selectedItem : {}]}
              onPress={() => handleSelectItem(item.id)}
              activeOpacity={0.6}>
              <SvgUri width={42} height={42} uri={item.image_url} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  )
}

export default Points