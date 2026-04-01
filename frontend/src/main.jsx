import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import Header from "./components/Header"
import Header from "./components/ui/custom/Header.jsx"
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router'
import Createtrip from './create-trip'

const route = createBrowserRouter([
  {
    path: "/",
    element:<App/>
  },
  {
    path: "/create-trip",
    element:<Createtrip/>
  }

])

createRoot(document.getElementById('root')).render(

  <StrictMode>
   <Header/>
   <RouterProvider router={route}/>
  </StrictMode>,
)
