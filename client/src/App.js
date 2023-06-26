import { useContext } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect, Link, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";



// Import components
import { AuthContext } from "./components/UserContext";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import UserCard from "./components/UserCard";


function App() {

  const location = useLocation();
  const history = useHistory();
  const { loggedIn, user, handleLogin, handleLogout, deleteUser } = useContext(AuthContext);
  


  return (
    <Router>
      <div className="container">
        {loggedIn && <button onClick={() => handleLogout(history)}>Logout</button>}

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
              <Login onLogin={(username, password) => handleLogin(username, password, history)} />
            )}
          </Route>

          <Route path="/account">
            {loggedIn ? (
              <UserCard user={user} deleteUser={() => deleteUser(history)}  />
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







































