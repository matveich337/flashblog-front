import "./create-post-page.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";

export default function CreatePostPage() {
  let navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLoginRedirect = () => routeChange("/login");
  const handlePostsRedirect = () => routeChange("/posts");

  const routeChange = (path) => {
    navigate(path);
  };

  const [errors, setErrors] = useState({
    theme: "",
    content: "",
  });

  const [data, setData] = useState({
    theme: "",
    content: "",
  });

  useEffect(() => {
    if (!token) {
      toast("Please Sign in first", {
        progressClassName: "red-progress",
      });
      handleLoginRedirect();
    }
  }, [token]);

  let error = false;

  const validateFields = () => {
    error = false;
    setErrors((state) => ({
      ...state,
      theme: "",
      content: "",
    }));

    setError("theme", "Theme cannot be empty", !data?.theme);
    setError("content", "Content cannot be empty", !data?.content);

    return error;
  };

  const setError = (type, errorString, condition) => {
    if (condition) {
      error = true;
      setErrors((state) => ({ ...state, [type]: errorString }));
    }
  };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateFields()) {
      createNewPost();
    }
  };

  const createNewPost = () => {
    console.log(data.content.length);
    fetch("http://localhost:8080/api/posts", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: JSON.stringify({ theme: data.theme, content: data.content }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors) {
          for (const [key, value] of Object.entries(res.errors)) {
            setError(`${key}`, value, value);
          }
          return;
        }
        toast("Post created");
        handlePostsRedirect();
      });
  };

  return (
    <div className="create-post-main">
      <Box
        noValidate
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
            paddingLeft: 15,
            paddingRight: 15,
            paddingBottom: 5,
            paddingTop: 5,
            marginTop: 5,
            border: 1,
          }}
        >
          <Typography component="h1" variant="h5">
            Post details
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              variant="standard"
              id="postTheme"
              margin="normal"
              onChange={handleChange}
              value={data.theme}
              error={Boolean(errors?.theme)}
              helperText={errors?.theme}
              required
              fullWidth
              label="Post Theme"
              name="theme"
              autoFocus
            />
            <TextField
              id="postContent"
              margin="normal"
              onChange={handleChange}
              value={data.content}
              error={Boolean(errors?.content)}
              helperText={errors?.content}
              required
              multiline
              rows={17}
              fullWidth
              name="content"
              label="Post content"
            />
            <Button
              id="createPostButton"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "black", color: "white" }}
            >
              Post
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
