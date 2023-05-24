import "./login.css";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";

const theme = createTheme();

export default function LogIn() {
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  const handleRegisterRedirect = () => routeChange("/register");
  const handlePostPageRedirect = () => routeChange("/posts");
  const handlePasswordResetRedirect = () => routeChange("/password/reset");

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateFields()) {
      fetchSingIn();
    }
  };

  const fetchSingIn = () => {
    fetch("http://localhost:8080/api/accounts/login", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ email: data.email, password: data.password }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.authorizationToken) {
          for (const [key, value] of Object.entries(res.errors)) {
            setError(`${key}`, value, value);
          }
          return;
        }
        localStorage.setItem("token", res.authorizationToken);
        handlePostPageRedirect();
      });
  };

  let error = false;

  const validateFields = () => {
    error = false;
    setErrors((state) => ({
      ...state,
      email: "",
      password: "",
    }));

    setError("email", "Email cannot be empty", !data?.email);
    setError("password", "Password cannot be empty", !data?.password);

    return error;
  };

  const setError = (type, errorString, condition) => {
    if (condition) {
      error = true;
      setErrors((state) => ({ ...state, [type]: errorString }));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="login-main">
        <Container className="login-main-form" component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                variant="standard"
                margin="normal"
                onChange={handleChange}
                error={Boolean(errors?.email)}
                helperText={errors?.email}
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                variant="standard"
                margin="normal"
                onChange={handleChange}
                error={Boolean(errors?.password)}
                helperText={errors?.password}
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                id="loginButton"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "black", color: "white" }}
              >
                login
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link
                    sx={{ cursor: "pointer" }}
                    onClick={handlePasswordResetRedirect}
                    variant="body2"
                    id="forgotPassword"
                  >
                    Forgot password
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    sx={{ cursor: "pointer" }}
                    onClick={handleRegisterRedirect}
                    variant="body2"
                    id="register"
                  >
                    {"Register"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
}
