import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import "./History.scss";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { auth, db } from "../../../services/config/firebase";
import LoggedIn from "../../auth/components/LoggedIn";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

// components
import LayoutFull from '../components/Layout/LayoutFull';



function createData(subject, tutoring, to_or_from, date_and_time, duration, location, price, payment, score) {
  return { subject, tutoring, to_or_from, date_and_time, duration, location, price, payment, score };
}

const rows = [
  createData('Reactjs', 'take', 'Olivier', '07/11/2021 10:00', '1h','Burggravenlaan 280, 9000 Gent', 12, 'Done', 3),
  createData('Integrals', 'give', 'Manon', '02/11/2021 10:00', '2h','Online', 22, 'Done', 3),
  createData('Integrals', 'give', 'Manon', '01/11/2021 10:00', '2h','Online', 22, 'Done', 3),
  createData('Reactjs', 'take', 'Olivier', '28/10/2021 10:00', '3h','Burggravenlaan 280, 9000 Gent', 36, 'Done', 3),
  createData('Reactjs', 'take', 'Olivier', '22/10/2021 10:00', '1h','Burggravenlaan 280, 9000 Gent', 12, 'Done', 3),
];
function History() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const query = await db
        .collection("users")
        .where("uid", "==", user?.uid)
        .get();
      const data = await query.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);
  
  return ( <>
    <LoggedIn />

    <LayoutFull>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">

        <TableHead>
          <TableRow>
            <TableCell>Subject</TableCell>
            <TableCell align="right">Tutoring</TableCell>
            <TableCell align="right">To or from</TableCell>
            <TableCell align="right">Date and time</TableCell>
            <TableCell align="right">Location</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Payment</TableCell>
            <TableCell align="right">Score</TableCell>
          </TableRow>
        </TableHead>
        
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{row.subject}</TableCell>

              <TableCell align="right">{row.tutoring}</TableCell>
              <TableCell align="right">{row.to_or_from}</TableCell>
              <TableCell align="right">{row.date_and_time}</TableCell>
              <TableCell align="right">{row.location}</TableCell>
              <TableCell align="right">{row.price}</TableCell>
              <TableCell align="right">{row.payment}</TableCell>
              <TableCell align="right">{row.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </LayoutFull>
  </> );
}
export default History;