// ** React Imports
import {
  useState,
  useEffect,
  MouseEvent,
  useCallback,
  ReactNode,
  HTMLAttributes,
} from "react";

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
import {
  Autocomplete,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Custom Components Imports
import CustomAvatar from "src/@core/components/mui/avatar";

// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";

// ** Actions Imports
import { fetchData as fetchUsers } from "src/store/apps/users";
import {
  fetchData,
  deleteAbsent,
  filterData,
  updateAbsent,
} from "src/store/apps/absents";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Types Imports
import { RootState, AppDispatch } from "src/store";
import { AbsentsType } from "src/types/apps/absentsTypes";

// ** Custom Table Components Imports
import AddAbsentDrawer from "src/views/apps/absents/list/AddAbsentDrawrer";
import TableHeader from "src/views/apps/absents/list/TableHeader";
import CustomChip from "src/@core/components/mui/chip";
import { ThemeColor } from "src/@core/layouts/types";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { UserRole, UserType } from "src/types/apps/UserType";
import { Controller, useForm } from "react-hook-form";
import { fetchUser } from "src/store/apps/users";
import { set, status } from "nprogress";
import { formatDate } from "src/@core/utils/format";
import { sendMail } from "src/store/apps/mail";

interface CellType {
  row: AbsentsType;
}

interface AccountStatusType {
  [key: string]: ThemeColor;
}

const accountStatusObj: AccountStatusType = {
  oui: "success",
  non: "error",
};

const statusObj: AccountStatusType = {
  traiter: "success",
  "encour de traitement": "warning",
  "non traiter": "error",
};

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

export interface UpdateAbsentDto {
  id: number;
  justified: boolean;
  replaceUser: UserType[];
  title: string;
  body: string;
  status: string;
}

const schema = yup.object().shape({
  id: yup.number().required(),
  justified: yup.boolean().required(),
  replaceUser: yup.array().of(
    yup.object().shape({
      id: yup.number().required(),
      userData: yup.object().shape({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
      }),
    })
  ),
  title: yup.string(),
  body: yup.string(),
  status: yup.string().required(),
});

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

type ToUserType = UserType;

const RowOptions = ({ id }: { id: number }) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>();
  const [openEdit, setOpenEdit] = useState(false);
  const [absentData, setAbsentData] = useState<AbsentsType | null>(null);
  const [emailToTeachers, setEmailToTeachers] = useState<ToUserType[]>([]);
  const [emailToAgents, setEmailToAgents] = useState<ToUserType[]>([]);
  const [teacherUsers, setTeachersUsers] = useState<UserType[]>([]);
  const [agentUsers, setAgentsUsers] = useState<UserType[]>([]);

  const [justified, setJustified] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("traiter");

  const absentStore = useSelector((state: RootState) => state.absents);
  const userStore = useSelector((state: RootState) => state.users);

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateAbsentDto>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleMailDelete = (
    value: number,
    state: ToUserType[],
    setState: (val: ToUserType[]) => void
  ) => {
    const arr = state;
    const index = arr.findIndex((i) => i.id === value);
    arr.splice(index, 1);
    setState([...arr]);
  };

  const renderListItem = (
    props: HTMLAttributes<HTMLLIElement>,
    option: ToUserType,
    array: ToUserType[],
    setState: (val: ToUserType[]) => void
  ) => {
    return (
      <ListItem
        key={option.id}
        sx={{ cursor: "pointer" }}
        onClick={() => setState([...array, option])}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CustomAvatar
            skin="light"
            color="primary"
            sx={{ mr: 3, width: 22, height: 22, fontSize: ".75rem" }}
          >
            {getInitials(
              `${option.userData.firstName} ${option.userData.lastName}`
            )}
          </CustomAvatar>
          <Typography sx={{ fontSize: "0.875rem" }}>
            {option.userData.firstName} {option.userData.lastName}
          </Typography>
        </Box>
      </ListItem>
    );
  };

  const renderCustomChips = (
    array: ToUserType[],
    getTagProps: ({ index }: { index: number }) => {},
    state: ToUserType[],
    setState: (val: ToUserType[]) => void
  ) => {
    return array.map((item, index) => (
      <Chip
        size="small"
        key={item.id}
        label={`${item.userData.firstName} ${item.userData.lastName}`}
        {...(getTagProps({ index }) as {})}
        deleteIcon={<Icon icon="mdi:close" />}
        //@ts-ignore
        onDelete={() => handleMailDelete(item.id, state, setState)}
      />
    ));
  };

  useEffect(() => {
    if (openEdit) {
      const foundUser = absentStore.data.find((user) => user.id === id);
      if (foundUser) {
        setJustified(foundUser.justified);
        setTitle(foundUser.title);
        setBody(foundUser.body);
        setStatus(foundUser.status);
        setAbsentData(foundUser);
      }
    }
  }, [openEdit, id, absentStore.data]);

  useEffect(() => {
    dispatch(fetchUsers() as any);
  }, []);

  useEffect(() => {
    const teacherUsers = userStore.data.filter(
      (user) => user.role === UserRole.Teacher
    );
    setTeachersUsers(teacherUsers);
    const agentUsers = userStore.data.filter(
      (user) => user.role === UserRole.Agent
    );
    setAgentsUsers(agentUsers);
  }, [userStore.data]);

  const handleRowOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setOpenEdit(true);
  };

  const handleDelete = () => {
    // @ts-ignore
    dispatch(deleteAbsent(id) as any);
    handleRowOptionsClose();
  };

  // const handleEditSubmit = (data: UpdateAbsentDto) => {
  //   try {
  //     const formData =  handleSubmit(
  //       (data) => {
  //         return { newData: data };
  //       },
  //       (errors) => {
  //         console.error(errors);
  //       }
  //     );

  //     const { newData } = formData as any;

  //     if (newData) {
  //        dispatch(
  //         updateAbsent({ id: id, updateAbsentDto: newData }) as any
  //       );

  //       // Prepare data for sending mail
  //       const recipients = newData.emailToTeachers.concat(
  //         newData.emailToAgents
  //       );
  //       const mailData = {
  //         subject: newData.title,
  //         body: newData.body,
  //         recipients: recipients,
  //         category: 0,
  //         attachments: [],
  //       };

  //       // Dispatch the sendMail action
  //        dispatch(sendMail(mailData) as any);

  //       // Update justified and status
  //        dispatch(
  //         updateAbsent({
  //           id: id,
  //           updateAbsentDto: {
  //             ...newData,
  //             justified: justified,
  //             status: status,
  //           },
  //         }) as any
  //       );
  //     }

  //     handleEditClose();
  //     reset();
  //   } catch (error) {
  //     console.error("Error updating password or profile image:", error);
  //   }
  // };
  function handleEditSubmit(data: any) {
    console.log("data", data);
    const partialUpdateAbsentDto: Partial<AbsentsType> = { ...data };

    if (id) partialUpdateAbsentDto.id = id;
    if (data.justified) partialUpdateAbsentDto.justified = justified;
    if (data.replaceUser)
      partialUpdateAbsentDto.replaceUser =
        absentData?.absentUser.role === "Teacher"
          ? emailToTeachers
          : emailToAgents;
    if (data.title) partialUpdateAbsentDto.title = title;
    if (data.body) partialUpdateAbsentDto.body = body;
    if (data.status) partialUpdateAbsentDto.status = status;

    dispatch(updateAbsent(partialUpdateAbsentDto as AbsentsType) as any)
      .then(() => {
        reset();
      })
      .catch((error: Error) => {
        console.error("Update Absent failed:", error);
      });

    handleEditClose();
    reset();
    dispatch(fetchData() as any);
  }

  const addNewOption = (options: ToUserType[], params: any): ToUserType[] => {
    const { inputValue } = params;
    const filteredOptions = options.filter(
      (option) =>
        option.userData &&
        `${option.userData.firstName} ${option.userData.lastName}`
          .toLowerCase()
          .includes(inputValue.toLowerCase())
    );
    return filteredOptions;
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setAbsentData(null);
  };

  function handleEditChange(arg0: string, value: string): void {
    throw new Error("Function not implemented.");
  }

  function handleStateChange(
    event: SelectChangeEvent<number | null>,
    child: ReactNode
  ): void {
    throw new Error("Function not implemented.");
  }

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
          Modifier
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
          Gérer l'absence de l'utilisateur
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {absentData && absentData.absentUser.profileImage && (
            <>
              <Avatar
                src={`http://localhost:8000/uploads/${absentData.absentUser?.profileImage}`}
                sx={{ width: 80, height: 80 }}
              />
            </>
          )}
          <Typography variant="h6" sx={{ mb: 4 }}>
            {absentData?.absentUser.userData &&
              absentData?.absentUser?.userData?.firstName}{" "}
            {absentData?.absentUser?.userData?.lastName}
          </Typography>
          <CustomChip
            skin="light"
            size="small"
            label={absentData?.absentUser.role || ""}
            sx={{ textTransform: "capitalize", mb: 4 }}
          />

          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="body1">
              <strong>Raison:</strong>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                maxWidth: 400,
                overflowWrap: "break-word",
                textAlign: "left",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {absentData?.reason}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="body1" sx={{ mr: 4 }}>
              <strong>Date de Début:</strong>{" "}
              {formatDate(absentData?.datedebut ?? "")}
            </Typography>

            <Typography variant="body1" sx={{ mr: 4 }}>
              <strong>Date de Fin:</strong>{" "}
              {formatDate(absentData?.datefin ?? "")}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mr: 2 }}>
            <strong>Justifié :</strong>
          </Typography>
          <RadioGroup
            name="justified"
            value={justified.toString()}
            onChange={(e) =>
              setJustified(e.target.value === "trusamir@gmail.come")
            }
            row
          >
            <FormControlLabel value="true" control={<Radio />} label="Oui" />
            <FormControlLabel value="false" control={<Radio />} label="Non" />
          </RadioGroup>
          <Autocomplete
            multiple
            freeSolo
            value={
              absentData?.absentUser.role === "Teacher"
                ? emailToTeachers
                : emailToAgents
            }
            clearIcon={false}
            id="email-to-select"
            filterSelectedOptions
            options={
              absentData?.absentUser.role === "Teacher"
                ? teacherUsers
                : agentUsers
            }
            ListboxComponent={List}
            filterOptions={addNewOption}
            getOptionLabel={(option) =>
              (option as ToUserType).userData
                ? `${(option as ToUserType).userData?.firstName} ${
                    (option as ToUserType).userData?.lastName
                  }`
                : ""
            }
            renderOption={(props, option) =>
              renderListItem(
                props,
                option,
                absentData?.absentUser.role === "Teacher"
                  ? emailToTeachers
                  : emailToAgents,
                absentData?.absentUser.role === "Teacher"
                  ? setEmailToTeachers
                  : setEmailToAgents
              )
            }
            renderTags={(array, getTagProps) =>
              renderCustomChips(
                array,
                getTagProps,
                absentData?.absentUser.role === "Teacher"
                  ? emailToTeachers
                  : emailToAgents,
                absentData?.absentUser.role === "Teacher"
                  ? setEmailToTeachers
                  : setEmailToAgents
              )
            }
            sx={{
              width: "100%",
              mb: 4,
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                autoComplete="new-password"
                label="Remplacement"
              />
            )}
          />

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="title"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={title}
                  label="Sujet"
                  onChange={(e) => setTitle(e.target.value)}
                  error={Boolean(errors.title)}
                />
              )}
            />
            {errors.title && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.title.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name="body"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={body}
                  label="Message"
                  rows={3}
                  multiline
                  onChange={(e) => setBody(e.target.value)}
                  error={Boolean(errors.body)}
                />
              )}
            />
            {errors.body && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.body.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>État du processus</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="État du processus"
            >
              <MenuItem value="traiter">traiter</MenuItem>
              <MenuItem value="encour de traitement">
                En cours de traitement
              </MenuItem>
              <MenuItem value="non traiter">Non traiter</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            sx={{ mr: 1 }}
            onClick={() => handleEditSubmit(absentData)}
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
      return "Eleve";
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
    minWidth: 150,
    headerName: "Absent",
    field: "firstName",
    renderCell: ({ row }: CellType) => {
      const user = row.absentUser;

      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {user?.profileImage ? (
            <Avatar
              alt={`Profile Image of ${row.absentUser.userData?.firstName} ${row.absentUser.userData?.lastName}`}
              src={`http://localhost:8000/uploads/${user.profileImage}`}
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
                `${row.absentUser.userData?.firstName} ${row.absentUser.userData?.lastName}`
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
            <StyledLink href={""}>
              {row.absentUser.userData?.firstName}{" "}
              {row.absentUser.userData?.lastName}
            </StyledLink>
          </Box>
        </Box>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 165,
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
              color: userRoleObj[row.absentUser?.role]?.color || "inherit",
            },
          }}
        >
          <Icon
            icon={userRoleObj[row.absentUser?.role]?.icon || ""}
            fontSize={20}
          />{" "}
          <Typography
            noWrap
            sx={{ color: "text.secondary", textTransform: "capitalize" }}
          >
            {mapRoleToFrench(row.absentUser?.role)}
          </Typography>
        </Box>
      );
    },
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: "Reason",
    field: "reason",
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ textTransform: "capitalize" }}>
          {row.reason}
        </Typography>
      );
    },
  },
  {
    flex: 0.11,
    minWidth: 10,
    headerName: "Justifier",
    field: "justified",
    renderCell: ({ row }: CellType) => {
      const status = row.justified ? "oui" : "non";
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
    flex: 0.15,
    minWidth: 40,
    headerName: "Date de Debut",
    field: "datedebut",
    renderCell: ({ row }: CellType) => (
      <Typography noWrap>
        {row.datedebut ? new Date(row.datedebut).toLocaleDateString() : "-"}
      </Typography>
    ),
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: "Date de Fin",
    field: "datefin",
    renderCell: ({ row }: CellType) => (
      <Typography noWrap>
        {row.datefin ? new Date(row.datefin).toLocaleDateString() : "-"}
      </Typography>
    ),
  },

  {
    flex: 0.2,
    minWidth: 30,
    headerName: "Remplacement",
    field: "Nom",
    renderCell: ({ row }: CellType) => {
      const user = row.absentUser;
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
              {row.replaceUser.map((user) => (
                <span key={user.id}>
                  {user.userData?.firstName}
                  {"-"}
                </span>
              ))}
              {row.absentUser?.userData?.firstName}
            </Typography>
          </Box>
        </Box>
      );
    },
  },

  {
    flex: 0.15,
    minWidth: 30,
    headerName: "état",
    field: "status", // corrected field name
    renderCell: ({ row }: CellType) => {
      let status = "non spécifié"; // default status text

      // Determine status based on row.status value
      if (row.status === "traiter") {
        status = "traiter";
      } else if (row.status === "encour de traitement") {
        status = "encour de traitement";
      } else if (row.status === "non traiter") {
        status = "non traiter";
      }

      return (
        <CustomChip
          skin="light"
          size="small"
          label={status}
          color={statusObj[status]} // Assign color based on status
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

const AbsentList = () => {
  // ** State
  const [plan, setPlan] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>();
  const absentStore = useSelector((state: RootState) => state.absents);
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
    return absentStore.allData.map((item) => ({
      Prénom: item.absentUser?.userData?.firstName,
      Nom: item.absentUser?.userData?.lastName,
      reeson: item.reason,
      justified: item.justified ? "oui" : "non",
      dateDebut: item.datedebut,
      dateFin: item.datefin,
      remplacement: item.replaceUser.map((user) => user.userData?.firstName),
    }));
  };

  const toggleAddUserDrawer = () => {
    setAddUserOpen(!addUserOpen);
    dispatch(fetchData() as any);
  };

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
            rows={absentStore.data}
            columns={columns}
            checkboxSelection
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

export default AbsentList;
