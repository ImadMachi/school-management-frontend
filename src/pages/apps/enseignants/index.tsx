// ** React Imports
import { useState, useEffect, MouseEvent, useCallback } from "react";

// ** Next Imports
import Link from "next/link";

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
  deleteTeacher,
  filterData,
  setTeacherId,
  setTeacherUserId,
  updateTeacherStatus,
} from "src/store/apps/teachers";

// ** Types Imports
import { TeachersType } from "src/types/apps/teacherTypes";
// ** Custom Table Components Imports
import { useAuth } from "src/hooks/useAuth";
import TableHeader from "src/views/apps/teacher/list/TableHeader";
import SidebarAddTeacher from "src/views/apps/teacher/list/AddTeacherDrawer";
import { ThemeColor } from "src/@core/layouts/types";
import { fetchUserById, updateUserStatus } from "src/store/apps/users";
import { Avatar } from "@mui/material";
import { UserType } from "src/types/apps/UserType";
import SidebarAddTeacherAccount from "src/views/apps/teacher/list/AddTeacherAccountDrawer";
import toast from "react-hot-toast";
import { HOST } from "src/store/constants/hostname";

import { fetchData as fetchUsers } from "src/store/apps/users";

interface CellType {
  row: TeachersType;
}
interface AccountStatusType {
  [key: string]: ThemeColor;
}

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
const renderClient = (row: TeachersType) => {
  return (
    <CustomAvatar
      skin="light"
      color={"primary"}
      sx={{ mr: 3, width: 30, height: 30, fontSize: ".875rem" }}
    >
      {getInitials(`${row.firstName} ${row.lastName}`)}
    </CustomAvatar>
  );
};

const RowOptions = ({ id, userId }: { id: number; userId: number }) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>();

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [modifyClicked, setModifyClicked] = useState<boolean>(false);

  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
    dispatch(setTeacherId(id));
    dispatch(setTeacherUserId(userId));
    setAnchorEl(event.currentTarget);
    setModifyClicked(false);
  };
  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  // const handleDelete = () => {
  //   dispatch(deleteTeacher(id) as any);
  //   handleRowOptionsClose();
  // };

  const handleDelete = async () => {
    await dispatch(updateTeacherStatus({ id: id, disabled: true }) as any);
  };

  const handleModifyClick = () => {
    if (userId) {
      toast.error("Cet utilisateur a déjà un compte.");
    } else {
      setIsAddTeacherOpen(true);
      handleRowOptionsClose();
    }
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
        <MenuItem
          component={Link}
          sx={{ "& svg": { mr: 2 } }}
          onClick={handleRowOptionsClose}
          href={`/apps/enseignants/overview/inbox/${userId}/${id}`}
        >
          <Icon icon="mdi:eye-outline" fontSize={20} />
          Voir
        </MenuItem>
        <MenuItem onClick={handleModifyClick} sx={{ "& svg": { mr: 2 } }}>
          <Icon icon="mdi:pencil-outline" fontSize={20} />
          Créer le compte
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ "& svg": { mr: 2 } }}>
          <Icon icon="mdi:delete-outline" fontSize={20} />
          Supprimer
        </MenuItem>
      </Menu>
      {isAddTeacherOpen && (
        <SidebarAddTeacherAccount
          id={id}
          open={isAddTeacherOpen}
          toggle={() => setIsAddTeacherOpen(false)}
        />
      )}
    </>
  );
};

const columns = [
  {
    flex: 0.2,
    minWidth: 230,
    headerName: "Utilisateur",
    field: "Utilisateur",
    renderCell: ({ row }: CellType) => {
      const { firstName, lastName } = row;
      const dispatch = useDispatch<AppDispatch>();
      const user = useSelector((state: RootState) =>
        state.users.data.find((user) => user.id === row.userId)
      );

      useEffect(() => {
        if (row.userId) {
          dispatch(fetchUserById(row.userId) as any);
        }
      }, [dispatch, row.userId]);

      useEffect(() => {
        if (row.userId) {
          dispatch(fetchUserById(row.userId) as any);
        }
      }, [dispatch, row.userId]);
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {user?.profileImage ? (
            <Avatar
              alt={`Profile Image of ${row.firstName} ${row.lastName}`}
              src={`${HOST}/uploads/${user.profileImage}`}
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
              {getInitials(`${row.firstName} ${row.lastName}`)}
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
              href={`/apps/enseignants/overview/inbox/${row.userId}/${row.id}`}
              onClick={() => {
                dispatch(setTeacherId(row.id));
                dispatch(setTeacherUserId(row.userId));
              }}
            >
              {firstName} {lastName}
            </StyledLink>
          </Box>
        </Box>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: "Telephone",
    field: "phoneNumber",
    renderCell: ({ row }: CellType) => {
      return <Typography noWrap>{row.phoneNumber}</Typography>;
    },
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: "Date de Naissance",
    field: "dateOfBirth",
    renderCell: ({ row }: CellType) => (
      <Typography noWrap>
        {row.dateOfBirth ? new Date(row.dateOfBirth).toLocaleDateString() : "-"}
      </Typography>
    ),
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: "Date de Embauche",
    field: "dateofEmployment",
    renderCell: ({ row }: CellType) => (
      <Typography noWrap>
        {row.dateOfEmployment
          ? new Date(row.dateOfEmployment).toLocaleDateString()
          : "-"}
      </Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: "sex",
    headerName: "Sexe",
    renderCell: ({ row }: CellType) => (
      <Typography noWrap>{row.sex || "-"}</Typography>
    ),
  },
  {
    flex: 0.17,
    minWidth: 40,
    headerName: "Matieres",
    field: "matieres",
    renderCell: ({ row }: CellType) => {
      const subjects = row.subjects || [];
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            <Typography noWrap>
              {subjects.length
                ? subjects.map((sub, index) => (
                    <span key={sub.id}>
                      {sub.name ?? "non spécifié"}
                      {index !== subjects.length - 1 && "-"}
                    </span>
                  ))
                : "- -"}
            </Typography>
          </Box>
        </Box>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: "Compte",
    field: "userId",
    renderCell: ({ row }: CellType) => {
      const status = row.user ? (row.user?.disabled ? "non" : "oui") : "non";
      return (
        <CustomChip
          skin="light"
          size="small"
          label={status}
          color={accountStatusObj[status]}
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
    renderCell: ({ row }: CellType) => (
      <RowOptions id={row.id} userId={row.userId} />
    ),
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
  const teacherStore = useSelector((state: RootState) => state.teachers);

  useEffect(() => {
    dispatch(fetchData() as any);
  }, []);

  useEffect(() => {
    dispatch(filterData(value));
  }, [dispatch, plan, value]);

  useEffect(() => {
    dispatch(fetchUsers() as any);
  }, []);

  const handleFilter = useCallback((val: string) => {
    setValue(val);
  }, []);

  // const generateCSVData = () => {
  //   return teacherStore.allData.map((item) => ({
  //     Prénom: item.firstName,
  //     Nom: item.lastName,
  //     DateNaissance: item.dateOfBirth,
  //     DateEmbauche: item.dateOfEmployment,
  //     Tel: item.phoneNumber,
  //     Sexe: item.sex || "-",

  //     compte: !!item.userId ? "oui" : "non",
  //   }));
  // };

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            // generateCSVData={generateCSVData}
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddUserDrawer}
          />
          <DataGrid
            autoHeight
            rows={teacherStore.data}
            columns={columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>

      <SidebarAddTeacher open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  );
};

export default UserList;
