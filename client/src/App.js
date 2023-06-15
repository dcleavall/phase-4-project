import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect, Link, useHistory, useLocation } from "react-router-dom";

// Import components
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import UserCard from "./components/UserCard";
import "./App.css";

function App() {
  const history = useHistory();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

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
        console.log(data);
        setLoggedIn(true);
        setUser(data || null); // Set the user data in state, or null if not available
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
        setUser(data || null); // Set the user data in state, or null if not available
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
          setLoggedIn(false);
          setUser(null); // Reset the user data
          history.push("/login?auth=true");
        } else {
          throw new Error("Logout failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const deleteUser = () => {
    fetch('/delete-user', {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      // Include any necessary information to identify the user to be deleted
      body: JSON.stringify({ id: user.id }), // Replace `user.id` with the correct property name
    })
      .then((response) => {
        if (response.ok) {
          setLoggedIn(false);
          setUser(null);
          history.push("/login?deleted=true");
        } else {
          throw new Error("Failed to delete user");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Router>
      <div className="container">
        {loggedIn && <button onClick={handleLogout}>Logout</button>}

        <Switch>
          <Route exact path="/">
            {loggedIn ? (
              <>
                <Home user={user} />
              </>
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

          <Route path="/account">
            {loggedIn ? (
              <UserCard user={user} deleteUser={deleteUser} />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
        </Switch>

        {!loggedIn && location.pathname === "/login" && (
          <div className="signup-link">
            <Link to="/signup" className="signup-button">Signup</Link>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;



































