import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function citizenDetails(props) {

    const rows = [{date: props.details.date, vax_spot: props.details.vax_spot, amka: props.details.amka}];
    console.log(rows);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ maxWidth: 650, marginLeft: '27%', marginRight: '20%' }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Vaccination Spot Address</TableCell>
            <TableCell align="right">AMKA</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.date}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.date}
              </TableCell>
              <TableCell align="right">{row.vax_spot}</TableCell>
              <TableCell align="right">{row.amka}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}