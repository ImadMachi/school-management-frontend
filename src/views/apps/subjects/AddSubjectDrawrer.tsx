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
import { fetchData as fetchClasses } from "src/store/apps/classes";
import { getInitials } from "src/@core/utils/get-initials";
import {
  addSubject,
  deleteSubject,
  editSubject,
  updateSubjectStatus,
} from "src/store/apps/subjects";
import { SubjectType } from "src/types/apps/subjectTypes";
import { ClassType } from "src/types/apps/classTypes";
import { TeachersType } from "src/types/apps/teacherTypes";
import { fetchData as fetchTeachers } from "src/store/apps/teachers";
import { fetchData } from "src/store/apps/users";
import { HOST } from "src/store/constants/hostname";

interface SidebarAddSubjectType {
  open: boolean;
  toggle: () => void;
  subjectToEdit: SubjectType | null;
}

export interface CreateSubjectDto {
  name: string;
  classes: number;
  teachers: number;
}

type SelectType = ClassType | TeachersType;

const defaultValues = {
  name: "",
  classes: [] as ClassType[],
  teachers: [] as TeachersType[],
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
  name: yup.string().required("Nom de matère est requis"),
  // classes: yup.array().min(1, "Au moins un classe est requis"),
  teachers: yup.array().min(1, "Au moins un enseignant est requis"),
});

const SidebarAddSubject = (props: SidebarAddSubjectType) => {
  // ** Props
  const { open, toggle } = props;

  // ** HooksSidebarAddClass
  const dispatch = useDispatch<AppDispatch>();

  // ** Store

  const classStore = useSelector((state: RootState) => state.classes);
  const teacherStore = useSelector((state: RootState) => state.teachers);

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
    if (props.subjectToEdit) {
      setValue("name", props.subjectToEdit.name);
      // setValue("classes", props.subjectToEdit.classes);
      setValue("teachers", props.subjectToEdit.teachers);
    }
    return () => {
      reset();
    };
  }, [props.open]);

  useEffect(() => {
    //dispatch(fetchClasses() as any);
    dispatch(fetchTeachers() as any);
    dispatch(fetchData() as any);
  }, []);

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
    };
    if (props.subjectToEdit) {
      dispatch(editSubject({ ...payload, id: props.subjectToEdit.id }) as any);
    } else {
      dispatch(addSubject(payload) as any);
    }
    toggle();
    reset();
  };

  const handleClose = () => {
    toggle();
    reset();
  };

  const handleDeleteSubject = () => {
    if (props.subjectToEdit) {
     // dispatch(deleteSubject(props.subjectToEdit.id) as any);
      dispatch(updateSubjectStatus({ id: props.subjectToEdit.id, disabled: true }) as any);
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
    let name: string;

    // Check if the option is of type TeacherType
    if ("firstName" in option && "lastName" in option) {
      name = `${option.firstName} ${option.lastName}`;
    } else {
      // Otherwise, assume it's of type ClassType and use its 'name' property
      name = option.name;
    }

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
            {getInitials(name)}
          </CustomAvatar>
          <Typography sx={{ fontSize: "0.875rem" }}>{name}</Typography>
        </Box>
      </ListItem>
    );
  };

  const renderClasseListItem = (
    props: HTMLAttributes<HTMLLIElement>,
    option: ClassType,
    array: ClassType[],
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
            {getInitials(`${option.name}`)}
          </CustomAvatar>
          <Typography sx={{ fontSize: "0.875rem" }}>{option.name}</Typography>
        </Box>
      </ListItem>
    );
  };

  const renderTeacherListItem = (
    props: HTMLAttributes<HTMLLIElement>,
    option: TeachersType,
    array: TeachersType[],
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
          <Typography sx={{ fontSize: "0.875rem" }}>{option.firstName} {option.lastName}</Typography>
        </Box>
      </ListItem>
    );
  };
  // const renderTeacherListItem = (
  //   props: HTMLAttributes<HTMLLIElement>,
  //   option: TeachersType,
  //   array: TeachersType[],
  //   onChange: (...event: any[]) => void
  // ) => {
  //   const user = findUserDataById(option.userId);

  //   if (option?.userId) {
  //     return (
  //       <ListItem key={option.id} sx={{ cursor: "pointer" }} {...props}>
  //         <Box sx={{ display: "flex", alignItems: "center" }}>
  //           {option.userId ? (
  //             <Avatar
  //               alt={`Profile Image of ${option.firstName} ${option.lastName}`}
  //               src={`${HOST}/uploads/${user?.profileImage}`}
  //               sx={{ width: 30, height: 30, marginRight: "10px" }}
  //             />
  //           ) : (
  //             <CustomAvatar
  //               skin="light"
  //               color="primary"
  //               sx={{ mr: 3, width: 22, height: 22, fontSize: ".75rem" }}
  //             >
  //               {getInitials(`${option.firstName} ${option.lastName}`)}
  //             </CustomAvatar>
  //           )}

  //           <Typography sx={{ fontSize: "0.875rem" }}>
  //             {option.firstName} {option.lastName}
  //           </Typography>
  //         </Box>
  //       </ListItem>
  //     );
  //   }
  // };

  const renderCustomChips = (
    array: SelectType[],
    getTagProps: ({ index }: { index: number }) => {},
    state: SelectType[],
    onChange: (...event: any[]) => void
  ) => {
    return state.map((item, index) => {
      let label: string;

      if ("firstName" in item && "lastName" in item) {
        label = `${item.firstName} ${item.lastName}`;
      } else {
        label = item.name;
      }

      return (
        <Chip
          size="small"
          key={item.id}
          label={label}
          {...(getTagProps({ index }) as {})}
          deleteIcon={<Icon icon="mdi:close" />}
          //@ts-ignore
          onDelete={() => handleDeleteChipItem(item.id, state, onChange)}
        />
      );
    });
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
      .filter(
        (option) =>
          ("name" in option &&
            `${option.name}`
              .toLowerCase()
              .includes(inputValue.toLowerCase())) ||
          ("firstName" in option &&
            "lastName" in option &&
            `${option.firstName} ${option.lastName}`
              .toLowerCase()
              .includes(inputValue.toLowerCase()))
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
          {!!props.subjectToEdit ? "Modifier" : "Ajouter"} Matière
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
                  label="Nom de matière"
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
          {/* <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="classes"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  multiple
                  freeSolo
                  value={value}
                  clearIcon={false}
                  id="classes-select"
                  filterSelectedOptions
                  options={classStore.data}
                  ListboxComponent={List}
                  //@ts-ignore
                  filterOptions={(options, params) =>
                    filterOptions(options, params, value)
                  }
                  getOptionLabel={(option) => {
                    if (typeof option === "string") {
                      return "";
                    } else {
                      return option.name; // Return the name property for ClassType
                    }
                  }}
                  renderOption={(props, option) =>
                    renderClasseListItem(props, option, value, onChange)
                  }
                  renderTags={(array: SelectType[], getTagProps) =>
                    renderCustomChips(array, getTagProps, value, onChange)
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": { p: 2 },
                    "& .MuiSelect-selectMenu": { minHeight: "auto" },
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Classes" />
                  )}
                />
              )}
            />
            {errors.classes && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.classes.message}
              </FormHelperText>
            )}
          </FormControl> */}

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
                  getOptionLabel={(option) => {
                    if (typeof option === "string") {
                      return "";
                    } else if ("firstName" in option && "lastName" in option) {
                      return `${option.firstName} ${option.lastName}`;
                    }
                    return "";
                  }}
                  renderOption={(props, option) =>
                    renderTeacherListItem(props, option, value, onChange)
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

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              size="large"
              type="submit"
              variant="contained"
              sx={{ mr: 3 }}
            >
              Soumettre
            </Button>
            {!!props.subjectToEdit && (
              <Button
                size="large"
                variant="outlined"
                color="error"
                onClick={handleDeleteSubject}
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

export default SidebarAddSubject;
