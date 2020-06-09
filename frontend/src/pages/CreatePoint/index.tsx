import React, { useState, useEffect, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import api from '../../services/api'
import axios from 'axios'
import { LeafletMouseEvent } from 'leaflet'
import Feedback from '../../components/Feedback'
import success from '../../assets/success.json'
import Dropzone from '../../components/Dropzone'
import { object, string, ValidationError, array, number } from 'yup'

import logo from '../../assets/logo.svg'

import './styles.css'

interface Item {
  id: number
  title: string
  image_url: string
}

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

const schema = object().shape({
  name: string().required(),
  email: string().email().required(),
  whatsapp: string().required(),
  uf: string().required(),
  city: string().required(),
  selectedFile: object().required(),
  position: array().of(number()),
  selectedItems: array().of(number()).required()
})

const CreatePoint: React.FC = () => {
  const history = useHistory()

  const [items, setItems] = useState<Item[]>([])
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
  const [animation, setAnimation] = useState(false)
  const [errors, setErrors] = useState<{ [k: string]: string }>({})

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [uf, setUf] = useState('')
  const [city, setCity] = useState('')
  const [position, setPosition] = useState<[number, number]>([0, 0])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectedFile, setSelectedFile] = useState<File>()

  useEffect(() => {
    api.get('items').then(res => {
      setItems(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const names = response.data.map(item => item.sigla)
      setUfs(names)
    })
  }, [])

  useEffect(() => {
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`).then(response => {
      const names = response.data.map(item => item.nome)
      setCities(names)
    })
  }, [uf])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords

      setInitialPosition([latitude, longitude])
    })
  }, [])

  function handleMapClick(event: LeafletMouseEvent) {
    setPosition([event.latlng.lat, event.latlng.lng])
  }

  function handleSelectItem(id: number) {
    setErrors({ ...errors, selectedItems: '' })
    const alreadySelected = selectedItems.includes(id)

    if (alreadySelected) {
      const filteredList = selectedItems.filter(item => item !== id)
      setSelectedItems(filteredList)
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }


  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    console.log('aa')

    try {
      await schema.validate({ name, email, whatsapp, city, uf, position, selectedFile, selectedItems }, { abortEarly: false })

      const [latitude, longitude] = position

      const data = new FormData()
      data.append('name', name)
      data.append('email', email)
      data.append('whatsapp', whatsapp)
      data.append('latitude', String(latitude))
      data.append('longitude', String(longitude))
      data.append('city', city)
      data.append('uf', uf)
      data.append('items', selectedItems.join(','))

      if (selectedFile) {
        data.append('image', selectedFile)
      }

      //await api.post('/points', data)
      setAnimation(true)

      setTimeout(resolve => {
        setAnimation(false)
        history.push('/')
      }, 1500)


    } catch (error) {
      const validationErrors = error as ValidationError
      const myObj: { [key: string]: string } = {}
      validationErrors.inner.forEach(field => myObj[field.path] = field.message)
      setErrors(myObj)
    }
  }

  function handleChange(fieldName: string, value: string) {
    setErrors({ ...errors, [fieldName]: '' })
    switch (fieldName) {
      case 'name':
        setName(value)
        break;
      case 'email':
        setEmail(value)
        break;
      case 'whatsapp':
        setWhatsapp(value)
        break;
      case 'uf':
        setUf(value)
        setCities([])
        break;
      case 'city':
        setCity(value)
        break;
      default:
        break;
    }
  }

  function handleSelectFile(file: File) {
    setErrors({ ...errors, selectedFile: '' })
    setSelectedFile(file)
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt='eColeta' />

        <Link to='/'>
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do ponto de coleta</h1>

        <Dropzone error={errors['selectedFile'] ? true : false} onFileUploaded={handleSelectFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              className={errors['name'] ? 'invalid' : ''}
              id="name"
              type="text"
              name="name"
              value={name}
              onChange={e => handleChange(e.target.name, e.target.value)} />
            { errors['name'] && <span className="text-invalid" >O nome é obrigatório</span> }
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                className={errors['email'] ? 'invalid' : ''}
                id="email"
                type="text"
                name="email"
                value={email}
                onChange={e => handleChange(e.target.name, e.target.value)} />
              { errors['email'] && <span className="text-invalid" >O e-mail é obrigatório</span> }
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                className={errors['whatsapp'] ? 'invalid' : ''}
                id="whatsapp"
                type="text"
                name="whatsapp"
                value={whatsapp}
                onChange={e => handleChange(e.target.name, e.target.value)} />
              { errors['whatsapp'] && <span className="text-invalid" >O whatsapp é obrigatório</span> }
            </div>
          </div>

        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick} >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={position} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">UF</label>
              <select className={errors['uf'] ? 'invalid' : ''} name="uf" id="uf" value={uf} onChange={e => handleChange(e.target.name, e.target.value)}>
                <option value="0">Selecione uma UF</option>
                {ufs.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
              { errors['uf'] && <span className="text-invalid" >A UF é obrigatória</span> }
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select className={errors['city'] ? 'invalid': ''} name="city" id="city" value={city} onChange={e => handleChange(e.target.name, e.target.value)}>
                <option value="0">Selecione uma Cidade</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              { errors['city'] && <span className="text-invalid" >A cidade é obrigatória</span> }
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span className={errors['selectedItems'] ? 'text-invalid' : ''}>Selecione um ou mais itens abaixo</span>
          </legend>

          <div className="items-grid">
            {items.map(item => (
              <li key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </div>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
      {animation && <Feedback text='Ponto cadastrado com sucesso' animation={success} />}
    </div>
  )
}

export default CreatePoint