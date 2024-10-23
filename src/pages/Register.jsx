import React, { useState, useEffect } from 'react'
import { base } from '../constant'
import { useNavigate } from 'react-router-dom'
const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        skills: ''
    })
    const [message, setMessage] = useState('')
    const navigate = useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${base}/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            const data = await response.json()
            if(response.ok){
                setMessage(data.message)
                navigate('/') 
            }
            else
                setMessage(data.message)
        }catch(error){
            setMessage(error)
        }
    }
  return (
    <div>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                name="fullName" 
                placeholder='Full Name'
                value={formData.fullName}
                onChange={handleChange}
                required
            />
            <input 
                type="text"
                name="username" 
                placeholder='Username'
                value={formData.username}
                onChange={handleChange}
                required
            />
            <input 
                type="email"
                name="email" 
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input 
                type="text"
                name="password" 
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
                required
            />
            <input 
                type="text"
                name="skills" 
                placeholder='Skills (comma seperated with no spacing'
                value={formData.skills}
                onChange={handleChange}
                required
            />
            <button type="submit">Register</button>
        </form>
        {message && <p>{message}</p>}
    </div>
  )
}

export default Register