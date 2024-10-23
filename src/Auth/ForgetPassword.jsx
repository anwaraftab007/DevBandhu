import React, { useState } from 'react'
import { base } from '../constant'
const ForgetPassword = () => {
    const [isVerified, setIsVerified] = useState(false)
    const [loading, setLoading] = useState(true)
    const [email, setEmail] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await fetch(`${base}/user/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email})
                    })
                    const data = await response.json()
                    if (data.success) {
                        alert(data.message)
                        setIsVerified(true)
                        setLoading(false)
                        } else {
                            alert(data.message)
                            setIsVerified(false)
                            setLoading(false)
                            }
    } catch(error){
        console.error(error)
    }
}
 const handleInput = (e) => {
    setEmail(e.target.value)
}
  return (
    <div>
        <h1>ResetPassword</h1>
        <form onSubmit={handleSubmit}>
            <label>Enter your email address:</label>
            <input onChange={handleInput} type="email" name="email" value={email} required />
            <button type="submit">Send Verification Email</button>
        </form>
    </div>

  )
}

export default ForgetPassword;