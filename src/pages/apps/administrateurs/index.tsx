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
// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Custom Components Imports
import CustomAvatar from "src/@core/components/mui/avatar";

// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";

// ** Actions Imports
import {
  fetchData,
  deleteAdministrator,
  filterData,
  updateAdministratorStatus,
} from "src/store/apps/administrator";

import { setAdministratorId } from "src/store/apps/administrator";

import { setAdministratorUserId } from "src/store/apps/administrator";

// ** Types Imports
import { RootState, AppDispatch } from "src/store";
import { AdministratorType } from "src/types/apps/administratorTypes";

// ** Custom Table Components Imports
import TableHeader from "src/views/apps/administrators/list/TableHeader";
import AddAdministratorDrawer from "src/views/apps/administrators/list/AddAdministratorDrawer";
import CustomChip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import { fetchUserById, reactivateAccount } from "src/store/apps/users";
import { Avatar } from "@mui/material";
import toast from "react-hot-toast";
import SidebarAddAdministratorAccount from "src/views/apps/administrators/list/AddAdministratorAccountDrawer";
import { HOST } from "src/store/constants/hostname";

interface CellType {
  row: AdministratorType;
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

const RowOptions = ({
  id,
  userId,
  row,
}: {
  id: number;
  userId: number;
  row: AdministratorType;
}) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>();

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [modifyClicked, setModifyClicked] = useState<boolean>(false);
  const [isAddAdministratorOpen, setIsAddAdministratorOpen] = useState(false);

  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
    dispatch(setAdministratorId(id));
    dispatch(setAdministratorUserId(userId));
    setAnchorEl(event.currentTarget);
    setModifyClicked(false);
  };

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    await dispatch(
      updateAdministratorStatus({ id: id, disabled: true }) as any
    );
  };

  const handleModifyClick = () => {
    if (row.user && row.user.disabled) {
      dispatch(reactivateAccount({ id: row.user.id }) as any);
      dispatch(fetchData() as any);
    } else if (row.user && !row.user.disabled) {
      toast.error("Cet utilisateur a déjà un compte.");
    } else {
      setIsAddAdministratorOpen(true);
    }
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
        <MenuItem
          component={Link}
          sx={{ "& svg": { mr: 2 } }}
          onClick={handleRowOptionsClose}
          href={`/apps/administrateurs/overview/inbox/${userId}/${id}`}
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
      {isAddAdministratorOpen && (
        <SidebarAddAdministratorAccount
          id={id}
          open={isAddAdministratorOpen}
          toggle={() => setIsAddAdministratorOpen(false)}
        />
      )}
    </>
  );
};

const columns = [
  {
    flex: 0.2,
    minWidth: 230,
    headerName: "administrateur",
    field: "firstName",
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
              href={`/apps/administrateurs/overview/inbox/${row.userId}/${row.id}`}
              onClick={() => {
                dispatch(setAdministratorId(row.id));
                dispatch(setAdministratorUserId(row.userId));
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
    flex: 0.05,
    minWidth: 90,
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
      <RowOptions id={row.id} userId={row.userId} row={row} />
    ),
  },
];

const AdministratorList = () => {
  // ** State
  const [plan, setPlan] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>();

  const administratorStore = useSelector(
    (state: RootState) => state.administrator
  );

  useEffect(() => {
    dispatch(fetchData() as any);
  }, []);

  useEffect(() => {
    dispatch(filterData(value));
  }, [dispatch, plan, value]);

  const handleFilter = useCallback((val: string) => {
    setValue(val);
  }, []);

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
            rows={administratorStore.data}
            columns={columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>

      <AddAdministratorDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  );
};

export default AdministratorList;
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
