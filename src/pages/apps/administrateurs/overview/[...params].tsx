// ** React Imports
import { ChangeEvent, useRef, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { fetchAdministrator } from "src/store/apps/administrator";
import { fetchUserById, uploadProfileImage } from "src/store/apps/users";
import { AdministratorType } from "src/types/apps/administratorTypes";
import EmailAppLayout from "src/views/apps/administrators/overview/mail/Mail";
import EditIcon from "@mui/icons-material/Edit";

// ** Custom Components
import CustomChip from "src/@core/components/mui/chip";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Types
import { ThemeColor } from "src/@core/layouts/types";

// ** Utils Import
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { updateAdministrator } from "src/store/apps/administrator";
import { Controller, useForm } from "react-hook-form";
import { IconButton } from "@mui/material";
import { UserType } from "src/types/apps/UserType";
import { setAdministratorUserId } from "src/store/apps/administrator";
import { MailFolderType } from "src/types/apps/mailTypes";
import { set } from "nprogress";
import { HOST } from "src/store/constants/hostname";

interface ColorsType {
  [key: string]: ThemeColor;
}

export interface UpdateAdministratorDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

const schema = yup.object().shape({
  firstName: yup.string().min(3).required(),
  lastName: yup.string().min(3).required(),
  phoneNumber: yup.string().required(),
});

const UserViewLeft = () => {
  const router = useRouter();
  const { params } = router.query;
  const folder = params ? params[0] : null;
  const userId = params ? params[1] : null;
  const id = params ? params[2] : null;
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateAdministratorDto>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const administratorStore = useSelector(
    (state: RootState) => state.administrator
  );
  const user = useSelector((state: RootState) =>
    state.users.data.find((user) => user.id === parseInt(userId as string, 10))
  );
  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [userData, setUserData] = useState<AdministratorType | null>(null);
  const [userIdData, setUserIdData] = useState<UserType | null>(null);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<string>("auto");
  const [isHovered, setIsHovered] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true);
  const handleEditClose = () => setOpenEdit(false);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };
  const handleEditSubmit = (data: UpdateAdministratorDto) => {
    // Ensure id is a number
    const administratorId = parseInt(id as unknown as string, 10);
    const partialUpdateAdministratorDto: Partial<UpdateAdministratorDto> = {};
    if (data.firstName)
      partialUpdateAdministratorDto.firstName = data.firstName;
    if (data.lastName) partialUpdateAdministratorDto.lastName = data.lastName;
    if (data.phoneNumber)
      partialUpdateAdministratorDto.phoneNumber = data.phoneNumber;

    dispatch(
      updateAdministrator({ id: administratorId, updateAdministratorDto: data })
    )
      .then(() => {
        reset();
      })
      .catch((error) => {
        console.error("Update Administrator failed:", error);
      });
    handleEditClose();
    reset();
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
        if (userId) {
          const response = await dispatch(
            uploadProfileImage({ id: userId! as unknown as number, file })
          ).unwrap();

          if (userIdData) {
            const imageUrl = response.profileImage;
            setUserIdData({ ...userIdData, profileImage: imageUrl });
          }
        }
      } catch (error) {
        console.error("Error uploading profile image:", error);
      }
      e.target.value = "";
    }
  };

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      dispatch(fetchAdministrator(Number(id)) as any);
    }
    return () => {
      setUserData(null);
    };
  }, [id]);

  useEffect(() => {
    if (administratorStore.data && administratorStore.data.length > 0) {
      setUserData(administratorStore.data[0]);
      if (administratorStore.data[0]?.userId == null) {
        setSuspendDialogOpen("auto");
      }
    }
  }, [administratorStore.data]);

  useEffect(() => {
    if (userId && !isNaN(Number(userId))) {
      dispatch(fetchUserById(Number(userId)) as any);
    } else {
      setUserData(null);
    }
    return () => {
      setUserData(null);
    };
  }, [userId]);

  useEffect(() => {
    return setUserIdData(user || null);
  }, [user]);

  if (userData) {
    return (
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          md={5}
          sx={{ marginLeft: suspendDialogOpen, marginRight: suspendDialogOpen }}
        >
          <Card>
            <CardContent
              sx={{
                pt: 15,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}
                style={{ position: "relative" }}
              >
                {userData.userId ? (
                  <>
                    <Avatar
                      alt={`Profile Image of ${userData.firstName} ${userData.lastName}`}
                      src={`${HOST}/uploads/${userIdData?.profileImage}`}
                      sx={{ width: 80, height: 80 }}
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
                ) : (
                  <>
                    <Avatar
                      alt="John Doe"
                      sx={{ width: 80, height: 80 }}
                      src="/images/avatars/1.png"
                    />
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>

              <Typography variant="h6" sx={{ mb: 4 }}>
                {userData.firstName} {userData.lastName}
              </Typography>
              <CustomChip skin="light" size="small" label="Administrateur" />
            </CardContent>
            <CardContent>
              <Typography variant="h6">Details</Typography>
              <Divider
                sx={{ my: (theme) => `${theme.spacing(4)} !important` }}
              />
              <Box sx={{ pb: 1 }}>
                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, fontSize: "0.875rem" }}
                  >
                    Prénom:
                  </Typography>
                  <Typography variant="body2">{userData.firstName}</Typography>
                </Box>{" "}
                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, fontSize: "0.875rem" }}
                  >
                    Nom:
                  </Typography>
                  <Typography variant="body2">{userData.lastName}</Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, fontSize: "0.875rem" }}
                  >
                    Contact:
                  </Typography>
                  <Typography variant="body2">
                    {userData.phoneNumber}
                  </Typography>
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ display: "flex", justifyContent: "center" }}>
              <Button variant="contained" onClick={handleEditClickOpen}>
                Modifier
              </Button>
              {/* <Button color='error' variant='outlined' onClick={() => setSuspendDialogOpen(true)}>
                Suspend
              </Button> */}
            </CardActions>

            <Dialog
              open={openEdit}
              onClose={handleEditClose}
              aria-labelledby="user-view-edit"
              sx={{
                "& .MuiPaper-root": {
                  width: "100%",
                  maxWidth: 650,
                  p: [2, 10],
                },
              }}
              aria-describedby="user-view-edit-description"
            >
              <DialogTitle
                id="user-view-edit"
                sx={{ textAlign: "center", fontSize: "1.5rem !important" }}
              >
                Modifier les informations du l’utilisateur
              </DialogTitle>
              <DialogContent>
                <DialogContentText
                  variant="body2"
                  id="user-view-edit-description"
                  sx={{ textAlign: "center", mb: 7 }}
                ></DialogContentText>
                <form onSubmit={handleSubmit(handleEditClose)}>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      {/* <TextField fullWidth label='First Name' defaultValue={userData.firstName} /> */}
                      <FormControl fullWidth sx={{ mb: 6 }}>
                        <Controller
                          name="firstName"
                          control={control}
                          defaultValue={userData.firstName}
                          rules={{ required: "Prénom est requis" }}
                          render={({ field, fieldState }) => (
                            <FormControl fullWidth sx={{ mb: 6 }}>
                              <TextField
                                {...field}
                                label="Prénom"
                                error={Boolean(fieldState.error)}
                                helperText={fieldState.error?.message}
                              />
                            </FormControl>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ mb: 6 }}>
                        <Controller
                          name="lastName"
                          control={control}
                          defaultValue={userData.lastName}
                          rules={{ required: "Nom est requis" }}
                          render={({ field, fieldState }) => (
                            <FormControl fullWidth sx={{ mb: 6 }}>
                              <TextField
                                {...field}
                                label="Nom"
                                error={Boolean(fieldState.error)}
                                helperText={fieldState.error?.message}
                              />
                            </FormControl>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth sx={{ mb: 6 }}>
                        <Controller
                          name="phoneNumber"
                          control={control}
                          defaultValue={userData.phoneNumber}
                          rules={{ required: "Contact est requis" }}
                          render={({ field, fieldState }) => (
                            <FormControl fullWidth sx={{ mb: 6 }}>
                              <TextField
                                {...field}
                                label="Contact"
                                error={Boolean(fieldState.error)}
                                helperText={fieldState.error?.message}
                              />
                            </FormControl>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    {/* <Grid item xs={12}>
                      <FormControlLabel
                        label="Use as a billing address?"
                        control={<Switch defaultChecked />}
                        sx={{ "& .MuiTypography-root": { fontWeight: 500 } }}
                      />
                    </Grid> */}
                  </Grid>
                </form>
              </DialogContent>
              <DialogActions sx={{ justifyContent: "center" }}>
                <Button
                  variant="contained"
                  sx={{ mr: 1 }}
                  onClick={handleSubmit(handleEditSubmit)}
                >
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleEditClose}
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </Card>
        </Grid>
        {userData.userId !== null && (
          <Grid item xs={12} md={7} sx={{ display: "flex" }}>
            <EmailAppLayout folder={folder as MailFolderType} />
          </Grid>
        )}
      </Grid>
    );
  } else {
    return null;
  }
};

export default UserViewLeft;
