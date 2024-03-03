// ** React Imports
import { useState, useEffect, MouseEvent, useCallback } from "react";

// ** Next Imports
import Link from "next/link";
import { GetStaticProps, InferGetStaticPropsType } from "next/types";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CustomChip from "src/@core/components/mui/chip";

// ** Icon Imports
import Icon from "src/@core/components/icon";

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
  fetchUserById,
  filterData,
  setSelectedId,
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
} from "@mui/material";
import EditUserPopup from "src/views/apps/user/list/EditUserPopup";
import select from "src/@core/theme/overrides/select";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Action } from "@reduxjs/toolkit";

interface CellType {
  row: UserType;
}
interface AccountStatusType {
  [key: string]: ThemeColor;
}

export interface UpdateUserDto {
  profileImage?: File;
  email?: string;
  password?: string;
}

const schema = yup.object().shape({
  firstName: yup.string().min(3).required(),
  lastName: yup.string().min(3).required(),
  phoneNumber: yup.string().required(),
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
  const [editUserPopupOpen, setEditUserPopupOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] =
    useState<UserType | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [userData, setUserData] = useState<UserType | null>(null);
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

  useEffect(() => {
    // Fetch user data when the component mounts
    if (openEdit) {
      dispatch(fetchUserById(id) as any);
    }
  }, [openEdit, dispatch, id]);

  useEffect(() => {
    // Update state when the data is updated
    if (userStore.data && userStore.data.length > 0) {
      setUserData(userStore.data[0]);
    }
    console.log("userStore.data", userStore.data[0]);
  }, [userStore.data]);

  const handleEditClick = () => {
    dispatch(setSelectedId(id));
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setUserData(null);
  };

  const handleEditSubmit = () => {
    // Implement your logic to update user data here
    // You can use updateUserById(userData) or similar function
    // Don't forget to close the dialog after updating
    handleEditClose();
  };

  const handleRowOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
    dispatch(setSelectedId(id));
    console.log(id);
    setAnchorEl(event.currentTarget);
  };
  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    // dispatch(deleteuser(id) as any)
    handleRowOptionsClose();
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
        {/* <MenuItem
          component={Link}
          sx={{ "& svg": { mr: 2 } }}
          onClick={handleRowOptionsClose}
          href="/apps/utili sateurs/overview/index"
        >
          <Icon icon="mdi:eye-outline" fontSize={20} />
          Voir
        </MenuItem> */}
        <MenuItem onClick={handleEditClick} sx={{ "& svg": { mr: 2 } }}>
          <Icon icon="mdi:pencil-outline" fontSize={20} />
          Modifier
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ "& svg": { mr: 2 } }}>
          <Icon icon="mdi:delete-outline" fontSize={20} />
          Supprimer
        </MenuItem>
      </Menu>
      {/* Edit User Dialog */}
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
          Modifier les informations de l'utilisateur
        </DialogTitle>
        <DialogContent>
          {/* Display the old profile image */}
          {userData && userData.profileImage && (
            <Avatar
              alt={`Profile Image of ${userData.userData?.firstName} ${userData.userData?.lastName}`}
              src={`http://localhost:8000/uploads/${userData.profileImage}`}
              sx={{ width: 100, height: 100, margin: "auto", mb: 2 }}
            />
          )}

          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name="email"
                control={control}
                defaultValue={userData?.email}
                rules={{ required: "Contact est requis" }}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <TextField
                      {...field}
                      label="Email"
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
                name="password"
                control={control}
                defaultValue={userData?.email}
                rules={{ required: "Contact est requis" }}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <TextField
                      {...field}
                      type="password"
                      // value={value}
                      label="Mot de passe"
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message}
                    />
                  </FormControl>
                )}
              />
            </FormControl>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            sx={{ mr: 1 }}
            onSubmit={handleEditSubmit}
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
        </DialogActions>{" "}
      </Dialog>
    </>
  );
};

const mapRoleToFrench = (role: string) => {
  switch (role) {
    case UserRole.Director:
      return "Directeur";
    case UserRole.Administrator:
      return "Administrateur";
    case UserRole.Teacher:
      return "Enseignant";
    case UserRole.Student:
      return "Etudiant";
    case UserRole.Parent:
      return "Parent";
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
              href="/apps/utilisateurs/overview/index"
              onClick={() => {
                dispatch(setSelectedId(row.id));
                console.log("id", row.id);
              }}
            >
              {row.userData?.firstName ? row.userData?.firstName : "Admin"}{" "}
              {row.userData?.lastName ? row.userData?.lastName : ""}
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
        <Typography noWrap sx={{ textTransform: "capitalize" }}>
          {mapRoleToFrench(row.role)}
        </Typography>
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
            checkboxSelection
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>

      {/* <SidebarAddStudent open={addUserOpen} toggle={toggleAddUserDrawer} /> */}
    </Grid>
  );
};

export default UserList;
