import { useState } from "react";
import React from "react";
// import Avatar from '@material-ui/core/Avatar';
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
// import Box from '@material-ui/core/Box';
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from "axios";
import validator from 'validator'
import Dialogcomponent from "./dialog";

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1)
    },
    submit: {
      margin: theme.spacing(3, 0, 2)
    }
  }));

  export default function Forgotpassword() {
    const classes = useStyles();

    const [user_mail, setmail] = useState("");
    const [nomail, setnomail] = useState(false);
    const [validmail, setvalidmail] = useState(false);
    const [sentmail, setsentmail] = useState(false);

    function handleChange(event) {
        setmail(event.target.value);
      }
    
    const handlefrnomail = () => {
        setnomail(false);
      };
    
    const handlefrvalidmail = () => {
        setvalidmail(false);
      };

    const handlefrsentmail = () => {
        setsentmail(false);
        // write link for login page again
      };

    function handleClick(event) {
        event.preventDefault();
        if(validator.isEmail(user_mail)){

           axios
             .post("http://localhost:5005/resetlinkroute", {user_mail}, {
                headers: {
                    "content-type": "application/json"
                 },
                withCredentials: true
            })
            .then((res) => {
                console.log(res.data);
                if(res.data.isvalidmail){
                    setsentmail(true);
                }
                else{
                    setvalidmail(true);
                }
           });
         }
         else{
             setnomail(true)
         }
      }

    return (
        <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="user_mail"
            autoComplete="email"
            autoFocus
            onChange={handleChange}
            value={user_mail}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={(event) => {
              handleClick(event);
            }}
          >
            Send mail
          </Button>
        </form>
      </div>
      {/* <Dialog
        open={nomail}
        onClose={handlefrnomail}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Invalid Email"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please provide a valid email
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlefrnomail} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog> */}
      <Dialogcomponent variable = {nomail} fun = {handlefrnomail} heading = "Invalid Email" text = "Please provide a valid email" />
      <Dialogcomponent variable = {validmail} fun = {handlefrvalidmail} heading = "You are not Registered" text = "Mail enntered is not registered, please provide registered mail or go to login for registraion" />
      <Dialogcomponent variable = {sentmail} fun = {handlefrsentmail} heading = "Reset Password Link Sent!!" text = "Please Check Your Mail and change the password. log back soon!!!" />
    </Container>
    );



}