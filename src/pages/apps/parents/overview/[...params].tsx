// ** React Imports
import { ChangeEvent, useRef, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import InputAdornment from "@mui/material/InputAdornment";
import LinearProgress from "@mui/material/LinearProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import DialogContentText from "@mui/material/DialogContentText";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { fetchParent, updateParent } from "src/store/apps/parents";
import { ParentsType } from "src/types/apps/parentTypes";
import EmailAppLayout from "src/views/apps/parents/overview/mail/Mail";
import EditIcon from "@mui/icons-material/Edit";

// ** Custom Components Imports
import CustomAvatar from "src/@core/components/mui/avatar";

// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";

// ** Icon Imports
import Icon from "src/@core/components/icon";
import Image from "next/image";

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
import { Controller, useForm } from "react-hook-form";
import { formatDate } from "src/@core/utils/format";
import { fetchUserById, uploadProfileImage } from "src/store/apps/users";
import { UserType } from "src/types/apps/UserType";
import { MailFolderType } from "src/types/apps/mailTypes";
import { IconButton } from "@mui/material";
import { StudentsType } from "src/types/apps/studentTypes";
import { HOST } from "src/store/constants/hostname";

interface ColorsType {
  [key: string]: ThemeColor;
}

export interface UpdateParentDto {
  fatherFirstName?: string;
  fatherLastName?: string;
  fatherPhoneNumber?: string;
  motherFirstName?: string;
  motherLastName?: string;
  motherPhoneNumber?: string;
  address?: string;
  student?: StudentsType[];
}

const schema = yup.object().shape({
  fatherFirstName: yup.string().required("Prénom du père est requis"),
  fatherLastName: yup.string().required("Nom du père est requis"),
  fatherPhoneNumber: yup.string().required("Contact du père est requis"),
  motherFirstName: yup.string().required("Prénom de la mère est requis"),
  motherLastName: yup.string().required("Nom de la mère est requis"),
  motherPhoneNumber: yup.string().required("Contact de la mère est requis"),
  address: yup.string().required("Adresse est requis"),

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
  } = useForm<UpdateParentDto>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const parentStore = useSelector((state: RootState) => state.parents);
  const user = useSelector((state: RootState) =>
    state.users.data.find((user) => user.id === parseInt(userId as string, 10))
  );
  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [userData, setUserData] = useState<ParentsType | null>(null);
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

  const handleEditSubmit = (data: UpdateParentDto) => {
    // Ensure id is a number
    const parentId = parseInt(id as unknown as string, 10);
    const partialUpdateParentDto: Partial<UpdateParentDto> = {};
    if (data.fatherFirstName) partialUpdateParentDto.fatherFirstName = data.fatherFirstName;
    if (data.fatherLastName) partialUpdateParentDto.fatherLastName = data.fatherLastName;
    if (data.fatherPhoneNumber) partialUpdateParentDto.fatherPhoneNumber = data.fatherPhoneNumber;
    if (data.motherFirstName) partialUpdateParentDto.motherFirstName = data.motherFirstName;
    if (data.motherLastName) partialUpdateParentDto.motherLastName = data.motherLastName;
    if (data.motherPhoneNumber) partialUpdateParentDto.motherPhoneNumber = data.motherPhoneNumber;
    if (data.address) partialUpdateParentDto.address = data.address;
    dispatch(updateParent({ id: parentId, updateParentDto: data }))
      .then(() => {
        reset();
      })
      .catch((error) => {
        console.error("Update Parent failed:", error);
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
        const response = await dispatch(
          uploadProfileImage({ id: userId! as unknown as number, file })
        ).unwrap();

        if (userIdData) {
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
    if (id && !isNaN(Number(id))) {
      dispatch(fetchParent(Number(id)) as any);
    }
    return () => {
      setUserData(null);
    };
  }, [id]);

  useEffect(() => {
    // Update state when the data is updated
    if (parentStore.data && parentStore.data.length > 0) {
      setUserData(parentStore.data[0]);
    }
    if (parentStore.data[0]?.userId == null) {
      setSuspendDialogOpen("auto");
    }
  }, [parentStore.data]);

  useEffect(() => {
    if (userId && !isNaN(Number(userId))) {
      dispatch(fetchUserById(Number(userId)) as any);
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
                <CustomAvatar
                  skin="light"
                  color={"primary"}
                  sx={{
                    width: 80,
                    height: 80,
                    fontSize: "1.9rem",
                    marginRight: "10px",
                  }}
                >
                  {getInitials(`${userData.fatherFirstName} ${userData.motherFirstName}`)}
                </CustomAvatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
              <Typography variant="h6" sx={{ mb: 4 }}>
                {userData.fatherFirstName} {userData.fatherLastName} {userData.motherFirstName} {userData.motherLastName}
              </Typography>
              <CustomChip skin="light" size="small" label="Parent" />
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
                    Prénom du père:
                  </Typography>
                  <Typography variant="body2">{userData.fatherFirstName}</Typography>
                </Box>{" "}
                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, fontSize: "0.875rem" }}
                  >
                    Nom du père:
                  </Typography>
                  <Typography variant="body2">{userData.fatherLastName}</Typography>
                </Box>

                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, fontSize: "0.875rem" }}
                  >
                    Telephone du père:
                  </Typography>
                  <Typography variant="body2">
                    {userData.fatherPhoneNumber}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, fontSize: "0.875rem" }}
                  >
                    Prénom de la mère:
                  </Typography>
                  <Typography variant="body2">{userData.motherFirstName}</Typography>
                </Box>

                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, fontSize: "0.875rem" }}
                  >
                    Nom de la mère:
                  </Typography>
                  <Typography variant="body2">{userData.motherLastName}</Typography>

                </Box>
                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, fontSize: "0.875rem" }}
                  >
                    Telephone de la mère:
                  </Typography>
                  <Typography variant="body2">
                    {userData.motherPhoneNumber}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, fontSize: "0.875rem" }}
                  >
                    Adresse:
                  </Typography>
                  <Typography variant="body2">{userData.address}</Typography>
                </Box>


                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, fontSize: "0.875rem" }}
                  >
                    Enfants:
                  </Typography>
                  <Typography variant="body2">
                    {userData.students?.map((student) => (
                      <div key={student?.id}>
                        - {student?.firstName} {student?.lastName}
                      </div>
                    ))}
                  </Typography>
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ display: "flex", justifyContent: "center" }}>
              <Button variant="contained" onClick={handleEditClickOpen}>
                Modifier
              </Button>
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
                Modifier les inforamtions du l’utilisateur
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
                          name="fatherFirstName"
                          control={control}
                          defaultValue={userData.fatherFirstName}
                          rules={{ required: "Prénom est requis" }}
                          render={({ field, fieldState }) => (
                            <FormControl fullWidth sx={{ mb: 6 }}>
                              <TextField
                                {...field}
                                label="Prénom du père"
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
                          name="fatherLastName"
                          control={control}
                          defaultValue={userData.fatherLastName}
                          rules={{ required: "Nom est requis" }}
                          render={({ field, fieldState }) => (
                            <FormControl fullWidth sx={{ mb: 6 }}>
                              <TextField
                                {...field}
                                label="Nom du père" 
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
                          name="fatherPhoneNumber"
                          control={control}
                          defaultValue={userData.fatherPhoneNumber}
                          rules={{ required: "Contact est requis" }}
                          render={({ field, fieldState }) => (
                            <FormControl fullWidth sx={{ mb: 6 }}>
                              <TextField
                                {...field}
                                label="Telephone du père"
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
                          name="motherFirstName"
                          control={control}
                          defaultValue={userData.motherFirstName}
                          rules={{ required: "Prénom est requis" }}
                          render={({ field, fieldState }) => (
                            <FormControl fullWidth sx={{ mb: 6 }}>
                              <TextField
                                {...field}
                                label="Prénom de la mère"
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
                          name="motherLastName"
                          control={control}
                          defaultValue={userData.motherLastName}
                          rules={{ required: "Nom est requis" }}
                          render={({ field, fieldState }) => (
                            <FormControl fullWidth sx={{ mb: 6 }}>
                              <TextField
                                {...field}
                                label="Nom du mère"
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
                          name="motherPhoneNumber"
                          control={control}
                          defaultValue={userData.motherPhoneNumber}
                          rules={{ required: "Contact est requis" }}
                          render={({ field, fieldState }) => (
                            <FormControl fullWidth sx={{ mb: 6 }}>
                              <TextField
                                {...field}
                                label="Telephone du mère"
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
                          name="address"
                          control={control}
                          defaultValue={userData.address}
                          rules={{ required: "Adresse est requis" }}
                          render={({ field, fieldState }) => (
                            <FormControl fullWidth sx={{ mb: 6 }}>
                              <TextField
                                {...field}
                                label="Adresse"
                                multiline
                                rows={4}
                                error={Boolean(fieldState.error)}
                                helperText={fieldState.error?.message}
                                sx={{ "& .MuiOutlinedInput-root": { p: 2 } }}

                              />
                            </FormControl>
                          )}
                        />
                      </FormControl>
                      </Grid>
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
            {/* 
            <UserSuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
            <UserSubscriptionDialog open={subscriptionDialogOpen} setOpen={setSubscriptionDialogOpen} /> */}
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
