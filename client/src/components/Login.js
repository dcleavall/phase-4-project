import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

function Login({ onLogin }) {
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
      onLogin(values.username, values.password);
    },
  });

  return (
    <div className="container">
      <h1 className="form-heading">Login</h1>
      {formik.errors.username && <p>Error: {formik.errors.username}</p>}
      {formik.errors.password && <p>Error: {formik.errors.password}</p>}
      <form className="form" onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
          />
        </div>
        <div className="form-group">
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



