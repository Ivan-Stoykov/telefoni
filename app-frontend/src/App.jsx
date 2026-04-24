import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Layout from './components/Layout/Layout.jsx'
import HomePage from './pages/HomePage/HomePage.jsx'
import AboutUsPage from './pages/AboutUsPage/AboutUsPage.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <Layout/>,
    children:[
      {path: '', element: <HomePage/> },
      {path: 'about', element: <AboutUsPage/> }
    ]
   },
]);


function App() {

  return (
      <RouterProvider router={router} />
  )
}

export default App
