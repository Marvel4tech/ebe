import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { toast } from 'react-toastify'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.")
            return
        }

        if (!password) {
            setError("Please enter the password")
            return
        }
        setError("")

        //Login API Call
        try {
            const response = await axiosInstance.post("/login", {
                email,
                password
            })

            if (response.data && response.data.token) {
                localStorage.setItem("token", response.data.token)
                navigate("/dashboard")
                toast.success("Login Successfull")
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message)
                toast.error("Failed to Login")
            } else {
                setError("An unexpected error occured. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

  return (
    <div>
        <Navbar />

        <div className=' flex items-center justify-center mt-28'>
            <div className=' w-98 bg-white border rounded px-7 py-10'>
                {loading ? (
                    <div>
                        <p>Loading...</p>
                    </div>
                ) : ( 
                 <form onSubmit={handleLogin}>
                    <h4 className=' text-2xl mb-7'>Login</h4>
                    <input
                        type='text'
                        placeholder='Email'
                        className='input-box'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <PasswordInput value={password} onchange={(e) => setPassword(e.target.value)} />
                    {error && <p className=' text-red-500 text-xs pb-1'>{error}</p>}
                    <button className=' btn-primary' type='submit'>
                        Login
                    </button>
                    <p className=' text-sm text-center mt-4'>
                        Not registered yet? {""} 
                        <Link to={'/signup'} className=' font-medium text-primary underline'>
                            Create an Account
                        </Link>
                    </p>
                </form>)}
            </div>
        </div>
    </div>
  )
}

export default Login