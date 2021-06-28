import { useState, useEffect } from "react";
import React from "react";
// import Avatar from '@material-ui/core/Avatar';
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
//import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
// import Box from '@material-ui/core/Box';
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from "axios";
import Dialogcomponent from "./dialog";
import {Link} from 'react-router-dom';
import { Redirect,useHistory} from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectUser } from "../components/redux_code/userSlice";
import { useSelector } from "react-redux";
import { login_redux } from "../components/redux_code/userSlice";

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

export default function Login() {

  const history = useHistory();

  // const user = useSelector(selectUser);

  const dispatch = useDispatch();

  axios.get("http://localhost:5005/", {
    headers: {
      "content-type": "application/json"
    },
    withCredentials: true
  }).then((res) => {
    if(res.data.isloggedin){
      dispatch(
        login_redux({
          user_name: res.data.name,
          user_id: res.data.user_id,
          isauthenticated : true
        })
      );

      history.push("/home");
      // console.log(res.data);
    }
});

  const classes = useStyles();

  const [login, setlogin] = useState({
    user_mail: "",
    user_password: ""
  });
  const [open, setOpen] = useState(false);
  const [user_login, setuser_login] = useState(false);
  // const [name_user, setname_user] = useState("");

  const handleClosefrdetails = () => {
    setOpen(false);
  };

  const handlefruser_login = () => {
    setuser_login(false);
  };

  function handleChange(event) {
    setlogin((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  }

  function handleClick(event) {
  
    event.preventDefault();
    if (login.user_mail === "" || login.user_password === "") {
      setOpen(true);
    } else {
      axios
        .post("http://localhost:5005/", login, {
          headers: {
            "content-type": "application/json"
          },
          withCredentials: true
        })
        .then((res) => {
          // console.log(res.data);
          if (res.data.isvaliduser) {
            dispatch(
              login_redux({
                user_name: res.data.name,
                user_id: res.data.user_id,
                isauthenticated : true
              })
            );

            history.push({
              pathname:"/home",
            // name_user: res.data.name
          });
          } else {
            setuser_login(true);
          }
        });
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
            value={login.user_mail}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="user_password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
            value={login.user_password}
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
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/forgetpassword">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/registration" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Dialogcomponent
        variable={open}
        fun={handleClosefrdetails}
        heading="Empty Field"
        text="Please fill all the fields"
      />
      <Dialogcomponent
        variable={user_login}
        fun={handlefruser_login}
        heading="Invalid Credentials"
        text="Please Enter correct credentials"
      />
    </Container>
  );
}
