import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

const SignupSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
});

function Signup({ loggedIn }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleSubmit = (values) => {
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (response.status === 409) {
          throw new Error('Email already exists. Please choose a different email.');
        } else if (response.ok) {
          return response.json();
        } else {
          throw new Error('Sign up failed');
        }
      })
      .then((data) => {
        setUser(data);
        setError(null);
        history.push('/login'); // Redirect to the login page after successful signup
      })
      .catch((error) => {
        setUser(null);
        setError(error.message);
        console.error('Error:', error);
      });
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
    validationSchema: SignupSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="container">
      <h1>Signup</h1>
      {error && <p className="error">Error: {error}</p>}
      {user && <p>User: {JSON.stringify(user)}</p>}
      <form onSubmit={formik.handleSubmit}>
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
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
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
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
          />
        </div>
        {user === null && !formik.isSubmitting && (
          <button type="submit">Submit</button>
        )}
      </form>
      <div className="return-link">
        {user === null && (
          <Link to="/">Return to Login</Link>
        )}
      </div>
    </div>
  );
}

export default Signup;












