// ** React Imports
import { HTMLAttributes, useEffect, useState } from "react";

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
import { useDispatch } from "react-redux";

// ** Types Imports
import { AppDispatch, RootState } from "src/store";
import { Autocomplete, Avatar, Chip, ListItem } from "@mui/material";
import { useSelector } from "react-redux";
import { fetchData as fetchUsers } from "src/store/apps/users";
import { addAbsence, fetchData as fetchAbsents } from "src/store/apps/absences";
import { getInitials } from "src/@core/utils/get-initials";
import { AddAbsenceType } from "src/types/apps/absenceTypes";
import { UserType } from "src/types/apps/UserType";
import { HOST } from "src/store/constants/hostname";

type SelectType = UserType;

const defaultValues: AddAbsenceType = {
  startDate: "",
  endDate: "",
  reason: "",
  absentUser: "",
};

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const schema = yup.object().shape({
  absentUser: yup
    .number()
    .required("Absent est requis")
    .typeError("Absent est requis"),
  startDate: yup.string().required("Date de début est requis"),
  endDate: yup.string().required("Date de fin est requis"),
  reason: yup.string().required("Raison est requis"),
});

type ToUserType = UserType;

interface AddAbsenceDrawerProps {
  open: boolean;
  toggle: () => void;
}
const AddAbsenceDrawer = (props: AddAbsenceDrawerProps) => {
  // ** Props
  const { open, toggle } = props;

  const dispatch = useDispatch<AppDispatch>();

  // ** Store
  const userStore = useSelector((state: RootState) => state.users);
  const absenceStore = useSelector((state: RootState) => state.absences);

  const {
    reset,
    control,
    getValues,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    dispatch(fetchUsers() as any);
  }, []);

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      absentUser: { id: data.absentUser },
    };

    dispatch(addAbsence(payload) as any);

    toggle();
    reset();
  };

  const handleClose = () => {
    toggle();
    reset();
  };

  const renderListItem = (
    props: HTMLAttributes<HTMLLIElement>,
    option: ToUserType
  ) => {
    return (
      <ListItem key={option.id} sx={{ cursor: "pointer" }} {...props}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {option.profileImage ? (
            <Avatar
              alt={`Profile Image of ${option.userData?.firstName} ${option.userData?.lastName}`}
              src={`${HOST}/uploads/${option.profileImage}`}
              sx={{ width: 30, height: 30, marginRight: "10px" }}
            />
          ) : (
            <CustomAvatar
              skin="light"
              color="primary"
              sx={{ mr: 3, width: 22, height: 22, fontSize: ".75rem" }}
            >
              {getInitials(
                `${option.userData?.firstName} ${option.userData?.lastName}`
              )}
            </CustomAvatar>
          )}

          <Typography sx={{ fontSize: "0.875rem" }}>
            {option.userData.firstName} {option.userData.lastName}
          </Typography>
        </Box>
      </ListItem>
    );
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
        <Typography variant="h6">Ajouter une absence</Typography>
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
              name="absentUser"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  id="absent-user-autocomplete"
                  options={userStore.data.filter(
                    (option) =>
                      !absenceStore.data.some(
                        (absent) => absent.absentUser.id === option.id
                      )
                  )}
                  getOptionLabel={(option) =>
                    `${option.userData?.firstName} ${option.userData?.lastName}`
                  }
                  value={
                    value
                      ? userStore.data.find((user) => user.id === Number(value))
                      : null
                  }
                  onChange={(event, newValue) => {
                    onChange(newValue?.id || null);
                  }}
                  renderOption={(props, option) =>
                    renderListItem(props, option)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Absent"
                      error={Boolean(errors.absentUser)}
                      helperText={
                        errors.absentUser ? errors.absentUser.message : ""
                      }
                    />
                  )}
                />
              )}
            />
          </FormControl>

          {/* <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id="seance-select-label">Séance</InputLabel>
            <Controller
              name="seance"
              control={control}
              defaultValue=""
              render={({ field: { value, onChange } }) => (
                <Select
                  labelId="seance-select-label"
                  id="seance-select"
                  value={value}
                  onChange={onChange}
                  label="Séance"
                  sx={{ "& .MuiOutlinedInput-root": { p: 2 } }}
                >
                  {seanceOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl> */}
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="startDate"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  id="startDate"
                  label="Date de début"
                  type="date"
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.startDate)}
                  helperText={errors.startDate ? errors.startDate.message : ""}
                  InputLabelProps={{ shrink: true }}
                  sx={{ "& .MuiOutlinedInput-root": { p: 2 } }}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="endDate"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  id="endDate"
                  label="Date de fin"
                  type="date"
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.endDate)}
                  helperText={errors.endDate ? errors.endDate.message : ""}
                  InputLabelProps={{ shrink: true }}
                  sx={{ "& .MuiOutlinedInput-root": { p: 2 } }}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="reason"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  id="reason"
                  label="Raison"
                  multiline
                  rows={4}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.reason)}
                  helperText={errors.reason ? errors.reason.message : ""}
                  sx={{ "& .MuiOutlinedInput-root": { p: 2 } }}
                />
              )}
            />
          </FormControl>
          {/* <FormControl component="fieldset" fullWidth sx={{ mb: 6 }}>
            <FormLabel component="legend">Justifié</FormLabel>
            <Controller
              name="justified"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <RadioGroup
                  value={value ? "true" : "false"}
                  onChange={(e) => onChange(e.target.value === "true")}
                  row
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Oui"
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="Non"
                  />
                </RadioGroup>
              )}
            />
            {errors.justified && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.justified.message}
              </FormHelperText>
            )}
          </FormControl> */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              size="large"
              type="submit"
              variant="contained"
              sx={{ mr: 3 }}
            >
              Soumettre
            </Button>
            <Button
              size="large"
              variant="outlined"
              color="secondary"
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

export default AddAbsenceDrawer;
