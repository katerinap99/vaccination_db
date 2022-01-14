import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function AppointmentsTable(props) {

    const rows = props.details.map((appointment)=>({date: appointment.date, took_place: appointment.took_place, vax_spot: appointment.vax_spot}));

  return (
    <TableContainer component={Paper}>
      <Table sx={{ maxWidth: 650, marginLeft: '27%', marginRight: '20%' }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Took Place</TableCell>
            <TableCell align="right">Vaccination Spot</TableCell>
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
              <TableCell align="right">{row.took_place ===1? 'yes' : 'no'}</TableCell>
              <TableCell align="right">{row.vax_spot}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}