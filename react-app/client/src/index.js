import React from "react";
import ReactDOM from "react-dom";
//import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./components/redux_code/store";



ReactDOM.render(
<Provider store = {store}><App />
</Provider>, document.getElementById("root"));
