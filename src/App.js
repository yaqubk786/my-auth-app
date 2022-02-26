import React, { useEffect, useState } from "react";
import './App.css';

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
//router
import { BrowserRouter as  Router, Routes, Route, } from "react-router-dom";

//components
import Home from './components/Home.js'
import SignIn from './components/SignIn.js'

const App = () => {
  const [viewOtpForm, setViewOtpForm] = useState(false);
  const [user, setUser] = useState(false);

  
  const firebaseConfig = {
    apiKey: "AIzaSyA3942Ehln9pp30KQK0QXlmG_WaL4HqWig",
    authDomain: "my-auth-app-83c9e.firebaseapp.com",
    projectId: "my-auth-app-83c9e",
    storageBucket: "my-auth-app-83c9e.appspot.com",
    messagingSenderId: "448482298432",
    appId: "1:448482298432:web:ff50736a4b23f63a086da5"
    
  };

  useEffect(() => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: function (response) {
          console.log("Captcha Resolved");
          this.onSignInSubmit();
        },
        defaultCountry: "IN",
      }
    );
  }, []);

  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }

  const auth = firebase.auth();

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    }
  });

  const loginSubmit = (e) => {
    e.preventDefault();

    let phone_number = "+91" + e.target.phone.value;
    const appVerifier = window.recaptchaVerifier;

    auth
      .signInWithPhoneNumber(phone_number, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        console.log("otp sent");
        setViewOtpForm(true);
        window.confirmationResult = confirmationResult;
        // ...
      })
      .catch((error) => {
        // Error; SMS not sent
        // ...
        alert(error.message);
      });
  };

  const otpSubmit = (e) => {

    e.preventDefault();

    let opt_number = e.target.otp_value.value;

    window.confirmationResult.confirm(opt_number).then((confirmationResult) => {
        console.log(confirmationResult);
        console.log("success");
        window.open("/", "_self");
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        alert(error.message);
      });
  };

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        window.open("/signin", "_self");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  return (
    <Router>
      <div id="recaptcha-container"></div>
      <Routes>
        <Route path="/" element={ <Home signOut={signOut} user={user} />}></Route>
        <Route path="/signin" element={ <SignIn loginSubmit={loginSubmit} otpSubmit={otpSubmit} viewOtpForm={viewOtpForm}/>}> </Route>
      </Routes>
    </Router>
  );
};

export default App;