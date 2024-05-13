import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { UserType } from "src/types/apps/UserType";
import { HOST } from "src/store/constants/hostname";

interface ForwardMailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: number | null;
  //   fetchUserById: (userId: number) => Promise<UserType>;
}

const ForwardMailPopup: React.FC<ForwardMailPopupProps> = ({
  isOpen,
  onClose,
  messageId,
  //   fetchUserById,
}) => {
  //   useEffect(() => {
  //     const fetchUserData = async () => {
  //       try {
  //         if (isOpen && user && user.id) {
  //           // Fetch the old user data using fetchUserById
  //           const fetchedUserData = await fetchUserById(user.id);
  //           setUserData(fetchedUserData);
  //           setEmail(fetchedUserData.email);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching user data:", error);
  //       }
  //     };

  //     if (isOpen) {
  //       // Fetch user data only when the dialog is open
  //       fetchUserData();
  //     }
  //   }, [isOpen, user, fetchUserById]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Transferer le message (pas encore fini)</DialogTitle>
      <DialogContent>
        <Button variant="contained" color="primary" onClick={() => {}}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ForwardMailPopup;
