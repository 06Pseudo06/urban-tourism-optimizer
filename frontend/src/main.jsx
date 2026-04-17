import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import Header from "./components/Header"
import Header from "./components/ui/custom/Header.jsx"
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Createtrip from './create-trip'
import SignIn from './auth/SignIn.jsx'
import Login from './auth/Login.jsx'

function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

const route = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <App />
      },
      {
        path: "create-trip",
        element: <Createtrip />
      },
      {
        path: "sign-in",
        element: <SignIn />
      },
      {
        path: "login",
        element: <Login />
      }
    ]
  }

])

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <RouterProvider router={route}/>   {/* //will redirect to the component based on the path*/}
  </StrictMode>, 
)
