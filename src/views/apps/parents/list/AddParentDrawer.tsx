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
import { addParent } from "src/store/apps/parents";
// ** Types Imports
import { AppDispatch } from "src/store";
import { Avatar, Checkbox, Chip, FormControlLabel, InputAdornment } from "@mui/material";

interface SidebarAddParentType {
  open: boolean;
  toggle: () => void;
}

export interface CreateParentDto {
  fatherFirstName: string;
  fatherLastName: string;
  fatherPhoneNumber: string;
  motherFirstName: string;
  motherLastName: string;
  motherPhoneNumber: string;
  address: string;
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
  fatherFirstName: yup.string().min(3).required(),
  fatherLastName: yup.string().min(3).required(),
  fatherPhoneNumber: yup.string().required(),
  motherFirstName: yup.string().min(3).required(),
  motherLastName: yup.string().min(3).required(),
  motherPhoneNumber: yup.string().required(),
  address: yup.string().required(),
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
  fatherFirstName: "",
  fatherLastName: "",
  fatherPhoneNumber: "",
  motherFirstName: "",
  motherLastName: "",
  motherPhoneNumber: "",
  address: "",
  createAccount: false,
  createUserDto: {
    email: "",
    password: "",
  },
  profileImage: undefined,
};

const SidebarAddParent = (props: SidebarAddParentType) => {
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
    watch,
    setValue,
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const [isHovered, setIsHovered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const createAccount = useWatch({
    control,
    name: "createAccount",
    defaultValue: false,
  });

  const onSubmit = async (data: CreateParentDto) => {
    const result = await dispatch(addParent(data) as any);
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
    const firstName = watch("fatherFirstName");
    const lastName = watch("fatherLastName");

    const email = `${firstName}.${lastName}@arganier.com`;
    setValue("createUserDto.email", email);

    if (!firstName && !lastName) {
      setValue("createUserDto.email", "");
    }
  }, [watch("fatherFirstName"), watch("fatherLastName")]);

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
        <Typography variant="h6">Ajouter Parent</Typography>
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
              name="fatherFirstName"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Prénom du père"
                  onChange={onChange}
                  placeholder="John"
                  error={Boolean(errors.fatherFirstName)}
                />
              )}
            />
            {errors.fatherFirstName && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.fatherFirstName.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="fatherLastName"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Nom du père"
                  onChange={onChange}
                  placeholder="Doe"
                  error={Boolean(errors.fatherLastName)}
                />
              )}
            />
            {errors.fatherLastName && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.fatherLastName.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="fatherPhoneNumber"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Telephone du père"
                  onChange={onChange}
                  placeholder="+212 612-345678"
                  error={Boolean(errors.fatherPhoneNumber)}
                />
              )}
            />
            {errors.fatherPhoneNumber && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.fatherPhoneNumber.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="motherFirstName"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Prénom de la mère"
                  onChange={onChange}
                  placeholder="Jane"
                  error={Boolean(errors.motherFirstName)}
                />
              )}
            />
            {errors.motherFirstName && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.motherFirstName.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="motherLastName"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Nom de la mère"
                  onChange={onChange}
                  placeholder="Doe"
                  error={Boolean(errors.motherLastName)}
                />
              )}
            />
            {errors.motherLastName && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.motherLastName.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="motherPhoneNumber"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Telephone de la mère"
                  onChange={onChange}
                  placeholder="+212 612-345678"
                  error={Boolean(errors.motherPhoneNumber)}
                />
              )}
            />
            {errors.motherPhoneNumber && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.motherPhoneNumber.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="address"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  id="adress"
                  label="Adresse"
                  multiline
                  rows={4}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.address)}
                  helperText={errors.address ? errors.address.message : ""}
                  sx={{ "& .MuiOutlinedInput-root": { p: 2 } }}
                />
              )}
            />
            {errors.address && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.address.message}
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
                      type={showPassword ? "text" : "password"}
                      value={value}
                      label="Mot de passe"
                      onChange={onChange}
                      placeholder="********"
                      error={Boolean(errors.createUserDto?.password)}
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
                {/* <Controller
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
                /> */}
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

export default SidebarAddParent;