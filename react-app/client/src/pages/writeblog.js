import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from "axios";
// import Select from "@material-ui/core/Select";
// import FormControl from "@material-ui/core/FormControl";
// import InputLabel from "@material-ui/core/InputLabel";
// import MenuItem from "@material-ui/core/MenuItem";
// import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { selectUser } from "../components/redux_code/userSlice";
import { useSelector } from "react-redux";


import "./styles.css";
import { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

export default function Writeblog() {
  const classes = useStyles();
  const user = useSelector(selectUser);


  const [new_blog, set_new_blog] = useState({
    c_name: "",
    c_role: "",
    branch: "",
    desc: "",
    u_name:user.user_name,
    userid: user.user_id,
    title:""
  });

  const [company_list, setcompany_list] = useState([]);
  const [companyrole_list, setcompanyrole_list] = useState([]);
  let company_map = new Map();
 
  axios.get("http://localhost:5005/companies", {
    headers: {
      "content-type": "application/json"
    },
    withCredentials: true
  }).then((res) => {
    console.log(res.data);
    res.data.forEach(element => {
      console.log(element);
      setcompany_list(company_list => [...company_list, element.company_name]);
      company_map.set(element.company_name, element.company_roles);
    });
  });

  // useEffect(()) for change in select company_name

  // var company_list = ["Amazon", "Google", "Tcs", "Wipro", "Infosys"];
  // var companyrole_list = ["Amazon", "Google", "Tcs", "Wipro"];
  const branches_list = ["Cse", "Ece", "Civil", "Mechanical", "IT", "Chemical"];
  

  // you need to pass the username through props to Writeblog,, then u_name in new_blog will be props.username

  function handleChange(event) {
    set_new_blog((prevValue) => ({
      ...prevValue,
      [event.target.name]: event.target.value
    }));
  }

  function buttonEvent(event) {
    event.preventDefault();
    if (
      new_blog.c_name === "" ||
      new_blog.c_role === "" ||
      new_blog.branch === "" ||
      new_blog.title === ""
    ) {
      window.alert("Please Select all options");
    } else {
      if (window.confirm("Do you want to do final Submit")) {
        console.log(new_blog);
        axios.get("http://localhost:5005/test",{
          headers: {
            "content-type": "application/json"
          },
        withCredentials: true,
         }).then((res) => {
          //  var posts_data = JSON.parse(res.data);
          console.log(res.data);
        });
        // const article = JSON.stringify({ title: "this is" });
        console.log("hjjkfghfhg");
        axios
          .post(
            "http://localhost:5005/testingreact",
            new_blog,{
            headers: {
              "content-type": "application/json"
            },
          withCredentials: true,
           })
          .then((res) => {
            console.log(res.data);
          });
        set_new_blog({ c_name: "", c_role: "", branch: "", desc: "", title:"" });
      }
    }
  }

  return (
    <div className={classes.root}>
      <form>
        <Container maxWidth="md">
          <Grid container spacing={2} alignItems="center" justify="center">
            <Grid item xs={12}>
              <Typography
                style={{ padding: "0px", margin: "0px 0px" }}
                variant="h4"
                color="primary"
              >
                This is a sample Text
              </Typography>
            </Grid>
            <Grid item spacing={3} direction="column" xs={4}>
              <Typography color="primary">Select These Options</Typography>
              <Grid item xs>
            <TextField 
            id="standard-basic" 
            label="Title"
            name="title"
            value = {new_blog.title}
            onChange = {handleChange}
            fullWidth = {true}
             />
            </Grid>
              <Grid item xs style={{ margin: "16px 0px" }}>
                <label> select company name </label>
                <select
                  name="c_name"
                  value={new_blog.c_name}
                  onChange={handleChange}
                  id="cars"
                  required
                >
                  <option value="" selected disabled hidden>
                    Select an Option
                  </option>
                  {company_list.map((element) => (
                    <option key={element} value={element}>
                      {element}
                    </option>
                  ))}
                </select>
              </Grid>
              <Grid item xs style={{ marginBottom: "16px" }}>
                <label> select role </label>
                <select
                  name="c_role"
                  value={new_blog.c_role}
                  onChange={handleChange}
                  id="cars"
                  required
                >
                  <option value="" selected disabled hidden>
                    Select an Option
                  </option>
                  {companyrole_list.map((element) => (
                    <option key={element} value={element}>
                      {element}
                    </option>
                  ))}
                </select>
              </Grid>
              <Grid items xs style={{ marginBottom: "16px" }}>
                <label> select branch </label>
                <select
                  name="branch"
                  value={new_blog.branch}
                  onChange={handleChange}
                  id="cars"
                  required
                >
                  <option value="" selected disabled hidden>
                    Select an Option
                  </option>
                  {branches_list.map((element) => (
                    <option key={element} value={element}>
                      {element}
                    </option>
                  ))}
                </select>
              </Grid>
            </Grid>
            <Grid item xs={8}>
              <Typography color="primary">Write Your Experience</Typography>
              <textarea
                rows="19"
                cols="65"
                value={new_blog.desc}
                name="desc"
                onChange={handleChange}
                style={{ fontSize: "16px" }}
              />
            </Grid>
            <Grid>
              <Grid item>
                <Button
                  type="submit"
                  variant="outlined"
                  color="primary"
                  onClick={(event) => {
                    buttonEvent(event);
                  }}
                >
                  Post
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </form>
    </div>
  );
}
