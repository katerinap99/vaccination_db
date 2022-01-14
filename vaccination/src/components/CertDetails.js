import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function CertDetails(props) {

    const rows = props.details.map((cert)=>({issue_date: cert.issue_date, type: cert.type, amka: cert.amka}));;
    console.log(rows);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ maxWidth: 650, marginLeft: '27%', marginRight: '20%' }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Issue Date</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">AMKA</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.issue_date}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.issue_date}
              </TableCell>
              <TableCell align="right">{row.type}</TableCell>
              <TableCell align="right">{row.amka}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
