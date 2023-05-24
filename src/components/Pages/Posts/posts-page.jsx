import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as React from "react";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import PostCard from "./post-card";
import "./post-page.css";

export default function PostsPage() {
  let navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLoginRedirect = () => routeChange("/login");

  const routeChange = (path) => {
    navigate(path);
  };

  const [errors, setErrors] = useState({
    token: "",
  });
  const [postData, setPostData] = useState([]);

  useEffect(() => {
    getAllPosts();
  }, []);

  const getAllPosts = () => {
    fetch("http://localhost:8080/api/posts", {
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
          return;
        }
        setPostData(res.userPosts);
      });
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

  return (
    <div className="posts-page-main">
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          paddingTop: "20px",
        }}
      >
        {postData.map((value) => (
          <PostCard data={value} key={value.id} />
        ))}
      </Box>
    </div>
  );
}
