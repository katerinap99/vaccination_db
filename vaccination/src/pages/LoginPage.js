import React, {useContext, Fragment} from 'react'
import AuthContext from '../context/AuthContext'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';


const LoginPage = () => {
    let {loginUser} = useContext(AuthContext)
    return (
        // <div>
        //    <form onSubmit={loginUser}>
        //        <input type={"text"} name="username" placeholder='Enter usernme' />
        //        <input type={"password"} name="password" placeholder='Enter password' />
        //        <input type={"submit"} />
        //     </form> 
        // </div>
        <Fragment>
      <Grid container spacing={1} >
        <Grid item xs={12} sm={12} md={6}>
          <img style={{marginTop: '70px', width: '600px',
      height: '450px'}}
            src='static/images/vaccine.jpg'
          />
          <br />
        </Grid>
        <Grid item xs={12} sm={12} md={4} style={{marginTop: '150px'}}>
          <Card  justify='center'>
            <Typography varient='h1' >
              Please Login or Sign up
            </Typography>

            <form onSubmit={loginUser} style={{textAlign: 'center'}}>
              <TextField
                id='username'
                name='username'
                type='username'
                label='Username'
                variant='outlined'
                // helperText={errors.email}
                // error={errors.email ? true: false}
                fullWidth
              />
              <TextField
                id='password'
                name='password'
                type='password'
                label='Password'
                variant='outlined'
                fullWidth
              />
              <Button
                type='submit'
                size='large'
                variant='contained'
                color='primary'
              >
                Login
              </Button>
              <Divider variant='middle'  />
            </form>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
    )
}

export default LoginPage
