import React from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";


const SignupSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
});

function Signup() {
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);

  const handleSubmit = async (values) => {
    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
  
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setError(null);
      } else {
        throw new Error("Sign up failed");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
    validationSchema: SignupSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div>
      <h1>Signup</h1>
      {error && <p>Error: {error}</p>}
      {user && <p>User: {JSON.stringify(user)}</p>}
      <form onSubmit={formik.handleSubmit}>
        <div>
            <label>Username</label>
            <input 
                type="text"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
            />
        </div>
        <div>
            <label>Email</label>
            <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
            />
        </div>
        <div>
            <label>Password</label>
            <input
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
            />
        </div>
        <div>
            <label>First Name</label>
            <input
                type="text"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
            />
        </div>
        <div>
            <label>Last Name</label>
            <input
                type="text"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
            />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Signup;
