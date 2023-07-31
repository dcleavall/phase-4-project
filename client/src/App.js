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
import CustomCalendar from "./components/calendar/Calendar";
import Particles from "./components/ParticlesComponent"

function Unauthorized() {
  const history = useHistory();
  const {handleLogin} = useContext(AuthContext);
  return <Router>
  <Particles id="tsparticles" />
  <div className="container">
    <DndProvider backend={HTML5Backend}>  
      <Switch>
        
       

        <Route path="/signup">
            <Signup />
        </Route>

        <Route path="/login">
            <Login onLogin={(username, password) => handleLogin(username, password, history)} />
        </Route>
        <Route path="/">
          <Redirect to="/login" />
          </Route>

       
      </Switch>
    </DndProvider>
            </div>
            </Router>
}

function Authorized() {
  const history = useHistory();
  const {user, handleLogout, deleteUser, updateUser } = useContext(AuthContext);
  return <Router>
     <div className="container">
        <DndProvider backend={HTML5Backend}>
        <Switch>
            
            <Route exact path="/">
             
                  <Home user={user} />
               
            </Route>
            <Route path="/account">
                <UserCard user={user} deleteUser={() => deleteUser(history)} handleLogout={() => handleLogout(history)} updateUser={() => updateUser(history)}/>
             
            </Route>

            <Route path="/about">
                <About user={user} handleLogout={() => handleLogout(history)}/>
             
            </Route>
            <Route path="/dashboard">
             
                <Dashboard user={user} handleLogout={() => handleLogout(history)}/>
            </Route>

            <Route path="/noteboard">
              
                <Noteboard user={user} handleLogout={() => handleLogout(history)}/>
             
            </Route>

            <Route path="/exercises">
                <Exercise user={user}/>
            </Route>

            <Route path="/nutrition">
                <Nutrition user={user}/>
            </Route>
            <Route path="/mindfulness">
                <Mindfulness user={user}/>
            </Route>
            <Route path="/calendar">
                <CustomCalendar user={user} handleLogout={handleLogout}/>
            </Route>
            <Route path="/">
              <Redirect to="/" />
              </Route>
            </Switch>
            </DndProvider>
            </div>
  </Router>
}


function App() {

  const location = useLocation();
  const { user } = useContext(AuthContext);
  
  if(user === undefined) return <p>Loading...</p>

  return (
    <>
    {user ? <Authorized /> : <Unauthorized />}
    
        {!user && location.pathname === "/login" && (
          <div className="signup-link">
            <Link to="/signup" className="signup-button"></Link>
          </div>
        )}
</>

  );
}

export default App;






































