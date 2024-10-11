import React, {useState} from 'react'
import { base } from '../constant'
const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    })
    const [message, setMessage] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setCredentials({...credentials, [name]: value})
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${base}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            })
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
              }
        const data = await response.json()
        if (data.success){
            setMessage(data.message)
            localStorage.setItem('accessToken', data.data.accessToken)
        }
        else
            setMessage(data.message || "Login failed..")
        } catch (error) {
            setMessage(error.message)
        }
    }
  return (
    <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
  )
}

export default Login