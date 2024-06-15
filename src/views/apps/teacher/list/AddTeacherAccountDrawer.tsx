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
import { addTeacherAccount } from "src/store/apps/teachers";
// ** Types Imports
import { AppDispatch, RootState } from "src/store";
import { Avatar, Checkbox, Chip, FormControlLabel, InputAdornment } from "@mui/material";
import { useSelector } from "react-redux";

interface SidebarUpdateTeacherType {
  id: number;
  open: boolean;
  toggle: () => void;
}

export interface CreateTeacherAccountDto {
  email: string;
  password: string;
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
  email: yup
    .string()
    .email("Format d'e-mail invalide")
    .required("Email est obligatoire"),
  password: yup
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .required("Le mot de passe est requis"),

  profileImage: yup.mixed(),
});

const defaultValues = {
  email: "",
  password: "",
  profileImage: undefined,
};

const SidebarAddTeacherAccount = (props: SidebarUpdateTeacherType) => {
  // ** Props
  const { id, open, toggle } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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
  const [showPassword, setShowPassword] = useState(false);
  const teacher = useSelector ((state: RootState) => state.teachers.data.find((teacher) => teacher.id === id));

  const onSubmit = async (data: CreateTeacherAccountDto) => {
    const result = await dispatch(addTeacherAccount({ id, data }) as any);
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
  const handleAttachmentButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const uniqueNewFiles = newFiles.filter((newFile) =>
        selectedFiles.every(
          (existingFile) => existingFile.name !== newFile.name
        )
      );
      setSelectedFiles((prevFiles) => [...prevFiles, ...uniqueNewFiles]);
    }
  };

  const handleDeleteSelectedFile = (fileName: string) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  useEffect(() => {
    if (teacher) {
      const { firstName, lastName } = teacher;
      const formattedFirstName = firstName.replace(/\s+/g, ".");
      const formattedLastName = lastName.replace(/\s+/g, ".");
      const email = `${formattedFirstName}.${formattedLastName}@arganier.com`;
      setValue("email", email);
    }
  }, [teacher, setValue]);

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
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Email"
                  onChange={onChange}
                  placeholder="john.doe@example.com"
                  error={Boolean(errors.email)}
                />
              )}
            />
            {errors.email && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.email.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="password"
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
            {errors.password && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.password.message}
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

export default SidebarAddTeacherAccount;
