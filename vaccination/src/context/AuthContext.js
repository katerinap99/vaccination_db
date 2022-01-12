import { createContext, useState, useEffect } from 'react'
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext;


export const AuthProvider = ({children}) => {
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)

    const history = useNavigate()

    let loginUser = async (e )=> {
        e.preventDefault()
        let response = await fetch('http://127.0.0.1:8000/token/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body:JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
        })
        let data = await response.json()

        if(response.status === 200){
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            history('/')
        }else{
            alert('Something went wrong!')
        }
    }

    let registerUser = async (e )=> {
        e.preventDefault()
        let response = await fetch('http://127.0.0.1:8000/register/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body:JSON.stringify({'user':{'first_name':e.target.first_name.value, 'last_name':e.target.last_name.value,
            'username':e.target.username.value,'password':e.target.password.value, 'email':e.target.email.value,
            'amka':e.target.amka.value,'date_of_birth':e.target.date_of_birth.value}})
        })
        let data = await response.json()

        if(response.status === 201){
            let response2 = await fetch('http://127.0.0.1:8000/citizenDetails/', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body:JSON.stringify({'full_name':e.target.first_name.value+" "+ e.target.last_name.value, 
                'amka':e.target.amka.value,'date_of_birth':e.target.date_of_birth.value})
            })
            if(response2.status==201){
                let response = await fetch('http://127.0.0.1:8000/token/', {
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body:JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
                })
                let data = await response.json()
                setAuthTokens(data)
                setUser(jwt_decode(data.access))
                localStorage.setItem('authTokens', JSON.stringify(data))
                history('/')
            }
        }else{
            alert('Something went wrong!')
        }
    }


    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        history('/login')
    }


    let updateToken = async ()=> {

        let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body:JSON.stringify({'refresh':authTokens?.refresh})
        })

        let data = await response.json()
        
        if (response.status === 200){
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        }else{
            logoutUser()
        }

        if(loading){
            setLoading(false)
        }
    }

    let contextData = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        registerUser: registerUser,
        logoutUser:logoutUser,
    }


    useEffect(()=> {

        if(loading){
            updateToken()
        }

        let fourMinutes = 1000 * 60 * 4

        let interval =  setInterval(()=> {
            if(authTokens){
                updateToken()
            }
        }, fourMinutes)
        return ()=> clearInterval(interval)

    }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData} >
            {loading ? null : children}
        </AuthContext.Provider>
    )
}