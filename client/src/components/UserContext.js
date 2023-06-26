import React, { useState, useEffect, createContext } from "react";
import { useHistory } from "react-router-dom";

const AuthContext = createContext();

const UserProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState();
  const history = useHistory();

  useEffect(() => {
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
          setUser(data);
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoggedIn(false);
        });
    };

    fetchUser();
  }, []);

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
        setUser(data || {});
        history.push("/");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleLogout = (history) => {
    fetch("/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          setLoggedIn(false);
          setUser(null);
          history.push("/login?auth=true");
        } else {
          throw new Error("Logout failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const deleteUser = (history) => {
    fetch("/delete-user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: user.user_id }),
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
    <AuthContext.Provider
      value={{
        loggedIn,
        user,
        handleLogin,
        handleLogout,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, UserProvider };




