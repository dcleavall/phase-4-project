import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// Import components
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
 

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await fetch("/authorized");
      if (response.ok) {
        const data = await response.json();
        setLoggedIn(data);
      } else {
        setLoggedIn(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoggedIn(false);
    }
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
  
    setLoggedIn(false);
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
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
