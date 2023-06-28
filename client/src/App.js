import { useContext } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect, Link, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";



// Import components
import { AuthContext } from "./components/UserContext";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import UserCard from "./components/UserCard";
import About from "./components/About";
import Dashboard from "./components/Dashboard";
import Noteboard from "./components/Noteboard";


function App() {

  const location = useLocation();
  const history = useHistory();
  const { user, handleLogin, handleLogout, deleteUser } = useContext(AuthContext);
  
  if(user === undefined) return <p>Loading...</p>

  return (
    <Router>
      <div className="container">
        {user && <button onClick={() => handleLogout(history)}>Logout</button>}

        <Switch>
          <Route exact path="/">
            {user ? (
              <>
                <Home user={user} />
              </>
            ) : (
              <Redirect to="/login" />
            )}
          </Route>

          <Route path="/signup">
            {user ? (
              <Redirect to="/" />
            ) : (
              <Signup />
            )}
          </Route>

          <Route path="/login">
            {user ? (
              <Redirect to="/" />
            ) : (
              <Login onLogin={(username, password) => handleLogin(username, password, history)} />
            )}
          </Route>

          <Route path="/account">
            {user ? (
              <UserCard user={user} deleteUser={() => deleteUser(history)} />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>

          <Route path="/about">
            {user ? (
              <About user={user}/>
            ) : (
              <Redirect to="/login" />
            )}
          </Route>

          <Route path="/dashboard">
            {user ? (
              <Dashboard user={user}/>
            ) : (
              <Redirect to="/login" />
            )}
          </Route>

          <Route path="/noteboard">
            {user ? (
              <Noteboard user={user}/>
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
        </Switch>

        {!user && location.pathname === "/login" && (
          <div className="signup-link">
            <Link to="/signup" className="signup-button">Signup</Link>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;







































