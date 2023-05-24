import React from "react";
import { Routes, Route } from "react-router-dom";
import AccountActivation from "./components/Pages/AccountActivation/account-activation-page";
import CreatePost from "./components/Pages/CreatePost/create-post-page";
import PasswordReset from "./components/Pages/PasswordReset/password-reset-page";
import PasswordForgotChange from "./components/Pages/PasswordForgotChange/password-forgot-change-page";
import AccountProfile from "./components/Pages/AccountProfili/account-profile-page";
import Posts from "./components/Pages/Posts/posts-page";
import Post from "./components/Pages/Post/post-page";
import NoMatch from "./components/NoMatch/no-match";
import Layout from "./components/Layout/layout";

import "./index.css";
import Login from "./components/Pages/LogIn/login";
import Register from "./components/Pages/Register/register";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="account/email/activation/:activationToken"
            element={<AccountActivation />}
          />
          <Route
            path="account/password/forget/:passwordResetToken"
            element={<PasswordForgotChange />}
          />
          <Route path="password/reset" element={<PasswordReset />} />
          <Route path="posts" element={<Posts />} />
          <Route path="/post/:postId" element={<Post />} />
          <Route path="/post/create" element={<CreatePost />} />
          <Route path="profile" element={<AccountProfile />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}
