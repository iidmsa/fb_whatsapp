import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import Login from "./Login";
import firebase from "firebase";
import { useStateValue } from "./StateProvider";
import { actionTypes } from './reducer';

function App() {

  const [{ user }, dispatch] = useStateValue();

  useEffect(() => (
    firebase.auth().onAuthStateChanged( (user) => {
      if (user) {
        console.log("User is logged in")
        dispatch({
            type: actionTypes.SET_USER,
            user: user,
        });
      }
    })
  ), []);

  return (
    <div className="app">
      {!user ? (
        <Login/>
      ) : (
        <div className="app__body">
        <Router>  
          <Switch>

            <Route path="/rooms/:roomId" >              
              <Sidebar/>
              <Chat/>   
            </Route>

            <Route path="/" >
              <Sidebar/>
              <Chat/>  
            </Route>

          </Switch>
        </Router>
      </div> 
      )}
    </div>
  );
}

export default App;
