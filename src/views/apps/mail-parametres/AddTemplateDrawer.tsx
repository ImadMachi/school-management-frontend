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
import { AppDispatch, RootState } from "src/store";

import { TemplateType } from "src/types/apps/templateTypes";
import { InputLabel, MenuItem, Select } from "@mui/material";
import {
  addTemplate,
  deleteTemplate,
  editTemplate,
} from "src/store/apps/templates";
import { useSelector } from "react-redux";
import { fetchData } from "src/store/apps/categories";

interface SidebarAddTemplateType {
  open: boolean;
  toggle: () => void;
  templateToEdit: TemplateType | null;
  setTemplateToEdit: (template: TemplateType | null) => void;
}

export interface CreateTemplateDto {
  title: string;
  description: string;
  subject: string;
  body: string;
  category: string;
}

const defaultValues: CreateTemplateDto = {
  title: "",
  description: "",
  subject: "",
  body: "",
  category: "",
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
  title: yup.string().required("Le titre est requis"),
  description: yup.string().required("La description est requise"),
  subject: yup.string().required("Le sujet est requis"),
  body: yup.string().required("Le corps est requis"),
  category: yup.string().required("La catégorie est requise"),
});

const AddTemplateDrawer = (props: SidebarAddTemplateType) => {
  // ** Props
  const { open, toggle } = props;

  // ** HooksSidebarAddClass
  const dispatch = useDispatch<AppDispatch>();

  // ** Stores
  const categoryStore = useSelector((state: RootState) => state.categories);

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
      if (props.templateToEdit) {
        setValue("title", props.templateToEdit.title);
        setValue("description", props.templateToEdit.description);
        setValue("subject", props.templateToEdit.subject);
        setValue("body", props.templateToEdit.body);
        setValue("category", `${props.templateToEdit.category.id}`);
      }
    })();
  }, [props.open]);

  useEffect(() => {
    dispatch(fetchData() as any);
  }, []);

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
    };

    if (props.templateToEdit) {
      dispatch(
        editTemplate({
          ...payload,
          id: props.templateToEdit.id,
          category: { id: payload.category },
        }) as any
      );
    } else {
      dispatch(
        addTemplate({ ...payload, category: { id: payload.category } }) as any
      );
    }

    toggle();
    reset();
  };

  const handleClose = () => {
    toggle();
    reset();
  };

  const handleDeleteTemplate = () => {
    if (props.templateToEdit) {
      dispatch(deleteTemplate(props.templateToEdit.id) as any);
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
          {!!props.templateToEdit ? "Modifier" : "Ajouter"} Template
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
              name="title"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Titre de la template"
                  onChange={onChange}
                  error={Boolean(errors.title)}
                />
              )}
            />
            {errors.title && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.title.message}
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
                  label="Description de la template"
                  multiline
                  rows={3}
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

          <Typography variant="h5" sx={{ marginBottom: 4 }}>
            Contenu du message
          </Typography>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="subject"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Sujet"
                  onChange={onChange}
                  error={Boolean(errors.subject)}
                />
              )}
            />
            {errors.subject && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.subject.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="body"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Message"
                  rows={3}
                  multiline
                  onChange={onChange}
                  error={Boolean(errors.body)}
                />
              )}
            />
            {errors.body && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.body.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id="category-label" htmlFor="category-select">
              Catégorie
            </InputLabel>
            <Controller
              name="category"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  labelId="category-label"
                  id="category-select"
                  value={value}
                  label="Catégorie"
                  onChange={onChange}
                  error={Boolean(errors.category)}
                >
                  {categoryStore.data.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.category && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.category.message}
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
            {!!props.templateToEdit && (
              <Button
                size="large"
                variant="outlined"
                color="error"
                onClick={handleDeleteTemplate}
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

export default AddTemplateDrawer;
