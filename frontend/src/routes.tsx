import React from 'react'
import { Route, BrowserRouter } from 'react-router-dom'

import Home from './pages/Home'
import CreatePoint from './pages/CreatePoint'

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Route path='/' component={Home} exact/>
      <Route path='/cadastro' component={CreatePoint} />
    </BrowserRouter>
  )
}

export default Routes