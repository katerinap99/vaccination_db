import { Button } from "@material-ui/core";
import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import DistrictSelector from "../components/DistrictSelector";
import DatePicker from "../components/DatePicker";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import PropTypes from 'prop-types';
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import NavBar from "../components/NavBar";
import CitizenDetails from "../components/CitizenDetails";
import "../components/NavBar.css";

const HomePage = () => {
  let [notes, setNotes] = useState([]);
  const [district, setDistrict] = useState([]);
  const [date, setDate] = useState([]);
  let selectedSpotAddress ;
  const [appointmentDetails, setAppointmentDetails] = useState([]);
  const [availableSpots, setAvailableSpots] = useState([]);
  let { authTokens, logoutUser, user } = useContext(AuthContext);
  useEffect(() => {
    getCitizenDetails();
  }, []);

  let getCitizenDetails = async () => {
    let response = await fetch("http://127.0.0.1:8000/citizenDetails/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
        "Access-Control-Allow-Origin": "*",
      },
    });
    let data = await response.json();

    if (response.status === 200) {
      setNotes(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  const handleChange = (event) => {
    selectedSpotAddress = event.target.value;
  };

  let getAvailableSpots = async () => {
    var url = new URL("http://127.0.0.1:8000/vaccination_spots/"),
      params = { district_name: district, date: date };
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
        "Access-Control-Allow-Origin": "*",
      },
    });
    let data = await response.json();

    if (response.status === 200) {
      setAvailableSpots(data);
    } else {
      alert("Please select a district and date!");
    }
  };

  let makeAppointment = async () => {
    let selectedSpotId = availableSpots.find(spot=>spot.address === selectedSpotAddress).vax_spot_id;
    let response = await fetch('http://127.0.0.1:8000/appointment/', {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            Authorization: "Bearer " + String(authTokens.access),
            'Access-Control-Allow-Origin': '*'
        },
        body:JSON.stringify({'vax_spot':selectedSpotId.toString(), 'date':date})
    })
    let data = await response.json()

    if(response.status === 201){
        setAppointmentDetails({ ...data, vax_spot: selectedSpotAddress  });
        console.log(appointmentDetails);
        alert('appointment set for selected date & spot!')
    }else{
        alert('Something went wrong!')
    }
  };

  return (
    <React.Fragment>
      <NavBar />
      <div style={{marginTop: '7%', marginLeft:'40%'}}>
        <p>You are logged to the home page!</p>
        <ul>
          {notes.map((note) => (
            <React.Fragment>
              <li key={note.amka}>Full Name: {note.full_name}</li>
              <li key={note.amka}>AMKA: {note.amka}</li>
              <li key={note.amka}>Date of Birth: {note.date_of_birth}</li>
            </React.Fragment>
          ))}
        </ul>
      </div>
      <Grid container spacing={3}>
        <Grid
          container
          spacing={2}
          justify="center"
        >
          <Grid item xs="auto" style={{marginTop:'1%'}}>
            <DistrictSelector onChange={(value) => setDistrict(value)} />
          </Grid>
          <Grid item xs="auto">
            <DatePicker onChange={(value) => setDate(value)} />
          </Grid>
          <Grid item xs="auto">
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={getAvailableSpots} style={{marginTop:'10%'}}
            >
              Check availability
            </Button>
          </Grid>
        </Grid>
      </Grid> 
      {availableSpots.length>0  && (
    <React.Fragment>
      <FormControl component="fieldset" style={{marginLeft: '35%', marginTop: '5%'}}>
        <FormLabel component="legend">
          Available Spots in your district
        </FormLabel>
        <RadioGroup
          aria-label="available_spots"
          name="radio-buttons-group"
          onChange={handleChange}
        >
          {availableSpots.map((spot) => (
            <FormControlLabel
              key={spot.vax_spot_id}
              value={spot.address}
              control={<Radio />}
              label={spot.address}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={makeAppointment} style={{marginTop: '7.5%'}}
            >
              Make Appointment 
            </Button>
      </React.Fragment> )}
      {Object.keys(appointmentDetails).length !== 0 && <CitizenDetails details={appointmentDetails} /> }
    </React.Fragment>
  );
};

HomePage.propTypes = {
  details: PropTypes.object
};

export default HomePage;
