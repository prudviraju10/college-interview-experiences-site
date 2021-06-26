import { useState } from "react";
import React from "react";
// import Avatar from '@material-ui/core/Avatar';
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import Link from "@material-ui/core/Link";
// import Grid from "@material-ui/core/Grid";
// import Box from '@material-ui/core/Box';
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from "axios";
// import Button from '@material-ui/core/Button';
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

export default function Register() {
    const classes = useStyles();
  
    const [register, setregister] = useState({
        user_name: "",
      user_mail: "",
      user_password: ""
    });
    const [open, setOpen] = React.useState(false);
    const [email_verifier, setemail_verifier] = useState(false);
    const [welcome_user, setwelcome_user] = useState(false);
    const [wrong_mail, setwrong_mail] = useState(false);
  
    function handleChange(event) {
      setregister((prev) => ({
        ...prev,
        [event.target.name]: event.target.value
      }));
    }

    const handleClosefrdetails = () => {
        setOpen(false);
      };

      const handlefrwelcomeuser = () => {
        setwelcome_user(false);
        // write link to login screen here
      };
    
      const handleClose = () => {
        setemail_verifier(false);
      };

      const handleClosefrwrongmail= () => {
        setwrong_mail(false)
      }
  
    function handleClick(event) {
      event.preventDefault();
      if (
        register.user_name === "" ||
        register.user_mail === "" ||
        register.user_password === ""
      ){
          setOpen(true)
      }
      else{
          if(validator.isEmail(register.user_mail)){
            axios
            .post("http://localhost:5005/register", register, {
              headers: {
                "content-type": "application/json"
              },
              withCredentials: true
            })
            .then((res) => {
              console.log(res.data);
              if(res.data.isdone){
                setwelcome_user(true);
              }
              else{
                setwrong_mail(true)
              }
            });
          }
        else{
            setemail_verifier(true);
        }
    }
    }
  
    return (
        <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <form className={classes.form}>
          <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="user_name"
              label="User name"
              name="user_name"
              autoComplete="off"
              autoFocus
              onChange={handleChange}
              value={register.user_name}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              name="user_mail"
              autoComplete="email"
              onChange={handleChange}
              value={register.user_mail}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="user_password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
              value={register.user_password}
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
              Register
            </Button>
          </form>
        </div>

      <Dialogcomponent variable = {open} fun = {handleClosefrdetails} heading = "Required to fill all the details" text = "Please fill all the three fields" />
      <Dialogcomponent variable = {welcome_user} fun = {handlefrwelcomeuser} heading = "User Successfully Registered" text = "Enter Your Details in the Login page to access the site" />
      <Dialogcomponent variable = {email_verifier} fun = {handleClose} heading = "Invalid email" text = "Please provide a valid email address" />
      <Dialogcomponent variable = {wrong_mail} fun = {handleClosefrwrongmail} heading = "Email Already Registered" text = "The provided email is already registered, pls login, you can get change password link if you forgot the password " />
      
      </Container>
      </div>
    );
  }
  