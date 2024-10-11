import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import AllProject from './pages/Projects/AllProjects'
import ProjectDetails from './pages/Projects/ProjectDetails'
import './App.css'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path="/projects" element={<AllProject />} />
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

//Dark: #35374B || #393053 || #002233
//Light: #E7F6F2 || #EEEEEE || edf2fb
export default App