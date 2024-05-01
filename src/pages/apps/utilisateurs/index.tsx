// ** React Imports
import { useState, useEffect, useCallback, ChangeEvent, useRef } from "react";

// ** Next Imports
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CustomChip from "src/@core/components/mui/chip";

// ** Icon Imports
import Icon from "src/@core/components/icon";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import * as yup from "yup";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "src/store";

// ** Custom Components Imports
import CustomAvatar from "src/@core/components/mui/avatar";

// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";

// ** Actions Imports
import {
  fetchData,
  filterData,
  updatePassword,
  updateUserStatus,
  uploadProfileImage,
} from "src/store/apps/users";
// ** Types Imports
import { UserRole, UserType } from "src/types/apps/UserType";
// ** Custom Table Components Imports
import { useAuth } from "src/hooks/useAuth";
import TableHeader from "src/views/apps/user/list/TableHeader";
import { ThemeColor } from "src/@core/layouts/types";
import {
  Avatar,
  Button,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  setAdministratorId,
  setAdministratorUserId,
} from "src/store/apps/administrator";
import { setDirectorId, setDirectorUserId } from "src/store/apps/directors";
import { setTeacherId, setTeacherUserId } from "src/store/apps/teachers";
import { setStudentId, setStudentUserId } from "src/store/apps/students";
import { setParentId, setParentUserId } from "src/store/apps/parents";
import { setAgentId, setAgentUserId } from "src/store/apps/agents";

interface CellType {
  row: UserType;
}
interface AccountStatusType {
  [key: string]: ThemeColor;
}
interface UserRoleType {
  [key: string]: { icon: string; color: string };
}

const userRoleObj: UserRoleType = {
  Director: { icon: "mdi:account-tie", color: "error.main" },
  Administrator: { icon: "mdi:account-cog", color: "warning.main" },
  Teacher: { icon: "mdi:teacher", color: "info.main" },
  Student: { icon: "mdi:school", color: "success.main" },
  Parent: { icon: "mdi:account-child", color: "primary.main" },
  Agent: { icon: "mdi:support", color: "secondary.main" },
};

export interface UpdateUserDto {
  profileImage?: File;
  email?: string;
  password?: string;
  confirmPassword?: string;
}
const schema = yup.object().shape({
  profileImage: yup.mixed().notRequired(),
  email: yup.string().email().required("L'email est requis"),
  password: yup
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .required("Le mot de passe est requis"),
  confirmPassword: yup
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .oneOf(
      [yup.ref("password"), null],
      "Les mots de passe ne correspondent pas"
    )
    .required("La confirmation du mot de passe est requise"),
});

const accountStatusObj: AccountStatusType = {
  oui: "success",
  non: "error",
};
const StyledLink = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "1rem",
  cursor: "pointer",
  textDecoration: "none",
  color: theme.palette.text.secondary,
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

// ** renders client column
// ** renders client column
const RowOptions = ({ id }: { id: number }) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>();
  const auth = useAuth();

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  useState<UserType | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserDto>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const rowOptionsOpen = Boolean(anchorEl);
  const userStore = useSelector((state: RootState) => state.users);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (openEdit) {
      const foundUser = userStore.data.find((user) => user.id === id);
      if (foundUser) {
        setUserData(foundUser);
        setPassword(foundUser.password || "");
        setConfirmPassword(foundUser.password || "");
      }
    }
  }, [openEdit, id, userStore.data]);

  useEffect(() => {
    if (userStore.data && userStore.data.length > 0) {
      setUserData(userStore.data[0]);
    }
  }, [userStore.data]);

  const handleEditClick = () => {
    fileInputRef.current?.click();
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setUserData(null);
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
      const userId = id;
      try {
        const response = await dispatch(
          uploadProfileImage({ id: userId, file }) as any
        ).unwrap();

        if (userData) {
          const imageUrl = response.profileImage;
          setUserData({ ...userData, profileImage: imageUrl });
        }
      } catch (error) {
        console.error("Error uploading profile image:", error);
      }
      e.target.value = "";
    }
  };

  // const handleEditSubmit = async () => {
  //   try {
  //     const formData = handleSubmit();

  //     const { newPassword, profileImage } = formData as any;

  //     if (newPassword) {
  //       await dispatch(
  //         updatePassword({ id: id, newPassword: newPassword }) as any
  //       );
  //     }

  //     if (profileImage) {
  //       const response = await dispatch(
  //         uploadProfileImage({ id, file: profileImage }) as any
  //       ).unwrap();

  //       if (userData) {
  //         const imageUrl = response.profileImage;
  //         setUserData({ ...userData, profileImage: imageUrl });
  //       }
  //     }
  //     handleEditClose();
  //   } catch (error) {
  //     console.error("Error updating password or profile image:", error);
  //   }
  // };

  function handleEditSubmit(data: any) {
    const partialUpdatePasswordDto: Partial<UpdateUserDto> = { ...data };
    const newPassword = confirmPassword;

    // Check if newPassword is not undefined
    if (typeof newPassword === "string") {
      dispatch(
        updatePassword({
          id: id,
          newPassword,
        }) as any
      )
        .then(() => {
          reset();
          dispatch(fetchData() as any);
        })
        .catch((error: Error) => {
          console.error("Update User failed:", error);
          // Handle error
        });

      handleEditClose();
    } else {
      console.error("New password is undefined");
      // Handle error, maybe display a message to the user
    }
  }

  const handleRowOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
    // dispatch(setSelectedId(id));
    setAnchorEl(event.currentTarget);
  };
  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };
  const handleDelete = async () => {
    if (!userData) {
      return;
    }

    const updatedUserData = { ...userData, disabled: true };

    try {
      await dispatch(updateUserStatus({ id: id, disabled: true }) as any);

      await dispatch(fetchData() as any);
    } catch (error) {
      console.error("Error disabling user:", error);
    }
    setUserData(updatedUserData);
  };

  return (
    <>
      <IconButton size="small" onClick={handleRowOptionsClick}>
        <Icon icon="mdi:dots-vertical" />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{ style: { minWidth: "8rem" } }}
      >
        <MenuItem onClick={handleEditClick} sx={{ "& svg": { mr: 2 } }}>
          <Icon icon="mdi:pencil-outline" fontSize={20} />
          Changer mot de passe
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ "& svg": { mr: 2 } }}>
          <Icon icon="mdi:delete-outline" fontSize={20} />
          Supprimer
        </MenuItem>
      </Menu>
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
          Changer le mot de pass
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {/* <div
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
            style={{ position: "relative" }}
          >
            {userData && userData.profileImage && (
              <> */}
          <Avatar
            alt={`Profile Image of ${userData?.userData?.firstName} ${userData?.userData?.lastName}`}
            src={`http://localhost:8000/uploads/${userData?.profileImage}`}
            sx={{ width: 80, height: 80 }}
          />
          {/* {isHovered && (
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
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div> */}

          <Typography variant="h6" sx={{ mb: 4 }}>
            {userData?.userData?.firstName} {userData?.userData?.lastName}
          </Typography>
          <CustomChip
            skin="light"
            size="small"
            label={userData?.role || ""}
            sx={{ textTransform: "capitalize", mb: 4 }}
          />
          <CustomChip
            skin="light"
            size="medium"
            label={userData?.email || ""}
            sx={{ textTransform: "capitalize", mb: 4 }}
          />
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  type="password"
                  {...field}
                  label="Nouveau mot de passe"
                  placeholder="********"
                  error={Boolean(errors.password)}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setPassword(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            {errors.password && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.password.message}
              </FormHelperText>
            )}
          </FormControl>
          {/* <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  type="password"
                  {...field}
                  label="Confirmer le mot de passe"
                  placeholder="********"
                  error={Boolean(errors.confirmPassword)}
                  onChange={(e) => {
                    field.onChange(e.target.value); // Update input value
                    setConfirmPassword(e.target.value); // Update confirmPassword state
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            {errors.confirmPassword && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.confirmPassword.message}
              </FormHelperText>
            )}
          </FormControl> */}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            sx={{ mr: 1 }}
            onClick={() => handleEditSubmit(userData)}
          >
            Soumetre
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleEditClose}
          >
            Cancel
          </Button>
        </DialogActions>{" "}
      </Dialog>
    </>
  );
};

export const mapRoleToFrench = (role: string) => {
  switch (role) {
    case UserRole.Director:
      return "Directeur";
    case UserRole.Administrator:
      return "Administrateur";
    case UserRole.Teacher:
      return "Enseignant";
    case UserRole.Student:
      return "Elève";
    case UserRole.Parent:
      return "Parent";
    case UserRole.Agent:
      return "Agent";
    default:
      return role;
  }
};

const columns = [
  {
    flex: 0.2,
    minWidth: 230,
    headerName: "Utilisateur",
    field: "Utilisateur",
    renderCell: ({ row }: CellType) => {
      const dispatch = useDispatch<AppDispatch>();

      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {row.profileImage ? (
            <Avatar
              alt={`Profile Image of ${row.userData?.firstName} ${row.userData?.lastName}`}
              src={`http://localhost:8000/uploads/${row.profileImage}`}
              sx={{ width: 30, height: 30, marginRight: "10px" }}
            />
          ) : (
            <CustomAvatar
              skin="light"
              color={"primary"}
              sx={{
                width: 30,
                height: 30,
                fontSize: ".875rem",
                marginRight: "10px",
              }}
            >
              {getInitials(
                `${row.userData?.firstName} ${row.userData?.lastName}`
              )}
            </CustomAvatar>
          )}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            <StyledLink
              href={`/apps/${mapRoleToFrench(
                row.role
              ).toLocaleLowerCase()}s/overview/inbox/${row.id}/${
                row.userData?.id
              }`}
              onClick={() => {
                if (row.role === "Administrator") {
                  dispatch(setAdministratorId(row.userData.id));
                  dispatch(setAdministratorUserId(row.id));
                } else if (row.role === "Director") {
                  dispatch(setDirectorId(row.userData.id));
                  dispatch(setDirectorUserId(row.id));
                } else if (row.role === "Teacher") {
                  dispatch(setTeacherId(row.userData.id));
                  dispatch(setTeacherUserId(row.id));
                } else if (row.role === "Student") {
                  dispatch(setStudentId(row.userData.id));
                  dispatch(setStudentUserId(row.id));
                } else if (row.role === "Parent") {
                  dispatch(setParentId(row.userData.id));
                  dispatch(setParentUserId(row.id));
                } else if (row.role === "Agent") {
                  dispatch(setAgentId(row.userData.id));
                  dispatch(setAgentUserId(row.id));
                }
              }}
            >
              {row.userData?.firstName} {row.userData?.lastName}
            </StyledLink>
          </Box>
        </Box>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: "Role",
    field: "role",
    renderCell: ({ row }: CellType) => {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            "& svg": {
              mr: 3,
              color: userRoleObj[row.role]?.color || "inherit",
            },
          }}
        >
          <Icon icon={userRoleObj[row.role]?.icon || ""} fontSize={20} />{" "}
          <Typography
            noWrap
            sx={{ color: "text.secondary", textTransform: "capitalize" }}
          >
            {mapRoleToFrench(row.role)}
          </Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: "Email",
    field: "email",
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ textTransform: "capitalize" }}>
          {row.email}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: "Active",
    field: "userId",
    renderCell: ({ row }: CellType) => {
      const status = !!row.isActive ? "oui" : "non";
      return (
        <CustomChip
          skin="light"
          size="small"
          label={status}
          color={accountStatusObj[status]}
          sx={{ textTransform: "capitalize" }}
        />
      );
    },
  },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: "actions",
    headerName: "Actions",
    renderCell: ({ row }: CellType) => <RowOptions id={row.id} />,
  },
];

const UserList = () => {
  // ** State
  const [plan, setPlan] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>();
  const userStore = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchData() as any);
  }, []);

  useEffect(() => {
    dispatch(filterData(value));
  }, [dispatch, plan, value]);

  const handleFilter = useCallback((val: string) => {
    setValue(val);
  }, []);

  const generateCSVData = () => {
    return userStore.allData.map((item) => ({
      Id: item.id,
      Role: item.role,
      Email: item.email,
      compte: !!item.isActive ? "oui" : "non",
    }));
  };

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            generateCSVData={generateCSVData}
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddUserDrawer}
          />
          <DataGrid
            autoHeight
            rows={userStore.data}
            columns={columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default UserList;
