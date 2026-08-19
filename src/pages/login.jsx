import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'
// import { Link } from 'react-router-dom'
// import axios from "axios";


export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const validate = () => {
        if (!email) {
            setError('Email is required')
            return false
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Enter a valid email')
            return false
        }
        if (!password) {
            setError('Password is required')
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!validate()) return
        setLoading(true)
        try {
            const res = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            // const data = await res.json().catch(() => ({}))
            const data = await res.json();

            if (data.success) {
                localStorage.setItem("userName", data.user.name);
                localStorage.setItem("userEmail", data.user.email);
                localStorage.setItem("userId", data.user.id);

                navigate("/dashboard");
            } else {
                setError(data.message || 'Invalid credentials')
            }
        } catch (err) {
            setError('Network error')
        } finally {
            setLoading(false)
        }
    }

    // const handleLogin = async () => {
    //     try {
    //         const res = await axios.post(
    //             "http://localhost:5000/api/login",
    //             {
    //                 email,
    //                 password
    //             }
    //         );

    //         alert(res.data.message);

    //         navigate("/dashboard");
    //     } catch (err) {
    //         alert("Invalid email or password");
    //     }
    // };
    return (
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h2>Sign In</h2>
                {error && <div className="error">{error}</div>}

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <button type="button" onClick={() => navigate('/registration')}>
                    Don't have an account? Sign up
                </button>
            </form>
        </div>
    )
}
