// ** React Imports
import { useState, useEffect, ChangeEvent, useRef } from "react";

// ** MUI Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

// ** Third Party Imports
import axios from "axios";

// ** Icon Imports
import Icon from "src/@core/components/icon";
import EditIcon from "@mui/icons-material/Edit";

// ** Types
import { UserDataType } from "src/context/types";
import { useAuth } from "src/hooks/useAuth";
import { uploadProfileImage } from "src/store/apps/users";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import { UserType } from "src/types/apps/UserType";

const ProfilePicture = styled("img")(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: theme.shape.borderRadius,
  border: `5px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down("md")]: {
    marginBottom: theme.spacing(4),
  },
}));

const UserProfileHeader = () => {
  // ** State
  const { user, logout } = useAuth();
  const userStore = useSelector((state: RootState) => state.users);

  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const userId = user?.id;
  const [userIdData, setUserIdData] = useState<UserType | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    logout();
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleLeave = () => {
    setIsHovered(false);
  };
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      try {
        const response = await dispatch(
          uploadProfileImage({ id: userId!, file })
        ).unwrap();

        console.log("Profile image uploaded successfully:", response);

        if (user) {
          const imageUrl = response.profileImage;
          setUserIdData({ ...userIdData, profileImage: imageUrl });
        }
      } catch (error) {
        console.error("Error uploading profile image:", error);
      }
      e.target.value = "";
    }
  };
  useEffect(() => {
    if (userStore.data && userStore.data.length > 0) {
      setUserIdData(userStore.data[0]);
    }
  }, [userStore.data]);

  return user !== null ? (
    <Card>
      <CardMedia
        component="img"
        alt="profile-header"
        image="/images/cover-page.png"
        sx={{
          height: { xs: 150, md: 250 },
        }}
      />
      <CardContent
        sx={{
          pt: 0,
          mt: -8,
          display: "flex",
          alignItems: "flex-end",
          flexWrap: { xs: "wrap", md: "nowrap" },
          justifyContent: { xs: "center", md: "flex-start" },
        }}
      >
        <div
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
          style={{ position: "relative" }}
        >
          <>
            <ProfilePicture
              src={`http://localhost:8000/uploads/${user?.profileImage}`}
              alt="profile-picture"
            />
            {isHovered && (
              <IconButton
                onClick={handleEditClick}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "rgba(244, 245, 250, 0.8)",
                  padding: "4px",
                }}
              >
                <EditIcon sx={{ fontSize: 18 }} />
              </IconButton>
            )}
          </>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            ml: { xs: 0, md: 6 },
            alignItems: "flex-end",
            flexWrap: ["wrap", "nowrap"],
            justifyContent: ["center", "space-between"],
          }}
        >
          <Box
            sx={{
              mb: [6, 0],
              display: "flex",
              flexDirection: "column",
              alignItems: ["center", "flex-start"],
            }}
          >
            <Typography variant="h5" sx={{ mb: 4 }}>
              {user?.userData?.firstName} {user?.userData?.lastName}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: ["center", "flex-start"],
              }}
            ></Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <Button
              variant="contained"
              startIcon={<Icon icon="mdi:pencil" fontSize={20} />}
            >
              Modfifier les information
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<Icon icon="mdi:logout" fontSize={20} />}
              onClick={handleLogout}
            >
              Se Déconnecter
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  ) : null;
};

export default UserProfileHeader;
