import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
  formControl: {
    //margin: theme.spacing(1),
    minWidth: 120,
    marginTop: '200px',
    marginLeft: '200px'
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export default function SimpleSelect(props) {
  const classes = useStyles();

  const handleChange = event => {
    props.onChange(event.target.value);
  };

  return (
    <div>
      <FormControl variant='outlined' >
        <InputLabel id='demo-simple-select-outlined-label'>District</InputLabel>
        <Select
          labelId='demo-simple-select-outlined-label'
          id='demo-simple-select-outlined'
          value={props.gender}
          onChange={handleChange}
          label='District'
        >
          <MenuItem value={'CEN_MAC'}>Central Macedonia</MenuItem>
          <MenuItem value={'EPI'}>Epirus</MenuItem>
          <MenuItem value={'WEST_MAC'}>West Macedonia</MenuItem>
          <MenuItem value={'PEL'}>Peloponese</MenuItem>
          <MenuItem value={'ATT'}>Attiki</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}