import React, { useState, useEffect, createContext } from "react";
import { useHistory } from "react-router-dom";

const AuthContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const history = useHistory();


  useEffect(() => {
      fetch("/authorized")
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            console.log("Unexpected response:", response);
            setUser(null)
            throw new Error("Authorization failed");
          }
        })
        .then((data) => {
         
          setUser(data);
        })
        .catch((error) => {
          console.error("Error:", error);
    
        });


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
            setUser(null)
          throw new Error("Login failed");
        }
      })
      .then((data) => {
        console.log(data);
       
        setUser(data);
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
    
          setUser(null);
          // history.push("/login?auth=true");
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

  const updateUser = (updatedData) => {
    fetch("/patch-user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (response.ok) {
          // Handle the success case if necessary
          console.log("User updated successfully");
        } else {
          throw new Error("Failed to update user");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  



  return (
    <AuthContext.Provider
      value={{
        user,
        handleLogin,
        handleLogout,
        deleteUser,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, UserProvider };




