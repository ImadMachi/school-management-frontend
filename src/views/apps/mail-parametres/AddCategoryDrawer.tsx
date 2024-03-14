// ** React Imports
import { useEffect, useRef } from "react";

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

import { CategoryType } from "src/types/apps/categoryTypes";
import { HOST } from "src/store/constants/hostname";
import { Avatar } from "@mui/material";
import {
  addCategory,
  deleteCategory,
  editCategory,
} from "src/store/apps/categories";

interface SidebarAddCategoryType {
  open: boolean;
  toggle: () => void;
  categoryToEdit: CategoryType | null;
  setCategoryToEdit: (category: CategoryType | null) => void;
}

export interface CreateCategoryDto {
  name: string;
  description: string;
  image: File | null;
}

const defaultValues: CreateCategoryDto = {
  name: "",
  description: "",
  image: null,
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
  name: yup
    .string()
    .required("Nom de la catégorie est requis")
    .min(3, "Nom de la catégorie doit avoir au moins 3 caractères"),
  description: yup.string(),
  image: yup.mixed().required("Image est requise"),
});

const AddCategoryDrawer = (props: SidebarAddCategoryType) => {
  // ** Props
  const { open, toggle } = props;

  // ** HooksSidebarAddClass
  const dispatch = useDispatch<AppDispatch>();

  // ** Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    (async () => {
      if (props.categoryToEdit) {
        setValue("name", props.categoryToEdit.name);
        setValue("description", props.categoryToEdit.description);

        const response = await fetch(
          `${HOST}/uploads/categories-images/${props.categoryToEdit.imagepath}`
        );
        const data = await response.blob();
        const file = new File([data], props.categoryToEdit.imagepath);

        setValue("image", file);
      }
    })();
  }, [props.open]);

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
    };

    if (props.categoryToEdit) {
      dispatch(
        editCategory({ ...payload, id: props.categoryToEdit.id }) as any
      );
    } else {
      dispatch(addCategory(payload) as any);
    }

    toggle();
    reset();
  };

  const handleClose = () => {
    toggle();
    reset();
  };

  const handleDeleteCategory = () => {
    if (props.categoryToEdit) {
      dispatch(deleteCategory(props.categoryToEdit.id) as any);
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
          {!!props.categoryToEdit ? "Modifier" : "Ajouter"} Catégorie
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
                  label="Nom de la catégorie"
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
              name="description"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Description de la catégorie"
                  onChange={onChange}
                  error={Boolean(errors.description)}
                />
              )}
            />
            {errors.description && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.description.message}
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
              name="image"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <>
                  <Avatar
                    src={value ? URL.createObjectURL(value) : null}
                    alt="Image de la catégorie"
                    variant="square"
                    sx={{
                      width: 250,
                      height: "auto",
                      mr: 3,
                      cursor: "pointer",
                      border: "2px solid transparent",
                      transition: "border 0.3s ease",
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    onMouseEnter={(e: any) =>
                      (e.currentTarget.style.border = "2px solid #72de95")
                    }
                    onMouseLeave={(e: any) =>
                      (e.currentTarget.style.border = "2px solid transparent")
                    }
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
            {errors.image && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.image.message}
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
            {!!props.categoryToEdit && (
              <Button
                size="large"
                variant="outlined"
                color="error"
                onClick={handleDeleteCategory}
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

export default AddCategoryDrawer;
