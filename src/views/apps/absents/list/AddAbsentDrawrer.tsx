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
import {
  Autocomplete,
  Checkbox,
  Chip,
  FormControlLabel,
  FormLabel,
  Input,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import { useSelector } from "react-redux";
import { fetchData as fetchUsers } from "src/store/apps/users";
import { fetchData as fetchAbsents } from "src/store/apps/absents";
import { getInitials } from "src/@core/utils/get-initials";
import { AbsentsType } from "src/types/apps/absentsTypes";
import { UserType } from "src/types/apps/UserType";
import {
  addAbsent,
  deleteAbsent,
  fetchAbsent,
  updateAbsent,
} from "src/store/apps/absents";
import { RadioButtonChecked } from "@mui/icons-material";

interface SidebarAddAbsentType {
  open: boolean;
  toggle: () => void;
  absentToEdit: AbsentsType | null;
}

export interface CreateAbsentDto {
  absentUser: number;
  datedebut: Date;
  datefin: Date;
  reason: string;
  justified: boolean;
  replaceUser: UserType[];
  seance: string;
  title: string;
  body: string;
  status: string;
}

type SelectType = UserType;

const defaultValues = {
  absentUser: "",
  datedebut: "",
  datefin: "",
  reason: "",
  justified: false,
  replaceUser: [] as UserType[],
  seance: "",
  title: "",
  body: "",
  status: "non traiter",
};

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const schema = yup.object().shape({
  id: yup.number(),
  absentUser: yup
    .number()
    .required("Absent est requis")
    .positive("Absent est requis")
    .integer("Absent est requis")
    .typeError("Absent est requis"),
  datedebut: yup
    .string()
    .required("Date de début est requis")
    .typeError("Date de début est requis"),
  datefin: yup
    .string()
    .required("Date de fin est requis")
    .typeError("Date de fin est requis"),
  reason: yup
    .string()
    .required("Raison est requis")
    .typeError("Raison est requis"),
  justified: yup.boolean().required("Justifié est requis"),
  replaceUser: yup.array(),
  seance: yup.string(),
  title: yup.string(),
  body: yup.string(),
  status: yup.string(),
});

const SidebarAddAbsent = (props: SidebarAddAbsentType) => {
  // ** Props
  const { open, toggle } = props;

  const dispatch = useDispatch<AppDispatch>();
  const seanceOptions = [
    "Seance 1",
    "Seance 2",
    "Seance 3",
    "Seance 4",
    "Seance 5",
    "Seance 6",
    "Seance 7",
    "Tout la journée"
  ];

  // ** Store
  const userStore = useSelector((state: RootState) => state.users);
  const absentStore = useSelector((state: RootState) => state.absents);

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
    if (props.absentToEdit) {
      setValue("absentUser", `${props.absentToEdit.absentUser.id}`);
      setValue("datedebut", props.absentToEdit.datedebut.toISOString());
      setValue("datefin", props.absentToEdit.datefin.toISOString());
      setValue("reason", props.absentToEdit.reason);
      setValue("justified", props.absentToEdit.justified);
      setValue("replaceUser", props.absentToEdit.replaceUser);
      setValue("seance", props.absentToEdit.seance);
      setValue("title", props.absentToEdit.title);
      setValue("body", props.absentToEdit.body);
      setValue("status", "non traiter");
    }
  }, [props.absentToEdit]);

  useEffect(() => {
    dispatch(fetchUsers() as any);
  }, []);

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      absentUser: { id: data.absentUser },
    };

    dispatch(addAbsent(payload) as any);

    toggle();
    reset();
  };

  const handleClose = () => {
    toggle();
    reset();
  };

  const renderUserListItem = (
    props: HTMLAttributes<HTMLLIElement>,
    option: SelectType,
    array: SelectType[],
    onChange: (...event: any[]) => void
  ) => {
    return (
      <ListItem
        key={option.id}
        sx={{ cursor: "pointer" }}
        onClick={() => {
          onChange({ target: { value: [...array, option] } });
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CustomAvatar
            skin="light"
            color="primary"
            sx={{ mr: 3, width: 22, height: 22, fontSize: ".75rem" }}
          >
            {getInitials(
              `${option.userData?.firstName} ${option.userData?.lastName}`
            )}
          </CustomAvatar>
          <Typography sx={{ fontSize: "0.875rem" }}>
            {option.userData?.firstName} {option.userData?.lastName}
          </Typography>
        </Box>
      </ListItem>
    );
  };

  const renderCustomChips = (
    array: SelectType[],
    getTagProps: ({ index }: { index: number }) => {},
    state: SelectType[],
    onChange: (...event: any[]) => void
  ) => {
    return state.map((item, index) => (
      <Chip
        size="small"
        key={item.id}
        label={`${item.userData?.firstName} ${item.userData?.lastName}`}
        {...(getTagProps({ index }) as {})}
        deleteIcon={<Icon icon="mdi:close" />}
        //@ts-ignore
        onDelete={() => handleDeleteChipItem(item.id, state, onChange)}
      />
    ));
  };

  const handleDeleteChipItem = (
    value: number,
    state: SelectType[],
    setState: (val: SelectType[]) => void
  ) => {
    const arr = state;
    const index = arr.findIndex((i) => i.id === value);
    arr.splice(index, 1);
    setState([...arr]);
  };

  const filterOptions = (
    options: SelectType[],
    params: any,
    value: SelectType[]
  ): SelectType[] => {
    const { inputValue } = params;

    const filteredOptions = options
      .filter((option) =>
        `${option.userData?.firstName} ${option.userData?.firstName}`
          .toLowerCase()
          .includes(inputValue.toLowerCase())
      )
      .filter((option) => !value.find((item) => item.id === option.id));

    // @ts-ignore
    return filteredOptions;
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
        <Typography variant="h6">
          {!!props.absentToEdit ? "Modifier" : "Ajouter"} Absent
        </Typography>
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
                      !absentStore.data.some(
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
          <FormControl fullWidth sx={{ mb: 6 }}>
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="datedebut"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  id="datedebut"
                  label="Date de début"
                  type="datetime-local"
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.datedebut)}
                  helperText={errors.datedebut ? errors.datedebut.message : ""}
                  InputLabelProps={{ shrink: true }}
                  sx={{ "& .MuiOutlinedInput-root": { p: 2 } }}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="datefin"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  id="datefin"
                  label="Date de fin"
                  type="datetime-local"
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.datefin)}
                  helperText={errors.datefin ? errors.datefin.message : ""}
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
          <FormControl component="fieldset" fullWidth sx={{ mb: 6 }}>
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
          </FormControl>
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

export default SidebarAddAbsent;
