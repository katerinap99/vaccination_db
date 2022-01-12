import React, {useContext, Fragment, useState} from 'react'
import AuthContext from '../context/AuthContext'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const LoginPage = () => {
    let {loginUser} = useContext(AuthContext)
    let {registerUser} = useContext(AuthContext)
    return (
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
            <FormDialog registerUser={registerUser} />
          </Card>
        </Grid>
      </Grid>
    </Fragment>
    )
}

const FormDialog = () => {
  let testOpen;
  let {registerUser} = useContext(AuthContext)
  const [open, setOpen] = useState({ testOpen });
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    amka: '',
    date_of_birth: ''
  });

  const {
    first_name,
    last_name,
    username,
    email,
    password,
    amka,
    date_of_birth,
  } = formData;

  const handleToggle = e => {
    setOpen(!open);
  };

  const handleTextFieldChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Fragment  style={{textAlign: 'center'}}>
      <Button style={{marginLeft: '195px'}}
        variant='contained'
        size='large'
        color='primary'
        onClick={handleToggle}
      >
        Sign Up
      </Button>

      <Dialog
        open={!open}
        onClose={handleToggle}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>
          <div
            style={{
              fontFamily: 'Bahnschrift Condensed',
              fontSize: '1.5rem'
            }}
          >
            Sign up to VaccinationDB
          </div>
        </DialogTitle>
        <form onSubmit={registerUser}  style={{textAlign: 'center'}}>
          <DialogContent>
            <DialogContentText>
              <div
                style={{
                  fontFamily: 'Bahnschrift Condensed',
                  fontSize: '1.2rem'
                }}
              >
                It’s quick and easy.
              </div>
            </DialogContentText>

            <TextField
              autoFocus
              name='first_name'
              margin='normal'
              id='first_name'
              label='First name'
              variant='outlined'
              value={formData.first_name || ''}
              fullWidth
              onChange={e => handleTextFieldChange(e)}
            />
            <TextField
              name='last_name'
              margin='normal'
              id='last_name'
              label='Last name'
              variant='outlined'
              value={formData.last_name || ''}
              fullWidth
              onChange={e => handleTextFieldChange(e)}
            />
            <TextField
              name='username'
              margin='normal'
              id='username'
              label='username'
              variant='outlined'
              value={formData.username || ''}
              fullWidth
              onChange={e => handleTextFieldChange(e)}
            />
            <TextField
              name='email'
              margin='normal'
              id='email'
              label='Email'
              type='email'
              variant='outlined'
              value={formData.email || ''}
              fullWidth
              autoComplete='new-password'
              onChange={e => handleTextFieldChange(e)}
            />
            <TextField
              id='password'
              name='password'
              margin='normal'
              label='Password'
              type='password'
              variant='outlined'
              autoComplete='new-password'
              value={formData.password || ''}
              onChange={e => handleTextFieldChange(e)}
              fullWidth
            />
            <TextField
              autoFocus
              name='amka'
              margin='normal'
              id='amka'
              label='Amka'
              variant='outlined'
              value={formData.amka || ''}
              fullWidth
              onChange={e => handleTextFieldChange(e)}
            />
                        <TextField
              autoFocus
              name='date_of_birth'
              margin='normal'
              id='date_of_birth'
              label='Date of birth (YYYY-MM-DD)'
              variant='outlined'
              value={formData.date_of_birth || ''}
              fullWidth
              onChange={e => handleTextFieldChange(e)}
            />

          </DialogContent>

          <DialogActions>
            <Button
              color='primary'
              onClick={e => handleToggle(e)}
              style={{
                fontFamily: 'Bahnschrift Condensed',
                fontSize: '1.1rem'
              }}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              size='large'
              variant='contained'
              color='primary'
            >
              Sign Up
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  );
};

export default LoginPage
