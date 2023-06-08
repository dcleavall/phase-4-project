import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

function Login() {
  
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {

      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => {
          if (response.status === 401) {
            throw new Error("Invalid login");
          } else if (response.ok) {
            // Process the successful response
          } else {
            throw new Error("Login failed");
          }
        })
        .then((data) => {
          // Handle the successful response
          console.log(data);
        })
        .catch((error) => {
          // Handle errors
          console.error("Error:", error);
        });
    },
  });

  return (
    <div>
      <h1>Login</h1>
      {formik.errors.username && <p>Error: {formik.errors.username}</p>}
      {formik.errors.password && <p>Error: {formik.errors.password}</p>}
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
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Login;