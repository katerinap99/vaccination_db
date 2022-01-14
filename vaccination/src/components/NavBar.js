import React from 'react';
import { Link } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import {useState, useEffect, useContext} from 'react'
import './NavBar.css';

//redux imports
import PropTypes from 'prop-types';

// backend auth
import AuthContext from '../context/AuthContext'

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined
  });
  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func
};

const NavBar = () => {
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
    <React.Fragment>
      <CssBaseline />
      <ElevationScroll>
        <AppBar
          id='appbar'
          className='appbar'
          color='primary'
        >
          <Toolbar id='toolbar'>
            <Tooltip className="logo" title='Go to home page'>
              <IconButton id='navbar-logo' component={Link} to='/'>
                <img
                  src='../vaccination-logo.jpg'
                  alt='Avatar'
                  className='navbar-logo'
                />
              </IconButton>
            </Tooltip>
            <Typography variant='h6'>  
            </Typography>
            {(user.is_superuser == 0) ? 
            <Tooltip title='Certificates'>
              <IconButton style = {{color: 'white'}} id='cert' component={Link} to='/issueCertificate'>
                <img
                  src=''
                  alt='My Certificates'
                />
              </IconButton>
            </Tooltip>
            : null }
             <Typography variant='h6'>
             {(user.is_superuser == 1) ? 
             <React.Fragment>
                <div>Logged in as an administrator!</div>
             </React.Fragment>
             : 
             notes.map((note) => (
              <React.Fragment>
                <div style = {{marginLeft: '3rem'}}>Hi {note.full_name}! How can we help you today? </div>
              </React.Fragment>
            ))
              }
                </Typography>
            <Tooltip className='logout' title='Logout'>
              <ExitToAppIcon id='logout-icon' onClick={logoutUser}/>
            </Tooltip>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
    </React.Fragment>
  );
};

export default NavBar;
