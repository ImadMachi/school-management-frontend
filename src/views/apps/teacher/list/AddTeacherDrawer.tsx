// ** React Imports
import { ChangeEvent, useEffect, useRef, useState } from "react";

// ** MUI Imports
import Drawer from "@mui/material/Drawer";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
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

// ** Actions Imports
import { addTeacher } from "src/store/apps/teachers";

// ** Types Imports
import { AppDispatch } from "src/store";
import { Avatar, Checkbox, Chip, FormControlLabel } from "@mui/material";

interface SidebarAddTeacherType {
  open: boolean;
  toggle: () => void;
}

export interface CreateTeacherDto {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
  dateOfEmployment: Date;
  sex: string;
  createAccount: boolean;
  createUserDto?: {
    email: string;
    password: string;
  };
  profileImage?: File;
}

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`;
  } else {
    return "";
  }
};

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
  phoneNumber: yup.string().required(),
  dateOfBirth: yup.date().required(),
  dateOfEmployment: yup.date().required(),
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
  phoneNumber: "",
  dateOfBirth: new Date(),
  dateOfEmployment: new Date(),
  sex: "",
  createAccount: false,
  createUserDto: {
    email: "",
    password: "",
  },
  profileImage: undefined,
};

const SidebarAddTeacher = (props: SidebarAddTeacherType) => {
  // ** Props
  const { open, toggle } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>();
  const {
    reset,
    control,
    getValues,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
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

  const onSubmit = async (data: CreateTeacherDto) => {
    const result = await dispatch(addTeacher(data) as any);
    if (result.error) {
      return;
    }
    toggle();
    reset();
  };

  const handleClose = () => {
    toggle();
    reset();
  };

  useEffect(() => {
    const firstName = watch("firstName");
    const lastName = watch("lastName");

    const email = `${firstName}.${lastName}@arganier.com`;
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
        <Typography variant="h6">Ajouter Enseignant</Typography>
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
              name="phoneNumber"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Num Tel"
                  onChange={onChange}
                  placeholder="+212 612-345678"
                  error={Boolean(errors.phoneNumber)}
                />
              )}
            />
            {errors.phoneNumber && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.phoneNumber.message}
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
                  label="Date de Naissance"
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
            <Controller
              name="dateOfEmployment"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type="date"
                  value={value}
                  onChange={onChange}
                  label="Date d'embauche"
                  error={Boolean(errors.dateOfEmployment)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
            {errors.dateOfEmployment && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.dateOfEmployment.message}
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

export default SidebarAddTeacher;
