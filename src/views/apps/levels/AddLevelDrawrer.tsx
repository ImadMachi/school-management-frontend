// ** React Imports
import { HTMLAttributes, useEffect } from "react";

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
import { useForm, Controller } from "react-hook-form";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Store Imports
import { useDispatch } from "react-redux";

// ** Types Imports
import { AppDispatch, RootState } from "src/store";
import { Autocomplete, Chip, List, ListItem } from "@mui/material";
import { useSelector } from "react-redux";
import cycles, { fetchData as fetchCycles } from "src/store/apps/cycles";
import { getInitials } from "src/@core/utils/get-initials";
import { addLevel, deleteLevel, editLevel, updateLevelStatus } from "src/store/apps/levels";
import { LevelType } from "src/types/apps/levelTypes";
import { ClassType } from "src/types/apps/classTypes";
import { CycleType } from "src/types/apps/cycleTypes";

interface SidebarAddLevelType {
  open: boolean;
  toggle: () => void;
  levelToEdit: LevelType | null;
}

export interface CreateLevelDto {
  name: string;
  cycle: number;
}

const defaultValues = {
  name: "",
  cycle: "",
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
  name: yup.string().required("Nom de niveau est requis"),
  cycle: yup.number().required("Cycle est requis"),
});

const SidebarAddLevel = (props: SidebarAddLevelType) => {
  // ** Props
  const { open, toggle } = props;

  // ** HooksSidebarAddClass
  const dispatch = useDispatch<AppDispatch>();

  // ** Store

  const cycleStore = useSelector((state: RootState) => state.cycles);

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
    if (props.levelToEdit) {
      setValue("name", props.levelToEdit.name);
      setValue("cycle", props.levelToEdit.cycle.id.toString());
    }
    return () => {
      reset();
    };
  }, [props.open]);

  useEffect(() => {
    dispatch(fetchCycles() as any);
  }, []);

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      cycle: { id: data.cycle },
    };

    if (props.levelToEdit) {
      dispatch(editLevel({ ...payload, id: props.levelToEdit.id }) as any);
    } else {
      dispatch(addLevel(payload) as any);
    }
    toggle();
    reset();
  };

  const handleClose = () => {
    toggle();
    reset();
  };

  const handleDeleteLevel = () => {
    if (props.levelToEdit) {
      // dispatch(deleteLevel(props.levelToEdit.id) as any);
      dispatch(updateLevelStatus({ id: props.levelToEdit.id, disabled: true }) as any);
      toggle();
      reset();
    }
  };

  const renderListItem = (
    props: HTMLAttributes<HTMLLIElement>,
    option: CycleType
  ) => {
    return (
      <ListItem key={option.id} sx={{ cursor: "pointer" }} {...props}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ fontSize: "0.875rem" }}>{option.name}</Typography>
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
        <Typography variant="h6">
          {!!props.levelToEdit ? "Modifier" : "Ajouter"} Niveau
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
                  label="Nom de niveau"
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
              name="cycle"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  id="cycle-autocomplete"
                  options={cycleStore.data}
                  getOptionLabel={(option) => `${option.name}`}
                  value={
                    value
                      ? cycleStore.data.find(
                          (cycle) => cycle.id === Number(value)
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
                      label="Cycle"
                      error={Boolean(errors.cycle)}
                      helperText={errors.cycle ? errors.cycle.message : ""}
                    />
                  )}
                />
              )}
            />
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
            {!!props.levelToEdit && (
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

export default SidebarAddLevel;
