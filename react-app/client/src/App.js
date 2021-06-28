import React from "react";
import Navbar from "./components/Navbar/index";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import About from "./pages/About";
import Home from "./pages/home";
import Writeblog from "./pages/writeblog";
import Dashboard from "./pages/dashboard";
import Lost from "./pages/lost";
import Login from "./pages/login";
import Register from "./pages/registration";
import Viewpost from "./pages/viewingpost";
import Forgetpassword from "./pages/forgetpassword";
import { selectUser } from "./components/redux_code/userSlice"
import { useSelector } from "react-redux";

function App() {
  const user = useSelector(selectUser);
  return (
    <Router>
      <Navbar />
      <Switch>
        {/* <Route exact path="/" component={About} /> */}
        {user != null && user.isauthenticated && <Route exact path="/home" component={Home} />}
        {user != null && user.isauthenticated && <Route exact path="/writeblog" component={Writeblog} />}
        {user != null && user.isauthenticated && <Route exact path="/dashboard" component={Dashboard} />}
        <Route exact path="/" component={Login} />
        <Route exact path="/registration" component={Register} />
        <Route exact path="/forgetpassword" component={Forgetpassword} />
        <Route exact path="/posts/:name" component={Viewpost} />
        {/* <Route component={Lost} /> */}
        <Route exact path="*" component={Login} />
      </Switch>
    </Router>
  );
}

export default App;
