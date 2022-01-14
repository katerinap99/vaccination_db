import { Button } from "@material-ui/core";
import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import NavBar from "../components/NavBar";
import DetailsTable from "../components/DetailsTable";
import PropTypes from 'prop-types';
import CertDetails from "../components/CertDetails";

const CertificatePage = () => {
    let { authTokens } = useContext(AuthContext);
    let [certDetails, setCertDetails] = useState([]) ;
    let [certificates, setCertificates] = useState([]) ;
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

        if (response.status === 404){
          alert('Not qualifie for this certificate')
        }
        else if (response.status === 201){
          let data = await response.json()
          setCertDetails(data);
          alert('Certificate issued!');
      }
      else if(response.status===400){
        alert('Certificate already issued!')
      } 
      };

      let getCertificates = async () => {
        var url = new URL("http://127.0.0.1:8000/certificate/");
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
          setCertificates(data);
          if(data.length===0){
            alert("No certificates found!");
          }
        } else {
          alert("No certificates found!");
        }
      };
  return (
    <React.Fragment>
      <NavBar />
      <div style={{ marginLeft: "40%", marginTop: "10%" }}>
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={getCertificates}
        >
          View your certificates
        </Button>
      </div>
      {Object.keys(certificates).length !== 0 && (
        <CertDetails details={certificates} />
      )}
      <div >       
      <Typography variant='h6' style={{marginTop: '4%', marginLeft:'35%'}}>Or select the type of certificate you wish to issue
            </Typography> </div>
      <Grid container spacing={3} style={{ marginLeft:'25%'}}>
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
