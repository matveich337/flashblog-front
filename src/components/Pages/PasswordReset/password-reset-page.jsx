import "./password-reset-page.css";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { toast } from "react-toastify";

const theme = createTheme();

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
  });

  const [data, setData] = useState({
    email: "",
  });

  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  const handleRegisterRedirect = () => routeChange("/register");
  const handleLoginRedirect = () => routeChange("/login");

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    console.log(data);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateFields()) {
      fetchAccountForgetPassword();
    }
  };

  const fetchAccountForgetPassword = () => {
    setLoading(true);
    fetch(`http://localhost:8080/api/accounts/password/forgot`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ email: data.email }),
    })
      .then((res) => res.text())
      .then((text) => {
        console.log(text);
        if (text.length) {
          for (const [key, value] of Object.entries(JSON.parse(text).errors)) {
            setError(`${key}`, value, value);
            return;
          }
        } else {
          toast(`Please check your email for next step`);
          handleLoginRedirect();
        }
      })
      .then(() => setLoading(false));
  };

  let error = false;

  const validateFields = () => {
    error = false;
    setErrors((state) => ({
      ...state,
      email: "",
    }));

    setError("email", "Email cannot be empty", !data?.email);

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
      <div className="password-reset-main">
        <Container
          className="password-reset-main-form"
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
              Forgot your password?
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
                label="Enter your email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <Button
                id="submitEmail"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "black", color: "white" }}
              >
                {loading ? (
                  <CircularProgress color="inherit" />
                ) : (
                  "Change password"
                )}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link
                    onClick={handleLoginRedirect}
                    sx={{ cursor: "pointer" }}
                    variant="body2"
                    id="loginLink"
                  >
                    Login
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    sx={{ cursor: "pointer" }}
                    onClick={handleRegisterRedirect}
                    variant="body2"
                    id="registerLink"
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
