import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserData } from "../Redux/Action/Usersdatas";
import { useParams, useNavigate } from "react-router-dom";
import updatestyles from "../Update/Update.module.css";
import CircularProgress from "@mui/material/CircularProgress";

const Update = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userData = { username, file };

    try {
      await dispatch(updateUserData(userData, id));

      setUsername("");
      setFile(null);
      navigate("/"); // Redirect after successful update
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={updatestyles.formContainer}>
      <div className={updatestyles.labeltext}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className={updatestyles.labelfile}>
        <label htmlFor="file">Profile Image:</label>
        <input
          type="file"
          id="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <button
        type="submit"
        className={updatestyles.buttonupdate}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Update Profile"}
      </button>
    </form>
  );
};

export default Update;
