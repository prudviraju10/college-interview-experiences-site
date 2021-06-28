import React, { Component } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import { selectUser } from "../components/redux_code/userSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
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
const Home = (props) => {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  // console.log(props.location.name_user);
  // u will have user name in props.location.name_user
  const user = useSelector(selectUser);


  console.log(user);

  function handleClick(event) {
    axios
      .post(
        "http://localhost:5005/logout",
        {},
        {
          headers: {
            "content-type": "application/json"
          },
          withCredentials: true
        }
      )
      .then((res) => {
        console.log(res.data);
        dispatch(
          login_redux(null)
        );

        history.push("/");
      });
  }

  return (
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
  );
};
export default Home;
