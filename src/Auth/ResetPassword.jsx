import React, {useState} from 'react'
import { useLocation } from 'react-router-dom'
import { base } from '../constant'
const ResetPassword = () => {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const token = queryParams.get("token") // extract the token from url

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const handleResetPassword = async () => {
        if(password !=="" && password !== confirmPassword){
            alert("Passwords do not match")
        return}
        
        // Api request to reset password
        try {
                const response = await fetch(`${base}/user/verifyResetPassword`,{
                    method: "POST",
                    headers: {
                        "Content-Type": 
                        "application/json"
                    },
                    body: JSON.stringify({ token, password })
                })
                const data = await response.json()
                if(response.ok){
                    alert("Password reset successfull")
                }else{
                    alert(data.message)
                    setPassword("")
                    setConfirmPassword("")
                }
        } catch (error) {
            console.error("Error resetting password: ", error)
            setPassword("")
            setConfirmPassword("")
        }
    }
  return (
    <div>
      <h1>Reset Password</h1>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleResetPassword}>Reset Password</button>
    </div>
  )
}

export default ResetPassword