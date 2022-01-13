import { Button } from "@material-ui/core";
import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import DistrictSelector from "../components/DistrictSelector";
import DatePicker from "../components/DatePicker";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const HomePage = () => {
  let [notes, setNotes] = useState([]);
  const [district, setDistrict] = useState([]);
  const [date, setDate] = useState([]);
  let selectedSpotAddress ;
  let appointmentDetails = undefined;
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
        appointmentDetails = data;
        console.log(appointmentDetails);
        alert('appointment set for selected date & spot!')
    }else{
        alert('Something went wrong!')
    }
  };

  return (
    <React.Fragment>
      <div>
        <p>You are logged to the home page!</p>
        <Button color="primary" onClick={logoutUser}>
          Logout
        </Button>
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
      <Grid sx={{ flexGrow: 1 }} container spacing={2}>
        <Grid
          container
          spacing={2}
          justify="center"
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          <Grid item>
            <DistrictSelector onChange={(value) => setDistrict(value)} />
          </Grid>
          <Grid item>
            <DatePicker onChange={(value) => setDate(value)} />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={getAvailableSpots}
            >
              Check availability
            </Button>
          </Grid>
        </Grid>
      </Grid> 
      {availableSpots.length>0  &&  appointmentDetails===undefined && (
    <React.Fragment>
      <FormControl component="fieldset">
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
              onClick={makeAppointment}
            >
              Make Appointment 
            </Button>
      </React.Fragment> )}
    </React.Fragment>
  );
};

export default HomePage;
