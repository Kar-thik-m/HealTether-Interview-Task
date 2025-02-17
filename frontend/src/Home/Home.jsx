import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersData } from "../Redux/Action/Usersdatas";
import { useAuth } from "../ContextApi/AuthContext";
import HomeStyle from "../Home/Home.module.css";
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const UserData = useSelector((state) => state.UserDatas?.UserData) || [];
  const { user, logout } = useAuth();

  useEffect(() => {
    dispatch(fetchUsersData());
  }, [dispatch]);

  return (
    <div className={HomeStyle.container}>
      <div className={HomeStyle.headers}>
        <button onClick={logout}>Logout</button>
        <h2>User List</h2>
      </div>

      {UserData.length > 0 ? (
        <div className={HomeStyle.userList}>
          {UserData.map((userData) => (
            <div key={userData.id} className={HomeStyle.userCard}>
              <h3>{userData.username}</h3>
              <p>{userData.email}</p>
              {userData.userimage?.url ? (
                <img
                  src={userData.userimage.url}
                  alt="Profile"
                  width="50"
                  height="50"
                />
              ) : (
                <p>No Image</p>
              )}
              {user?.email === userData.email && (
                <button>
                  <Link to={`/update/${userData._id}`}>Update</Link>
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>No users available</p>
      )}
    </div>
  );
};

export default Home;
