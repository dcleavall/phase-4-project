// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect, Link, useHistory, useLocation } from "react-router-dom";

// Import components
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import "./App.css";

function App() {
  const history = useHistory();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

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
        setLoggedIn(true);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoggedIn(false);
      });
  };

  const handleLogin = (username, password) => {
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Invalid login");
        } else if (response.ok) {
          return response.json();
        } else {
          throw new Error("Login failed");
        }
      })
      .then((data) => {
        console.log(data);
        setLoggedIn(true);
        history.push("/");
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
          return response.json();
        } else {
          throw new Error("Logout failed");
        }
      })
      .then((data) => {
        console.log(data.message);
        console.log(data.user);
        setLoggedIn(false);
        history.push("/login?auth=true");
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


























