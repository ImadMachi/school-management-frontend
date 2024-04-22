// ** React Imports
import { ChangeEvent, useEffect, useRef, useState } from "react";

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

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller, useWatch } from "react-hook-form";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Store Imports
import { useDispatch } from "react-redux";

// ** Types Imports
import { AppDispatch } from "src/store";
import {
  Avatar,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { addStudent } from "src/store/apps/students";
import { on } from "events";

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
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const [isHovered, setIsHovered] = useState(false);

  const createAccount = useWatch({
    control,
    name: "createAccount",
    defaultValue: false,
  });

  const onSubmit = (data: CreateStudentDto) => {
    dispatch(addStudent(data) as any);
    toggle();
    reset();
  };

  const handleClose = () => {
    toggle();
    reset();
  };

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
        <form onSubmit={handleSubmit(onSubmit)}>
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
                  label="Identifient"
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
                      type="password"
                      value={value}
                      label="Mot de passe"
                      onChange={onChange}
                      placeholder="********"
                      error={Boolean(errors.createUserDto?.password)}
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
