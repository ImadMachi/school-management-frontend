// ** React Imports
import { ChangeEvent, HTMLAttributes, useRef, useState } from "react";

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
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControlLabel from "@mui/material/FormControlLabel";
import DialogContentText from "@mui/material/DialogContentText";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { fetchTeacher } from "src/store/apps/teachers";
import { TeachersType } from "src/types/apps/teacherTypes";
import EmailAppLayout from "src/views/apps/teacher/overview/mail/Mail";
import EditIcon from "@mui/icons-material/Edit";

// ** Icon Imports
import Icon from "src/@core/components/icon";
import Image from "next/image";

// ** Custom Components
import CustomChip from "src/@core/components/mui/chip";
import CustomAvatar from "src/@core/components/mui/avatar";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Types
import { ThemeColor } from "src/@core/layouts/types";

// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { updateTeacher } from "src/store/apps/teachers";
import { Controller, useForm } from "react-hook-form";
import {
  Autocomplete,
  Chip,
  FormHelperText,
  IconButton,
  List,
  ListItem,
} from "@mui/material";
import { formatDate } from "src/@core/utils/format";
import { UserType } from "src/types/apps/UserType";
import { fetchUserById, uploadProfileImage } from "src/store/apps/users";
import { MailFolderType } from "src/types/apps/mailTypes";
import { HOST } from "src/store/constants/hostname";
import subjects, { fetchData as fetchSubjects } from "src/store/apps/subjects";
import { SubjectType } from "src/types/apps/subjectTypes";

interface ColorsType {
  [key: string]: ThemeColor;
}

export interface UpdateTeacherDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  dateOfEmployment?: Date;
  sex?: string;
  subjects?: string;
  // subjects: { id: number }[];
}

const schema = yup.object().shape({
  firstName: yup.string().min(3).required(),
  lastName: yup.string().min(3).required(),
  phoneNumber: yup.string().required(),
  dateOfBirth: yup.date().required(),
  dateOfEmployment: yup.date().required(),
  sex: yup.string().required(),
  subjects: yup.string().required(),
  // subjects: yup.array().of(
  //   yup.object().shape({
  //     id: yup.number().required(),
  //   })
  // ).required(),
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
  } = useForm<UpdateTeacherDto>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const teacherStore = useSelector((state: RootState) => state.teachers);

  const subjectsStore = useSelector((state: RootState) => state.subjects);
  const user = useSelector((state: RootState) =>
    state.users.data.find((user) => user.id === parseInt(userId as string, 10))
  );

  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [userData, setUserData] = useState<TeachersType | null>(null);
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

  const handleEditSubmit = (data: UpdateTeacherDto) => {
    // Ensure id is a number
    const teacherId = parseInt(id as unknown as string, 10);
    const partialUpdateTeacherDto: Partial<UpdateTeacherDto> = {};
    if (data.firstName) partialUpdateTeacherDto.firstName = data.firstName;
    if (data.lastName) partialUpdateTeacherDto.lastName = data.lastName;
    if (data.phoneNumber)
      partialUpdateTeacherDto.phoneNumber = data.phoneNumber;
    if (data.dateOfBirth)
      partialUpdateTeacherDto.dateOfBirth = data.dateOfBirth;
    if (data.dateOfEmployment)
      partialUpdateTeacherDto.dateOfEmployment = data.dateOfEmployment;
    if (data.sex) partialUpdateTeacherDto.sex = data.sex;
    if (data.subjects) partialUpdateTeacherDto.subjects = data.subjects;

    dispatch(updateTeacher({ id: teacherId, updateTeacherDto: data }))
      .then(() => {
        reset();
      })
      .catch((error) => {
        console.error("Update teacher failed:", error);
      });
    dispatch(fetchTeacher(teacherId) as any);
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

  const handleSubjectDelete = (
    value: number,
    state: SubjectType[],
    setState: (val: SubjectType[]) => void
  ) => {
    const updatedState = state.filter((item) => item.id !== value);
    setState(updatedState);
  };

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      dispatch(fetchTeacher(Number(id)) as any);
    }
    return () => {
      setUserData(null);
    };
  }, [id]);

  useEffect(() => {
    if (teacherStore.data && teacherStore.data.length > 0) {
      setUserData(teacherStore.data[0]);
    }
    if (teacherStore.data[0]?.userId == null) {
      setSuspendDialogOpen("auto");
    }
  }, [teacherStore.data]);

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

  useEffect(() => {
    if (userData) {
      reset({
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        dateOfBirth: new Date(userData.dateOfBirth).toLocaleDateString() as any,
        dateOfEmployment: new Date(
          userData.dateOfEmployment
        ).toLocaleDateString() as any,
        sex: userData.sex,
        subjects: userData.subjects,
      });
    }
  }, [userData, reset]);

  // const filterOptions = (
  //   options: SubjectType[],
  //   params: any,
  //   value: SubjectType[]
  // ): SubjectType[] => {
  //   const { inputValue } = params;

  //   const filteredOptions = options
  //     .filter((option) =>
  //       `${option.name}`
  //         .toLowerCase()
  //         .includes(inputValue.toLowerCase())
  //     )
  //     .filter((option) => !value.find((item) => item.id === option.id));

  //   // @ts-ignore
  //   return filteredOptions;
  // };

  // const renderSubjectsListItem = (
  //   props: HTMLAttributes<HTMLLIElement>,
  //   option: SubjectType,
  //   array: SubjectType[],
  //   setState: (val: SubjectType[]) => void
  // ) => {
  //   return (
  //     <ListItem
  //       key={option.id}
  //       sx={{ cursor: "pointer" }}
  //       onClick={() => setState([...array, option])}
  //     >
  //       <Box sx={{ display: "flex", alignItems: "center" }}>
  //         <CustomAvatar
  //           skin="light"
  //           color="primary"
  //           sx={{ mr: 3, width: 22, height: 22, fontSize: ".75rem" }}
  //         >
  //           {getInitials(`${option.name}`)}
  //         </CustomAvatar>
  //         <Typography sx={{ fontSize: "0.875rem" }}>{option.name}</Typography>
  //       </Box>
  //     </ListItem>
  //   );
  // };

  // const renderCustomClassChips = (
  //   array: SubjectType[],
  //   getTagProps: ({ index }: { index: number }) => {},
  //   state: SubjectType[],
  //   setState: (val: SubjectType[]) => void
  // ) => {
  //   return array.map((item, index) => (
  //     <Chip
  //       key={item.id}
  //       label={`${item.name}`}
  //       {...(getTagProps({ index }) as {})}
  //       deleteIcon={<Icon icon="mdi:close" />}
  //       onDelete={() => handleSubjectDelete(item.id, state, setState)}
  //     />
  //   ));
  // };

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
              <CustomChip skin="light" size="small" label="Enseignant" />
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
                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, fontSize: "0.875rem" }}
                  >
                    La date de naissance:
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(userData.dateOfBirth)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, fontSize: "0.875rem" }}
                  >
                    La date d'employment:
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(userData.dateOfEmployment)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", mb: 2 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, fontSize: "0.875rem" }}
                  >
                    Sexe:
                  </Typography>
                  <Typography variant="body2">{userData.sex}</Typography>
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
                    <Grid item xs={12}>
                      <FormControl fullWidth sx={{ mb: 6 }}>
                        <Controller
                          name="dateOfBirth"
                          control={control}
                          defaultValue={
                            new Date(
                              userData.dateOfBirth
                            ).toLocaleDateString() as any
                          }
                          rules={{ required: "date de naissance est requis" }}
                          render={({ field, fieldState }) => (
                            <FormControl fullWidth sx={{ mb: 6 }}>
                              <TextField
                                {...field}
                                label="Date de naissance"
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
                          name="dateOfEmployment"
                          control={control}
                          defaultValue={new Date(userData.dateOfEmployment)}
                          rules={{ required: "Date d'embauche est requis" }}
                          render={({ field, fieldState }) => (
                            <FormControl fullWidth sx={{ mb: 6 }}>
                              <TextField
                                {...field}
                                label="Date d'embauche"
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
                          name="sex"
                          control={control}
                          defaultValue={userData.sex}
                          rules={{ required: "Sexe est requis" }}
                          render={({ field, fieldState }) => (
                            <FormControl fullWidth sx={{ mb: 6 }}>
                              <TextField
                                {...field}
                                label="Sexe"
                                error={Boolean(fieldState.error)}
                                helperText={fieldState.error?.message}
                              />
                            </FormControl>
                          )}
                        />
                      </FormControl>
                      {/* <FormControl fullWidth sx={{ mb: 6 }}>
                        <Controller
                          name="subjects"
                          control={control}
                          defaultValue={userData.subjects || []}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <Autocomplete
                              multiple
                              value={value}
                              clearIcon={false}
                              id="subjects-select"
                              filterSelectedOptions
                              options={subjectsStore.data}
                              ListboxComponent={List}
                              filterOptions={(options, params) => filterOptions(options, params, value)}
                              getOptionLabel={(option) => `${option.id}`}
                              renderOption={(props, option) => renderSubjectsListItem(props, option, value, onChange)}
                              onChange={(event, newValue) => {
                                onChange(newValue);
                              }}
                              renderTags={(array, getTagProps) =>
                                renderCustomClassChips(array, getTagProps, value, onChange)
                              }
                              renderInput={(params) => (
                                <TextField {...params} label="Matières" />
                              )}
                            />
                          )}
                        />

                        {errors.subjects && (
                          <FormHelperText sx={{ color: "error.main" }}>
                            {errors.subjects.message}
                          </FormHelperText>
                        )}
                      </FormControl> */}
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
