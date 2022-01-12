import { Button } from '@material-ui/core'
import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'

const HomePage = () => {
    let [notes, setNotes] = useState([])
    let {authTokens, logoutUser, user} = useContext(AuthContext)

    useEffect(()=> {
        getNotes()
    }, [])


    let getNotes = async() =>{
        let response = await fetch('http://127.0.0.1:8000/citizenDetails/', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access),
                'Access-Control-Allow-Origin': '*',
            }
        })
        let data = await response.json()

        if(response.status === 200){
            setNotes(data)
        }else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
        
    }

    return (
        <div>
            <p>You are logged to the home page!</p>

            <Button color='primary' onClick={logoutUser}>Logout</Button>
            <ul>
                {notes.map(note => (
                    <React.Fragment>
                    <li key={note.amka} >Full Name: {note.full_name}</li>
                    <li key={note.amka} >AMKA: {note.amka}</li>
                    <li key={note.amka} >Date of Birth: {note.date_of_birth}</li>
                    </React.Fragment>
                ))}
            </ul>
        </div>
    )
}

export default HomePage