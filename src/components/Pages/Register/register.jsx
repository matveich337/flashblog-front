import "./register.css";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast } from "react-toastify";

const theme = createTheme();

export default function Register() {
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    passwordMismatch: "",
  });

  const [data, setData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  const handleLoginRedirect = () => routeChange("/login");
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
    setLoading(true);
    fetch("http://localhost:8080/api/accounts/register", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        username: data.username,
        password: data.password,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.email) {
          for (const [key, value] of Object.entries(res.errors)) {
            setError(`${key}`, value, value);
          }
          return;
        }
        toast(
          `Account registration complete, please activate it via email instruction`
        );
        handleLoginRedirect();
      })
      .then(() => setLoading(false));
  };

  let error = false;

  const validateFields = () => {
    error = false;
    setErrors((state) => ({
      ...state,
      email: "",
      username: "",
      password: "",
      passwordMismatch: "",
    }));

    setError("email", "Email cannot be empty", !data?.email);
    setError("username", "Username cannot be empty", !data?.username);
    setError("password", "Password cannot be empty", !data?.password);

    setError(
      "passwordMismatch",
      "Passwords don't match",
      data.confirmPassword !== data.password
    );

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
      <div className="register-main">
        <Container
          className="register-main-form"
          component="main"
          maxWidth="xs"
        >
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Sign up
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
                error={Boolean(errors?.username)}
                helperText={errors?.username}
                required
                fullWidth
                name="username"
                label="Username"
                type="username"
                id="username"
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
              />
              <TextField
                variant="standard"
                margin="normal"
                onChange={handleChange}
                required
                fullWidth
                error={Boolean(errors?.passwordMismatch)}
                helperText={errors?.passwordMismatch}
                name="confirmPassword"
                label="Confirm password"
                type="password"
                id="confirmPassword"
              />
              <Button
                id="registerButton"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "black", color: "white" }}
              >
                {loading ? <CircularProgress color="inherit" /> : "Register"}
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
                    onClick={handleLoginRedirect}
                    variant="body2"
                    id="login"
                  >
                    {"Login"}
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
