import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as React from "react";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./account-profile-page.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function AccountProfilePage() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    username: "",
  });

  const [dataFormInfo, setDataFormInfo] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    passwordMismatch: "",
  });

  const [openDataModal, setOpenDataModal] = useState(false);

  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  let navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLoginRedirect = () => routeChange("/login");

  const routeChange = (path) => {
    navigate(path);
  };

  useEffect(() => {
    if (!token) {
      toast("Please Sign in first", {
        progressClassName: "red-progress",
      });
      handleLoginRedirect();
    }
    fetchUserInfo();
  }, [token]);

  const fetchUserInfo = () => {
    fetch("http://localhost:8080/api/user", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors) {
          for (const [key, value] of Object.entries(res.errors)) {
            setError(`${key}`, value, value);
          }
        }
        setUserInfo(() => ({
          email: res.email,
          username: res.username,
        }));
        setDataFormInfo(() => ({
          email: res.email,
          username: res.username,
        }));
      });
  };

  const changeUserData = () => {
    if (validateDataFields()) {
      return;
    }
    const body = {};
    if (dataFormInfo.email !== userInfo.email) {
      body.email = dataFormInfo.email;
    }
    if (dataFormInfo.username !== userInfo.username) {
      body.username = dataFormInfo.username;
    }
    fetch("http://localhost:8080/api/user/data", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "PATCH",
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (!res.authorizationToken) {
          for (const [key, value] of Object.entries(res.errors)) {
            setError(`${key}`, value, value);
          }
          return;
        }
        localStorage.setItem("token", res.authorizationToken);
        toast(`Data changed succesfully`);
        handleDataClose();
      });
  };

  const changeUserPassword = () => {
    if (validatePasswordFields()) {
      return;
    }

    fetch("http://localhost:8080/api/user/password", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "PATCH",
      body: JSON.stringify({ newPassword: dataFormInfo.password }),
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
          toast(`Password changed succesfully`);
          handlePasswordClose();
        }
      });
  };

  const handleDataOpen = () => {
    setOpenDataModal(true);
    setDataFormInfo(userInfo);
  };

  const handlePasswordOpen = () => setOpenPasswordModal(true);
  const handleDataClose = () => {
    setOpenDataModal(false);
    setErrors((state) => ({
      ...state,
      email: "",
      username: "",
    }));
  };
  const handlePasswordClose = () => setOpenPasswordModal(false);

  let error = false;

  const validateDataFields = () => {
    error = false;
    setErrors((state) => ({
      ...state,
      email: "",
      username: "",
    }));

    setError("email", "Email cannot be empty", !dataFormInfo?.email);
    setError("username", "Username cannot be empty", !dataFormInfo?.username);

    return error;
  };

  const validatePasswordFields = () => {
    error = false;
    setErrors((state) => ({
      ...state,
      passwordMismatch: "",
      password: "",
    }));
    setError("password", "Password cannot be empty", !dataFormInfo?.password);

    setError(
      "passwordMismatch",
      "Passwords don't match",
      dataFormInfo.confirmPassword !== dataFormInfo.password
    );

    return error;
  };

  const setError = (type, errorString, condition) => {
    if (condition) {
      error = true;
      if (type === "token") {
        toast(errorString + ". Please Sign in again.", {
          progressClassName: "red-progress",
        });
        localStorage.removeItem("token");
        handleLoginRedirect();
        return;
      }
      setErrors((state) => ({ ...state, [type]: errorString }));
    }
  };

  return (
    <div className="account-profile-page-main">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            mt: 1,
            backgroundColor: "white",
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 3,
            paddingTop: 2,
            border: 1,
            boxShadow: "5px 5px 5px black",
          }}
        >
          <Box
            sx={{
              paddingLeft: 5,
              alignItems: "center",
            }}
          >
            <img src="/images/profile_icon.png" alt="img" />
            <p id="emailP">User email: {userInfo.email}</p>
            <p id="usernameP">Username: {userInfo.username}</p>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Button
              id="modifyInfoButton"
              variant="contained"
              onClick={handleDataOpen}
              sx={{
                marginRight: "10px",
                width: "182.64px",
              }}
              style={{ backgroundColor: "black", color: "white" }}
            >
              Change Data
            </Button>
            <Button
              id="modifyPasswordButton"
              variant="contained"
              onClick={handlePasswordOpen}
              style={{
                backgroundColor: "black",
                color: "white",
                width: "182.64px",
              }}
            >
              New Password
            </Button>
          </Box>
          <Modal
            open={openDataModal}
            onClose={handleDataClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <TextField
                id="email"
                margin="normal"
                onChange={(e) =>
                  setDataFormInfo((state) => ({
                    ...state,
                    email: e.target.value,
                  }))
                }
                error={Boolean(errors?.email)}
                helperText={errors?.email}
                required
                fullWidth
                variant="standard"
                label="Email"
                value={dataFormInfo.email}
                autoComplete="email"
                autoFocus
              />
              <TextField
                id="username"
                margin="normal"
                onChange={(e) =>
                  setDataFormInfo((state) => ({
                    ...state,
                    username: e.target.value,
                  }))
                }
                error={Boolean(errors?.username)}
                helperText={errors?.username}
                value={dataFormInfo.username}
                variant="standard"
                required
                fullWidth
                label="Username"
                type="username"
                autoComplete="username"
              />
              <Box
                sx={{
                  display: "flex",
                  marginTop: "15px",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  id="modifyDataButton"
                  variant="contained"
                  onClick={() => {
                    changeUserData();
                  }}
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    marginRight: "10px",
                    width: "182.64px",
                  }}
                >
                  Modify
                </Button>
                <Button
                  id="dismissDataButton"
                  variant="contained"
                  onClick={handleDataClose}
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    width: "182.64px",
                  }}
                >
                  Dismiss
                </Button>
              </Box>
            </Box>
          </Modal>
          <Modal
            open={openPasswordModal}
            onClose={handlePasswordClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <TextField
                id="password"
                margin="normal"
                onChange={(e) =>
                  setDataFormInfo((state) => ({
                    ...state,
                    password: e.target.value,
                  }))
                }
                variant="standard"
                error={Boolean(errors?.password)}
                helperText={errors?.password}
                type="password"
                required
                fullWidth
                label="New Password"
                autoFocus
              />
              <TextField
                id="confirmPassword"
                margin="normal"
                variant="standard"
                onChange={(e) =>
                  setDataFormInfo((state) => ({
                    ...state,
                    confirmPassword: e.target.value,
                  }))
                }
                required
                fullWidth
                error={Boolean(errors?.passwordMismatch)}
                helperText={errors?.passwordMismatch}
                name="confirmPassword"
                label="Confirm password"
                type="password"
              />
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Button
                  id="modifyPasswordButton"
                  variant="contained"
                  onClick={() => {
                    changeUserPassword();
                  }}
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    marginRight: "10px",
                    width: "182.64px",
                  }}
                >
                  Modify Password
                </Button>
                <Button
                  id="dismissPasswordButton"
                  variant="contained"
                  onClick={handlePasswordClose}
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    width: "182.64px",
                  }}
                >
                  Dismiss
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box>
      </Box>
    </div>
  );
}
