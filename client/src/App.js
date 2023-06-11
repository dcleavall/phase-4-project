import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect, Link, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";

// Import components
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import "./App.css";

function App() {
  const history = useHistory();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  
  const fetchUser = () => {
    fetch("/authorized")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log("Unexpected response:", response);
          throw new Error("Authorization failed");
        }
      })
      .then((data) => {
        setLoggedIn(data); // Update loggedIn state based on the response
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoggedIn(false);
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogin = () => {
    const username = 'username';
    const password = 'password';
  
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse the response as JSON
        } else {
          throw new Error("Login failed"); // Throw an error if the response is not ok
        }
      })
      .then((data) => {
        console.log(data.message); // Log the login success message
        console.log(data.user); // Log the user object
        setLoggedIn(true); // Set 'loggedIn' state to true
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  
  

  const handleLogout = () => {
    fetch("/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse the response as JSON
        } else {
          throw new Error("Logout failed"); // Throw an error if the response is not ok
        }
      })
      .then((data) => {
        console.log(data.message); // Log the response message to the console
        console.log(data.user); // Log the user object
        setLoggedIn(false); // Logout successful, set 'loggedIn' state to false
        history.push("/login?auth=true"); // Redirect to the login page with authorization parameter
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Router>
      <div className="container">
        {loggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : null}

        <Switch>
          <Route exact path="/">
            {loggedIn ? (
              <Home />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>

          <Route path="/signup">
            {loggedIn ? (
              <Redirect to="/" />
            ) : (
              <Signup />
            )}
          </Route>

          <Route path="/login">
            {loggedIn ? (
              <Redirect to="/" />
            ) : (
              <Login onLogin={handleLogin} />
            )}
          </Route>
        </Switch>

        {!loggedIn && location.pathname !== "/signup" && (
          <div className="signup-link">
            <Link to="/signup">Signup</Link>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;


























