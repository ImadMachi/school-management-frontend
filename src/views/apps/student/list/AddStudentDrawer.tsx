// ** React Imports
import {
  ChangeEvent,
  HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";

// ** MUI Imports
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box, { BoxProps } from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import CustomAvatar from "src/@core/components/mui/avatar";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller, useWatch } from "react-hook-form";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Types Imports
import { AppDispatch, RootState } from "src/store";
import {
  Autocomplete,
  Avatar,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
} from "@mui/material";
import { addStudent, fetchStudent } from "src/store/apps/students";
import { fetchData as fetchStudents } from "src/store/apps/students";
import { on } from "events";
import { StudentsType } from "src/types/apps/studentTypes";
import { fetchData } from "src/store/apps/parents";
import { getInitials } from "src/@core/utils/get-initials";
import { ParentsType } from "src/types/apps/parentTypes";
import { HOST } from "src/store/constants/hostname";

interface SidebarAddStudentType {
  open: boolean;
  toggle: () => void;
}

export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  identification: string;
  dateOfBirth: Date;
  sex: string;
  parent: {
    id: number;
  };
  createAccount: boolean;
  createUserDto?: {
    email: string;
    password: string;
  };
  profileImage?: File;
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const schema = yup.object().shape({
  firstName: yup.string().min(3).required(),
  lastName: yup.string().min(3).required(),
  identification: yup.string().min(7).required(),
  dateOfBirth: yup.date().required(),
  sex: yup.string().required(),
  parent: yup.object().shape({
    id: yup.number().required(),
  }),
  createUserDto: yup.object().when("createAccount", {
    is: true,
    then: yup.object({
      email: yup
        .string()
        .email("Format d'e-mail invalide")
        .required("Email est obligatoire"),
      password: yup
        .string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères")
        .required("Le mot de passe est requis"),
    }),
    otherwise: yup.object().strip(),
  }),
  createAccount: yup.boolean().required(),
  profileImage: yup.mixed().when("createAccount", {
    is: true,
    then: yup.mixed(),
    otherwise: yup.mixed().strip(),
  }),
});

const defaultValues = {
  firstName: "",
  lastName: "",
  identification: "",
  dateOfBirth: new Date(),
  sex: "",
  parent: { id: "" },
  createAccount: false,
  createUserDto: {
    email: "",
    password: "",
  },
  profileImage: undefined,
};

const SidebarAddStudent = (props: SidebarAddStudentType) => {
  // ** Props  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { open, toggle } = props;

  const userData = useSelector((state: RootState) => state.users.data);

  const findUserDataById = (userId: number) => {
    return userData.find((user) => user.id === userId);
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>();
  const {
    reset,
    control,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const [isHovered, setIsHovered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const parentStore = useSelector((state: RootState) => state.parents);

  const createAccount = useWatch({
    control,
    name: "createAccount",
    defaultValue: false,
  });

  useEffect(() => {
    dispatch(fetchData() as any);
  }, []);

  const onSubmit = (data: CreateStudentDto) => {
    dispatch(addStudent(data) as any);
    toggle();
    reset();
  };

  useEffect(() => {
    dispatch(fetchStudents() as any);
  }, []);
  const handleClose = () => {
    toggle();
    reset();
  };

  const renderListItem = (
    props: HTMLAttributes<HTMLLIElement>,
    option: ParentsType
  ) => {
    const user = findUserDataById(option.userId);
    if (user?.disabled === false || option.userId === null) {
      return (
        <ListItem key={option.id} sx={{ cursor: "pointer" }} {...props}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {option.userId ? (
              <Avatar
                alt={`Profile Image of ${option.firstName} ${option.lastName}`}
                src={`${HOST}/uploads/${user?.profileImage}`}
                sx={{ width: 30, height: 30, marginRight: "10px" }}
              />
            ) : (
              <CustomAvatar
                skin="light"
                color="primary"
                sx={{ mr: 3, width: 22, height: 22, fontSize: ".75rem" }}
              >
                {getInitials(`${option.firstName} ${option.lastName}`)}
              </CustomAvatar>
            )}

            <Typography sx={{ fontSize: "0.875rem" }}>
              {option.firstName} {option.lastName}
            </Typography>
          </Box>
        </ListItem>
      );
    }
  };

  useEffect(() => {
    const firstName = watch("firstName");
    const lastName = watch("lastName");

    const email = `${firstName}.${lastName}@gmail.com`;
    setValue("createUserDto.email", email);

    if (!firstName && !lastName) {
      setValue("createUserDto.email", "");
    }
  }, [watch("firstName"), watch("lastName")]);

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant="h6">Ajouter Élèves</Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ color: "text.primary" }}
        >
          <Icon icon="mdi:close" fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit as any)}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Prénom"
                  onChange={onChange}
                  placeholder="John"
                  error={Boolean(errors.firstName)}
                />
              )}
            />
            {errors.firstName && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.firstName.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="lastName"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Nom"
                  onChange={onChange}
                  placeholder="Doe"
                  error={Boolean(errors.lastName)}
                />
              )}
            />
            {errors.lastName && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.lastName.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="identification"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="CNE"
                  onChange={onChange}
                  placeholder="Doe"
                  error={Boolean(errors.identification)}
                />
              )}
            />
            {errors.identification && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.identification.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="dateOfBirth"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type="date"
                  value={value}
                  onChange={onChange}
                  label="Date de naissance"
                  error={Boolean(errors.dateOfBirth)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
            {errors.dateOfBirth && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.dateOfBirth.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel htmlFor="sexe">sex</InputLabel>
            <Controller
              name="sex"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  id="sex"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  label="Sexe"
                  error={Boolean(errors.sex)}
                >
                  <MenuItem value="mâle">Masculin</MenuItem>
                  <MenuItem value="femelle">Féminin</MenuItem>
                  {/* Add other options if needed */}
                </Select>
              )}
            />
            {errors.sex && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.sex.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="parent.id"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  id="parent-user-autocomplete"
                  options={parentStore.data}
                  getOptionLabel={(option) =>
                    `${option.firstName} ${option.lastName}`
                  }
                  value={
                    parentStore.data.find(
                      (user) => user.id === Number(value)
                    ) || null
                  }
                  onChange={(e, newValue) => {
                    const newValueId = newValue ? newValue.id : null;
                    onChange(newValueId);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Parent"
                      error={Boolean(errors.parent)}
                      helperText={errors.parent ? errors.parent.message : ""}
                    />
                  )}
                  renderOption={(props, option) =>
                    renderListItem(props, option)
                  }
                />
              )}
            />
          </FormControl>

          <FormControlLabel
            control={
              <Controller
                name="createAccount"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox checked={value} onChange={onChange} />
                )}
              />
            }
            label="Créer un compte"
          />

          {/***************** START CREATE ACCOUNT **********************/}
          {getValues("createAccount") && (
            <>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name="createUserDto.email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label="Email"
                      onChange={onChange}
                      placeholder="john.doe@example.com"
                      error={Boolean(errors.createUserDto?.email)}
                    />
                  )}
                />
                {errors.createUserDto?.email && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.createUserDto.email.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name="createUserDto.password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type={showPassword ? "text" : "password"}
                      value={value}
                      label="Mot de passe"
                      onChange={onChange}
                      placeholder="********"
                      error={Boolean(errors.password)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon
                                icon={
                                  showPassword
                                    ? "mdi:eye-outline"
                                    : "mdi:eye-off-outline"
                                }
                                fontSize={20}
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                {errors.createUserDto?.password && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.createUserDto.password.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl
                fullWidth
                sx={{
                  mb: 6,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Controller
                  name="profileImage"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <Avatar
                        src={value ? URL.createObjectURL(value) : ""}
                        alt="User Image"
                        sx={{
                          width: 100,
                          height: 100,
                          mr: 3,
                          cursor: "pointer",
                          border: isHovered
                            ? "2px solid #72de95"
                            : "2px solid transparent",
                          transition: "border 0.3s ease",
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      />
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={(e) => {
                          if (e.target.files) {
                            return onChange(e.target.files[0]);
                          }
                          return onChange(null);
                        }}
                      />
                    </>
                  )}
                />
              </FormControl>
            </>
          )}
          {/**************  END CREATE ACCOUNT ***************/}

          <Box sx={{ display: "flex", alignItems: "center" }} mt={5}>
            <Button
              size="large"
              type="submit"
              variant="contained"
              sx={{
                mr: 3,
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              Soumettre
            </Button>
            <Button
              size="large"
              variant="outlined"
              color="secondary"
              sx={{ display: "flex", alignItems: "center", width: "100%" }}
              onClick={handleClose}
            >
              Annuler
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default SidebarAddStudent;
