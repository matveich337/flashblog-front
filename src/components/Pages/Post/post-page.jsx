import "./post-page.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Commentary from "./commentary";

export default function PostPage() {
  const params = useParams();
  let navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLoginRedirect = () => routeChange("/login");
  const handlePostsRedirect = () => routeChange("/posts");

  const routeChange = (path) => {
    navigate(path);
  };

  const [postData, setPostData] = useState({
    id: "",
    commentaries: [],
    creator: {
      email: "",
      username: "",
      createdOn: "",
    },
    theme: "",
    content: "",
    createdOn: "",
  });

  const [commentaryData, setCommentaryData] = useState("");

  const [errors, setErrors] = useState({
    token: "",
    commentary: "",
  });

  useEffect(() => {
    getPostInfo();
  }, []);

  const getPostInfo = () => {
    fetch(`http://localhost:8080/api/posts/${params.postId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.id) {
          setPostData(res);
          return;
        }
        console.log(res);
        setError("postId", "Post not found", "Post not found");
      });
  };

  const postCommentary = () => {
    if (!validateFields()) {
      fetch("http://localhost:8080/api/posts/commentary", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
          commentary: commentaryData,
          postId: postData.id,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.errors) {
            for (const [key, value] of Object.entries(res.errors)) {
              setError(`${key}`, value, value);
            }
            return;
          }
          getPostInfo();
          setCommentaryData("");
        });
    }
  };

  const validateFields = () => {
    error = false;
    setErrors((state) => ({
      ...state,
      commentary: "",
    }));

    setError("commentary", "Commentary cannot be empty", !commentaryData);

    return error;
  };
  let error = false;

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
      } else if (type === "postId") {
        toast(errorString, {
          progressClassName: "red-progress",
        });
        handlePostsRedirect();
        return;
      }
      if (type === "email") {
        toast(errorString, {
          progressClassName: "red-progress",
        });
        localStorage.removeItem("token");
        handleLoginRedirect();
        return;
      }
      setErrors((state) => ({ ...state, [type]: errorString }));
    }
  };

  const handleChange = (e) => {
    setCommentaryData(e.target.value);
  };
  return (
    <div className="post-page-main">
      <Card
        className="post-card"
        variant="outlined"
        sx={{ marginLeft: "20px", backgroundColor: "white" }}
      >
        <CardContent sx={{ height: "100%" }}>
          <Typography sx={{ fontSize: 18 }} component="div">
            Theme:
          </Typography>
          <Typography sx={{ fontSize: 18 }} component="div">
            {postData.theme}
          </Typography>
          <div style={{ height: "80px" }}>
            <Typography sx={{ fontSize: 18 }} component="div">
              Content:
            </Typography>
            <Typography
              component="div"
              sx={{
                height: "75%",
                wordWrap: "break-word",
                overflow: "hidden",
                fontSize: 18,
              }}
            >
              {postData.content}
            </Typography>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Post by {postData.creator.username}
            </Typography>
          </div>
        </CardContent>
      </Card>
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          {postData.commentaries.map((value) => (
            <Commentary data={value} key={value.id}></Commentary>
          ))}
        </div>
        <div
          style={{ display: "flex", alignItems: "center", margin: "40px 20px" }}
        >
          <TextField
            variant="standard"
            sx={{ backgroundColor: "white" }}
            onChange={handleChange}
            value={commentaryData}
            error={Boolean(errors?.commentary)}
            helperText={errors?.commentary}
            required
            fullWidth
            name="commentary"
            label="Enter your commentary"
            id="commentary"
          />
          <Button
            id="commentarySubmitButton"
            onClick={postCommentary}
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              ml: 3,
              width: "300px",
              height: "56px",
              backgroundColor: "black",
              color: "white",
            }}
          >
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
