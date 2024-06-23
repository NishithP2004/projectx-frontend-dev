import React from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { enqueueSnackbar } from "notistack";

function Profile(props) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    props.auth
      .signOut()
      .then(() => {
        // Redirect to the login page after signing out
        enqueueSnackbar("Signed out successfully", {
          variant: "info",
        });
        navigate("/login");
      })
      .catch((error) => {
        console.error("Sign-out error:", error);
      });
  };

  return (
    <Layout user={props.user}>
      <div className="glass profileCard">
        <img src={props.user.img} id="profilePic" alt="Profile" />
        <p id="name">{props.user.name}</p>
        <p id="email">{props.user.email}</p>
        <button className="glass" id="signOut" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </Layout>
  );
}

export default Profile;
