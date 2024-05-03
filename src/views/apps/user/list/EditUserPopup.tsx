import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { UserType } from "src/types/apps/UserType";
import { HOST } from "src/store/constants/hostname";

interface EditUserPopupProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  fetchUserById: (userId: number) => Promise<UserType>;
}

const EditUserPopup: React.FC<EditUserPopupProps> = ({
  isOpen,
  onClose,
  user,
  fetchUserById,
}) => {
  const [userData, setUserData] = useState<UserType | null>(null);
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (isOpen && user && user.id) {
          // Fetch the old user data using fetchUserById
          const fetchedUserData = await fetchUserById(user.id);
          setUserData(fetchedUserData);
          setEmail(fetchedUserData.email);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (isOpen) {
      // Fetch user data only when the dialog is open
      fetchUserData();
    }
  }, [isOpen, user, fetchUserById]);

  const handleSave = () => {
    // Implement the logic to save the changes (update email and password)
    // Validate new password and confirm password
    if (newPassword === confirmPassword) {
      // You can dispatch an action to update the user details in the Redux store
      onClose();
    } else {
      // Handle password mismatch error
      console.error("Password mismatch");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        {userData && (
          <>
            <Avatar
              alt={`Profile Image of ${userData.userData?.firstName} ${userData.userData?.lastName}`}
              src={`${HOST}/uploads/${userData.profileImage}`}
              sx={{ width: 50, height: 50, marginBottom: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="New Password"
              variant="outlined"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              variant="outlined"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
            />
          </>
        )}
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserPopup;
