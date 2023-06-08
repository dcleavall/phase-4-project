import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// Import components
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";



function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const fetchUser = () => {
    fetch("/authorized")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          setLoggedIn(false); // User is not logged in
        } else {
          console.log("Unexpected response:", response);
          setLoggedIn(false);
        }
      })
      .then((data) => {
        if (data) {
          setLoggedIn(data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoggedIn(false);
      });
  };
  
  useEffect(() => {
    fetchUser();
  }, []);


  // Function to handle user login
  const handleLogin = () => {

    setLoggedIn(true);
  };

   // Function to handle user logout
   const handleLogout = () => {
    fetch("/logout", { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          setLoggedIn(false); // Logout successful, set 'loggedIn' state to false
        } else {
          console.log("Logout failed:", response);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {!loggedIn && (
              <>
                <li>
                  <Link to="/signup">Signup</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
              </>
            )}
            {loggedIn && (
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </nav>

        <Switch>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/login">
            <Login onLogin={handleLogin} />
          </Route>
          {loggedIn && (
            <Route path="/">
              <Home />
            </Route>
          )}
        </Switch>
      </div>
    </Router>
  );
}

export default App;

