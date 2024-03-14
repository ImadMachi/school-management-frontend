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
import { addCycle, deleteCycle, editCycle } from "src/store/apps/cycles";
import { CycleType } from "src/types/apps/cycleTypes";
import { LevelType } from "src/types/apps/levelTypes";

interface SidebarAddCycleType {
  open: boolean;
  toggle: () => void;
  cycleToEdit: CycleType | null;
}

export interface CreateLevelDto {
  name: string;
  schoolYear: string;
  levels: number;
}

type SelectType = LevelType;

const defaultValues = {
  name: "",
  schoolYear: "",
  levels: [] as LevelType[],
 
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
  name: yup.string().required("Nom de cycle est requis"),
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

  classes: yup.array().min(1, "Au moins un classe est requis"),
});

const SidebarAddCycle = (props: SidebarAddCycleType) => {
  // ** Props
  const { open, toggle } = props;

  // ** HooksSidebarAddClass
  const dispatch = useDispatch<AppDispatch>();

  // ** Store

  const levelStore = useSelector((state: RootState) => state.levels);

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
    if (props.cycleToEdit) {
      setValue("name", props.cycleToEdit.name);
      setValue("schoolYear", props.cycleToEdit.schoolYear);
      setValue("levels", props.cycleToEdit.levels);
    }
  }, [props.cycleToEdit]);

  useEffect(() => {
    dispatch(fetchClasses() as any);
  }, []);

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      level: { id: data.level },
    };
    if (props.cycleToEdit) {
      dispatch(editCycle({ ...payload, id: props.cycleToEdit.id }) as any);
    } else {
      dispatch(addCycle(payload) as any);
    }
    toggle();
    reset();
  };

  const handleClose = () => {
    toggle();
    reset();
  };

  const handleDeleteLevel = () => {
    if (props.cycleToEdit) {
      dispatch(deleteCycle(props.cycleToEdit.id) as any);
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
          <Typography sx={{ fontSize: "0.875rem" }}>
            {option.name}
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
        label={`${item.name}`}
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
        `${option.name}`
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
          {!!props.cycleToEdit ? "Modifier" : "Ajouter"} Cycle
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
                  label="Nom de cycle"
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
              name="levels"
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
                  options={levelStore.data}
                  ListboxComponent={List}
                  //@ts-ignore
                  filterOptions={(options, params) =>
                    filterOptions(options, params, value)
                  }
                  getOptionLabel={(option) =>
                    `${(option as SelectType).name}`
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
                    <TextField {...params} label="Cycle" />
                  )}
                />
              )}
            />
            {errors.levels && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.levels.message}
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
            {!!props.cycleToEdit && (
              <Button
                size="large"
                variant="outlined"
                color="error"
                onClick={handleDeleteLevel}
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

export default SidebarAddCycle;
