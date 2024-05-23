// ** React Imports
import { useState, useEffect, useCallback } from "react";

// ** Next Imports
import Link from "next/link";

// ** MUI Imports
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

// ** Types Imports
import { RootState, AppDispatch } from "src/store";

// ** Custom Table Components Imports
import { ThemeColor } from "src/@core/layouts/types";
import { AbsenceType } from "src/types/apps/absenceTypes";
import TableHeader from "src/views/apps/absences/list/TableHeader";
import { deleteAbsence, fetchData, filterData } from "src/store/apps/absences";
import { format } from "date-fns";
import CustomChip from "src/@core/components/mui/chip";
import CustomAvatar from "src/@core/components/mui/avatar";
import { getInitials } from "src/@core/utils/get-initials";
import AddAbsenceDrawer from "src/views/apps/absences/list/AddAbsenceDrawrer";
import EditAbsenceModal from "src/views/apps/absences/list/EditAbsenceModal";
import { HOST } from "src/store/constants/hostname";
import { Avatar, Box } from "@mui/material";

interface CellType {
  row: AbsenceType;
}

interface AbsenceStatusType {
  [key: string]: ThemeColor;
}

const absenceStatusObj: AbsenceStatusType = {
  "not treated": "error",
  treating: "warning",
  treated: "success",
};

const absenceJustificationColor = (justified: boolean) => {
  switch (justified) {
    case true:
      return "success";
    case false:
      return "error";
    default:
      return "info";
  }
};

function mapAbsenceStatus(status: string) {
  switch (status) {
    case "not treated":
      return "Non traitée";
    case "treating":
      return "En cours de traitement";
    case "treated":
      return "Traitée";
    default:
      return status;
  }
}

function mapAbsenceJustification(justified: boolean) {
  switch (justified) {
    case true:
      return "Oui";
    case false:
      return "Non";
    default:
      return "-";
  }
}

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
  toggle,
  handleAbsenceId,
}: {
  id: number;
  toggle: () => void;
  handleAbsenceId: (abs: number) => void;
}) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>();

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    // @ts-ignore
    dispatch(deleteAbsence(id) as any);
    handleRowOptionsClose();
  };

  const handleEditAbsence = () => {
    handleAbsenceId(id);
    toggle();
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
          onClick={handleEditAbsence}
          href="javascript:void(0);"
        >
          <Icon icon="mdi:eye-outline" fontSize={20} />
          Modifier
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ "& svg": { mr: 2 } }}>
          <Icon icon="mdi:delete-outline" fontSize={20} />
          Supprimer
        </MenuItem>
      </Menu>
    </>
  );
};

interface ColumnsProps {
  toggle: () => void;
  handleAbsenceId: (id: number) => void;
}
const columns = ({ toggle, handleAbsenceId }: ColumnsProps) => [
  {
    flex: 0.2,
    headerName: "Absent",
    field: "absent",
    renderCell: ({ row }: CellType) => {
      const dispatch = useDispatch<AppDispatch>();

      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {row.absentUser.profileImage ? (
            <Avatar
              alt={`Profile Image of ${row.absentUser?.email} `}
              src={`${HOST}/uploads/${row.absentUser.profileImage}`}
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
                `${row.absentUser?.email}`
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
            <Typography noWrap>{row.absentUser.email}</Typography>
          </Box>
        </Box>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: "Date Début",
    field: "startDate",
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap>
          {format(new Date(row.startDate), "dd/MM/yyyy")}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: "Date Fin",
    field: "endDate",
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap>
          {format(new Date(row.endDate), "dd/MM/yyyy")}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: "Justifié",
    field: "justified",
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          skin="light"
          size="small"
          label={mapAbsenceJustification(row.justified)}
          color={absenceJustificationColor(row.justified)}
        />
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: "Statut",
    field: "status",
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          skin="light"
          size="small"
          label={mapAbsenceStatus(row.status)}
          color={absenceStatusObj[row.status]}
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
      <RowOptions
        id={row.id}
        toggle={toggle}
        handleAbsenceId={handleAbsenceId}
      />
    ),
  },
];

const AbsenceList = () => {
  // ** State
  const [plan, setPlan] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [addAbsenceOpen, setAddAbsenceOpen] = useState<boolean>(false);
  const [editAbsenceOpen, setEditAbsenceOpen] = useState<boolean>(false);
  const [absenceToEdit, setAbsenceToEdit] = useState<AbsenceType | null>(null);

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>();

  const absenceStore = useSelector((state: RootState) => state.absences);

  useEffect(() => {
    dispatch(fetchData() as any);
  }, []);
  
  useEffect(() => {
    dispatch(filterData(value));
  }, [dispatch, plan, value]);

  const handleFilter = useCallback((val: string) => {
    setValue(val);
  }, []);

  const toggleAddUserDrawer = () => setAddAbsenceOpen(!addAbsenceOpen);

  const toggleEditAbsenceModal = () => setEditAbsenceOpen(!editAbsenceOpen);

  const handleAbsenceId = (id: number) => {
    const absence = absenceStore.data.find((abs) => abs.id === id);
    if (absence) {
      setAbsenceToEdit(absence);
    }
  };

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
            rows={absenceStore.data}
            columns={columns({
              toggle: toggleEditAbsenceModal,
              handleAbsenceId,
            })}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>
      <AddAbsenceDrawer open={addAbsenceOpen} toggle={toggleAddUserDrawer} />
      <EditAbsenceModal
        open={editAbsenceOpen}
        toggle={toggleEditAbsenceModal}
        absenceToEdit={absenceToEdit}
        setAbsenceToEdit={setAbsenceToEdit}
      />
    </Grid>
  );
};

export default AbsenceList;
