import { Url } from "../../../config";
import {
  getUserDataFailure,
  getUserDataSuccess,
  UserDataUpdateFailure,
  UserDataUpdateSuccess
} from "../Slice/UserDataSlice";


export const fetchUsersData = () => async (dispatch) => {
  try {
    const response = await fetch(`${Url}/user/usersdata`, {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch users data: ${errorText}`);
    }

    const data = await response.json();
    dispatch(getUserDataSuccess(data));
  } catch (error) {
    console.error("Error fetching users:", error);
    dispatch(getUserDataFailure(error.message));
  }
};


export const updateUserData = (updatedData, userId) => async (dispatch) => {
  try {
    const formData = new FormData();

    
    if (updatedData.username) {
      formData.append("username", updatedData.username);
    }

   
    if (updatedData.file) {
      formData.append("file", updatedData.file);
    } else {
      console.log("No file selected");
    }

    

    const response = await fetch(`${Url}/user/updateprofile/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update user: ${errorText}`);
    }

    const updatedUser = await response.json();
    dispatch(UserDataUpdateSuccess(updatedUser));
  } catch (error) {
    console.error("Error updating user:", error);
    dispatch(UserDataUpdateFailure(error.message));
  }
};
