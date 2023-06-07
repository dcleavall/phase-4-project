import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

function NavBar({updateUser}) {
    const [user, setUser] = useState(false)
    const history = useHistory()

    const handleSignup = () => {
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then((res) => {
            if (res.ok) {
                res.json().then((user) => {
                    updateUser(user)
                    history.push('/main')
                })
            }
        })
    }

    const handleLogin = () => {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then((res) => {
            if (res.ok) {
                res.json().then((user) => {
                    updateUser(user)
                    history.push('/main')
                })
            }
        })
    }

    const handleLogout = () => {
        fetch('/logout', {
            method: 'DELETE'
        })
        .then((res) => {
            if (res.ok) {
                res.json().then(() => {
            updateUser(null)
            history.push('/authenticate')
                })  
            }
        })
    }

    return (
        <Nav>
            <NavH1>App Name</NavH1>
            <NavLinks>
                <div>

                </div>
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/authentication'>Login/Signup</Link></li>
                    <div> 
                        <li onClick={handleSignup}>Signup</li>
                        <li onClick={handleLogin}>Login</li>
                        <li onClick={handleLogout} >Logout</li>
                    </div>
                    <li><Link to='/main'>Main</Link></li>
                </ul>
                
            </NavLinks > 
        </Nav>

    )
}


export default NavBar
