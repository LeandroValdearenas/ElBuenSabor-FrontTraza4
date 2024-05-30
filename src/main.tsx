import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { AtributosContextProvider } from './context/AtributosContext'
import NavBar from './componentes/navbar/NavBar'
import Sidebar from './componentes/sidebar/Sidebar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Insumos from './screens/insumos/Insumos'
import Manufacturados from './screens/manufacturados/Manufacturados'
import Empleados from './screens/empleados/Empleados'
import Clientes from './screens/clientes/Clientes'
import Categorias from './screens/categorias/Categorias'
import Promociones from './screens/promociones/Promociones'
import Sucursales from './screens/sucursales/Sucursales'
import Facturacion from './screens/facturacion/Facturacion'
import Empresas from './screens/empresas/Empresas'
import UnidadesMedida from './screens/unidadesMedida/UnidadesMedida'

ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
  <AtributosContextProvider>
    <BrowserRouter>
    <Sidebar />
    <div className="h-100 w-100 flex-grow-1" >
          <NavBar/>
          <div className='content' style={{overflowY:'scroll', height:'89%'}}>
          <Routes>
            <Route index element={<Sucursales />} />
            <Route path="/empresas" element={<Empresas />} />
            <Route path="/sucursales" element={<Sucursales />} />
            <Route path="/unidadesmedida" element={<UnidadesMedida />} />
            <Route path=":idsucursal">
              <Route path="insumos" element={<Insumos />} />
              <Route path="manufacturados" element={<Manufacturados />} />
              <Route path="categorias" element={<Categorias />} />
              <Route path="promociones" element={<Promociones />} />
              <Route path="empleados" element={<Empleados />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="facturacion" element={<Facturacion />} />
            </Route>
            <Route path="*" element={<Sucursales />} />
          </Routes>
          </div>
    </div>
    </BrowserRouter>
    </AtributosContextProvider>
  </React.StrictMode>,
)
