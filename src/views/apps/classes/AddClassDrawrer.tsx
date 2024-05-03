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
  Avatar,
  Checkbox,
  Chip,
  FormControlLabel,
  Input,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
} from "@mui/material";
import { useSelector } from "react-redux";
import { fetchData as fetchAdministrators } from "src/store/apps/administrator";
import { fetchData as fetchTeachers } from "src/store/apps/teachers";
import { fetchData as fetchStudents } from "src/store/apps/students";
import { fetchData as fetchLevels } from "src/store/apps/levels";

import { getInitials } from "src/@core/utils/get-initials";
import { addClass, deleteClass, editClass } from "src/store/apps/classes";
import { AdministratorType } from "src/types/apps/administratorTypes";
import { TeachersType } from "src/types/apps/teacherTypes";
import { StudentsType } from "src/types/apps/studentTypes";
import { ClassType } from "src/types/apps/classTypes";
import { LevelType } from "src/types/apps/levelTypes";
import { UserType } from "src/types/apps/UserType";
import { t } from "i18next";
import { HOST } from "src/store/constants/hostname";

interface SidebarAddClassType {
  open: boolean;
  toggle: () => void;
  classToEdit: ClassType | null;
}

export interface CreateClassDto {
  name: string;
  schoolYear: string;
  administrator: number;
  level: number;
}

type SelectType = AdministratorType | TeachersType | StudentsType;
type SelectTypeLevel = LevelType;

const defaultValues = {
  name: "",
  schoolYear: "",
  teachers: [] as TeachersType[],
  students: [] as StudentsType[],
  administrator: "",
  level: "",
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
  name: yup.string().required("Nom de la classe est requis"),
  schoolYear: yup
    .string()
    .required("Année scolaire est requise")
    .matches(
      /^[0-9]{4}-[0-9]{4}$/,
      "Année scolaire doit être au format 'YYYY-YYYY'"
    )
    .test(
      "is-valid",
      "Année fin doit être supérieure à l'année de début ",
      (value) => {
        if (value) {
          const [start, end] = value.split("-").map((v) => parseInt(v));
          return end - start == 1;
        }
        return false;
      }
    ),
  administrator: yup
    .number()
    .required("Administrateur est requis")
    .positive("Administrateur est requis")
    .integer("Administrateur est requis")
    .typeError("Administrateur est requis"),
  teachers: yup.array().min(1, "Au moins un enseignant est requis"),
  students: yup.array().min(1, "Au moins un élève est requis"),
  level: yup
    .number()
    .required("Niveau est requis")
    .positive("Niveau est requis")
    .integer("Niveau est requis")
    .typeError("Niveau est requis"),
});

const SidebarAddClass = (props: SidebarAddClassType) => {
  // ** Props
  const { open, toggle } = props;

  // ** HooksSidebarAddClass
  const dispatch = useDispatch<AppDispatch>();

  // ** Store
  const administratorStore = useSelector(
    (state: RootState) => state.administrator
  );
  const teacherStore = useSelector((state: RootState) => state.teachers);
  const studentStore = useSelector((state: RootState) => state.students);
  const levelStore = useSelector((state: RootState) => state.levels);

  const userData = useSelector((state: RootState) => state.users.data);

  const findUserDataById = (userId: number) => {
    return userData.find((user) => user.id === userId);
  };

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
    if (props.classToEdit) {
      setValue("name", props.classToEdit.name);
      setValue("schoolYear", props.classToEdit.schoolYear);
      setValue("administrator", `${props.classToEdit.administrator.id}`);
      setValue("teachers", props.classToEdit.teachers);
      setValue("students", props.classToEdit.students);
      console.log(props.classToEdit);

      setValue("level", `${props.classToEdit.level.id}`);
    }
  }, [props.classToEdit]);

  useEffect(() => {
    dispatch(fetchAdministrators() as any);
    dispatch(fetchTeachers() as any);
    dispatch(fetchStudents() as any);
    dispatch(fetchLevels() as any);
  }, []);

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      administrator: { id: data.administrator },
      level: { id: data.level },
    };
    if (props.classToEdit) {
      dispatch(editClass({ ...payload, id: props.classToEdit.id }) as any);
    } else {
      dispatch(addClass(payload) as any);
    }
    toggle();
    reset();
  };

  const handleClose = () => {
    toggle();
    reset();
  };

  const handleDeleteClass = () => {
    if (props.classToEdit) {
      dispatch(deleteClass(props.classToEdit.id) as any);
      toggle();
      reset();
    }
  };

  const renderUserListItem = (
    props: HTMLAttributes<HTMLLIElement>,
    option: SelectType,
    array: SelectType[],
    onChange: (...event: any[]) => void
  ) => {
    const user = findUserDataById(option.userId);
    return (
      <ListItem
        key={option.id}
        sx={{ cursor: "pointer" }}
        onClick={() => {
          onChange({ target: { value: [...array, option] } });
        }}
      >
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
  };

  const renderListItem = (
    props: HTMLAttributes<HTMLLIElement>,
    option: SelectType
  ) => {
    const user = findUserDataById(option.userId);
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
        label={`${item.firstName} ${item.lastName}`}
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
        `${option.firstName} ${option.lastName}`
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
          {!!props.classToEdit ? "Modifier" : "Ajouter"} Classe
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
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Nom de la classe"
                  onChange={onChange}
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.name.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="schoolYear"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Année scolaire"
                  onChange={onChange}
                  placeholder={`${new Date().getFullYear()}-${
                    new Date().getFullYear() + 1
                  }`}
                  error={Boolean(errors.schoolYear)}
                />
              )}
            />
            {errors.schoolYear && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.schoolYear.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="administrator"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  id="administrator-user-autocomplete"
                  options={administratorStore.data}
                  getOptionLabel={(option) =>
                    `${option.firstName} ${option.lastName}`
                  }
                  value={
                    value
                      ? administratorStore.data.find(
                          (user) => user.id === Number(value)
                        )
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
                      label="Administrator"
                      error={Boolean(errors.administrator)}
                      helperText={
                        errors.administrator ? errors.administrator.message : ""
                      }
                    />
                  )}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="teachers"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  multiple
                  freeSolo
                  value={value}
                  clearIcon={false}
                  id="teachers-select"
                  filterSelectedOptions
                  options={teacherStore.data}
                  ListboxComponent={List}
                  //@ts-ignore
                  filterOptions={(options, params) =>
                    filterOptions(options, params, value)
                  }
                  getOptionLabel={(option) =>
                    `${(option as SelectType).firstName} ${
                      (option as SelectType).lastName
                    }`
                  }
                  renderOption={(props, option) =>
                    renderUserListItem(props, option, value, onChange)
                  }
                  renderTags={(array: SelectType[], getTagProps) =>
                    renderCustomChips(array, getTagProps, value, onChange)
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": { p: 2 },
                    "& .MuiSelect-selectMenu": { minHeight: "auto" },
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Enseignants" />
                  )}
                />
              )}
            />
            {errors.teachers && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.teachers.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="students"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  multiple
                  freeSolo
                  value={value}
                  clearIcon={false}
                  id="students-select"
                  filterSelectedOptions
                  options={studentStore.data}
                  ListboxComponent={List}
                  //@ts-ignore
                  filterOptions={(options, params) =>
                    filterOptions(options, params, value)
                  }
                  getOptionLabel={(option) =>
                    `${(option as StudentsType).firstName} ${
                      (option as StudentsType).lastName
                    }`
                  }
                  renderOption={(props, option) =>
                    renderUserListItem(props, option, value, onChange)
                  }
                  renderTags={(array: StudentsType[], getTagProps) =>
                    renderCustomChips(array, getTagProps, value, onChange)
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": { p: 2 },
                    "& .MuiSelect-selectMenu": { minHeight: "auto" },
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Elèves" />
                  )}
                />
              )}
            />
            {errors.students && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.students.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="level"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <>
                  <InputLabel id="level-select-label">Niveau</InputLabel>
                  <Select
                    labelId="level-select-label"
                    id="level-select"
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.level)}
                    label={"Niveau"}
                    sx={{
                      "& .MuiOutlinedInput-root": { p: 2 },
                      "& .MuiSelect-selectMenu": { minHeight: "auto" },
                    }}
                  >
                    {levelStore.data.length > 0 &&
                      levelStore.data.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                  </Select>
                </>
              )}
            />
            {errors.level && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.level.message}
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
            {!!props.classToEdit && (
              <Button
                size="large"
                variant="outlined"
                color="error"
                onClick={handleDeleteClass}
                sx={{ mr: 3 }}
              >
                Supprimer
              </Button>
            )}
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

export default SidebarAddClass;
