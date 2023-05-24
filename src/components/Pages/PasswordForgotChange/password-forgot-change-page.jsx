import "./password-forgot-change-page.css";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { toast } from "react-toastify";

const theme = createTheme();

export default function PasswordForgotChangePage() {
  const params = useParams();

  const [errors, setErrors] = useState({
    token: "",
    password: "",
    passwordMismatch: "",
  });

  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });

  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  const handleLoginRedirect = () => routeChange("/login");

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateFields()) {
      fetchAccountForgetPassword();
      handleLoginRedirect();
    }
  };

  const fetchAccountForgetPassword = () => {
    fetch(
      `http://localhost:8080/api/accounts/password/forgot/change/${params.passwordResetToken}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ newPassword: data.password }),
      }
    )
      .then((res) => res.text())
      .then((text) => {
        if (text.length) {
          for (const [key, value] of Object.entries(JSON.parse(text).errors)) {
            if (key === "token") {
              toast(value, {
                progressClassName: "red-progress",
              });
            } else {
              setError(`${key}`, value, value);
            }
            return;
          }
        } else {
          toast(`Password changed succesfully`);
        }
      });
  };

  let error = false;

  const validateFields = () => {
    error = false;
    setErrors((state) => ({
      ...state,
      password: "",
      passwordMismatch: "",
    }));

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
      <div className="password-forgot-change">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              paddingLeft: 15,
              paddingRight: 15,
              paddingBottom: 5,
              paddingTop: 5,
              borderRadius: "20px",
              border: 2,
            }}
          >
            <Typography component="h1" variant="h5">
              Change your password
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
                id="changePasswordButton"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "black", color: "white" }}
              >
                Change password
              </Button>
            </Box>
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}
