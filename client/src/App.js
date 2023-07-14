import { useContext } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect, Link, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';



// Import components
import { AuthContext } from "./components/UserContext";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import UserCard from "./components/UserCard";
import About from "./components/About";
import Dashboard from "./components/Dashboard";
import Noteboard from "./components/Noteboard";
import Exercise from "./components/Exercise";
import Nutrition from "./components/Nutrition";
import Mindfulness from "./components/Mindfulness";
import CustomCalender from "./components/calender/Calender";


function App() {

  const location = useLocation();
  const history = useHistory();
  const { user, handleLogin, handleLogout, deleteUser, updateUser } = useContext(AuthContext);
  
  if(user === undefined) return <p>Loading...</p>

  return (
    <Router>
      <div className="container">
        <DndProvider backend={HTML5Backend}>  
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
                <UserCard user={user} deleteUser={() => deleteUser(history)} handleLogout={() => handleLogout(history)} updateUser={() => updateUser(history)}/>
              ) : (
                <Redirect to="/login" />
              )}
            </Route>

            <Route path="/about">
              {user ? (
                <About user={user} handleLogout={() => handleLogout(history)}/>
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route path="/dashboard">
              {user ? (
                <Dashboard user={user} handleLogout={() => handleLogout(history)}/>
              ) : (
                <Redirect to="/login" />
              )}
            </Route>

            <Route path="/noteboard">
              {user ? (
                <Noteboard user={user} handleLogout={() => handleLogout(history)}/>
              ) : (
                <Redirect to="/login" />
              )}
            </Route>

            <Route path="/exercises">
              {user ? (
                <Exercise user={user}/>
              ) : (
                <Redirect to="/login" />
              )}
            </Route>

            <Route path="/nutrition">
              {user ? (
                <Nutrition user={user}/>
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route path="/mindfulness">
              {user ? (
                <Mindfulness user={user}/>
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route path="/calender">
              {user ? (
                <CustomCalender user={user}/>
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
          </Switch>
        </DndProvider>

        {!user && location.pathname === "/login" && (
          <div className="signup-link">
            <Link to="/signup" className="signup-button"></Link>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;







































