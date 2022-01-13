import { Button } from "@material-ui/core";
import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import NavBar from "../components/NavBar";
import DetailsTable from "../components/DetailsTable";
import PropTypes from 'prop-types';


const CertificatePage = () => {
    let { authTokens } = useContext(AuthContext);
    let [certDetails, setCertDetails] = useState([]) ;
    let issueCert = async (type) => {
        let response = await fetch('http://127.0.0.1:8000/certificate/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization: "Bearer " + String(authTokens.access),
                'Access-Control-Allow-Origin': '*'
            },
            body:JSON.stringify({'type':type})
        })
        let data = await response.json()
    
        if(response.status === 201){
            setCertDetails(data);
            alert('Certificate issued!');
        }else{
            alert('No matching certificate found')
        }
      };
  return (
    <React.Fragment>
      <NavBar />
      <Typography variant='h6' style={{marginTop: '12%', marginLeft:'35%'}}>Please select the type of certificate you wish to issue
            </Typography>
      <Grid container spacing={3} style={{marginTop: '4%', marginLeft:'25%'}}>
        <Grid item xs="auto">
        <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={()=>issueCert('desease')}
            >
              Disease Certificate
            </Button>
        </Grid>
        <Grid item xs="auto">
        <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={()=>issueCert('test')}
            >
              Negative Test Certificate
            </Button>
        </Grid>
        <Grid item xs="auto">
        <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={()=>issueCert('vax')}
            >
              Vaccination Certificate
            </Button>
        </Grid>
      </Grid>
      {Object.keys(certDetails).length !== 0 && <DetailsTable details={certDetails} />}
      </React.Fragment>
  );
};

CertificatePage.propTypes = {
    details: PropTypes.object
  };
export default CertificatePage;
