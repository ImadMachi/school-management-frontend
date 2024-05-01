// ** React Imports
import { useEffect } from "react";

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
import { useForm, Controller } from "react-hook-form";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Store Imports
import { useDispatch } from "react-redux";

// ** Types Imports
import { AppDispatch } from "src/store";

import { addCycle, deleteCycle, editCycle } from "src/store/apps/cycles";
import { CycleType } from "src/types/apps/cycleTypes";

interface SidebarAddCycleType {
  open: boolean;
  toggle: () => void;
  cycleToEdit: CycleType | null;
}

export interface CreateLevelDto {
  name: string;
}

const defaultValues = {
  name: "",
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
});

const SidebarAddCycle = (props: SidebarAddCycleType) => {
  // ** Props
  const { open, toggle } = props;

  // ** HooksSidebarAddClass
  const dispatch = useDispatch<AppDispatch>();

  // ** Store

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
    }
    return () => {
      reset();
    };
  }, [props.open]);

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
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
