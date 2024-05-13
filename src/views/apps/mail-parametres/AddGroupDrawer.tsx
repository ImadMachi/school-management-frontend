// ** React Imports
import { HTMLAttributes, useEffect, useRef } from "react";

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

import { GroupType } from "src/types/apps/groupTypes";
import { HOST } from "src/store/constants/hostname";
import { Autocomplete, Avatar, Chip, List, ListItem } from "@mui/material";
import { addGroup, deleteGroup, editGroup } from "src/store/apps/groups";
import { fetchData as fetchUsers } from "src/store/apps/users";
import { useSelector } from "react-redux";
import { UserRole, UserType } from "src/types/apps/UserType";
import { getInitials } from "src/@core/utils/get-initials";

interface SidebarAddGroupType {
  open: boolean;
  toggle: () => void;
  groupToEdit: GroupType | null;
  setGroupToEdit: (group: GroupType | null) => void;
}

export interface CreateGroupDto {
  name: string;
  description: string;
  image: File | null;
  administratorUsers: UserType[];
  users: UserType[];
}

const defaultValues: CreateGroupDto = {
  name: "",
  description: "",
  image: null,
  administratorUsers: [],
  users: [],
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
    .required("Nom du groupe est requis")
    .min(3, "Nom du groupe doit avoir au moins 3 caractères"),
  description: yup.string(),
  image: yup.mixed().required("Image est requise"),
  administratorUsers: yup
    .array()
    .min(1, "Au moins un administrateur est requis"),
  users: yup.array().min(1, "Au moins un utilisateur est requis"),
});

const AddGroupDrawer = (props: SidebarAddGroupType) => {
  // ** Props
  const { open, toggle } = props;

  // ** HooksSidebarAddClass
  const dispatch = useDispatch<AppDispatch>();

  // ** Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ** Stores
  const usersStore = useSelector((state: RootState) => state.users);

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

  useEffect(() => {
    (async () => {
      if (props.groupToEdit) {
        setValue("name", props.groupToEdit.name);
        setValue("description", props.groupToEdit.description);

        const response = await fetch(
          `${HOST}/uploads/groups/${props.groupToEdit.imagePath}`
        );
        const data = await response.blob();
        const file = new File([data], props.groupToEdit.imagePath);
        setValue("image", file);

        setValue("administratorUsers", props.groupToEdit.administratorUsers);
        setValue("users", props.groupToEdit.users);
      }
    })();
  }, [props.open]);

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
    };

    if (props.groupToEdit) {
      dispatch(editGroup({ ...payload, id: props.groupToEdit.id }) as any);
    } else {
      dispatch(addGroup(payload) as any);
    }

    toggle();
    reset();
  };

  const handleClose = () => {
    toggle();
    reset();
  };

  const handleDeleteGroup = () => {
    if (props.groupToEdit) {
      dispatch(deleteGroup(props.groupToEdit.id) as any);
      toggle();
      reset();
    }
  };

  const filterOptions = (
    options: UserType[],
    params: any,
    value: UserType[]
  ): UserType[] => {
    const { inputValue } = params;

    const filteredOptions = options
      .filter((option) =>
        `${option.userData.firstName} ${option.userData.lastName}`
          .toLowerCase()
          .includes(inputValue.toLowerCase())
      )
      .filter((option) => !value.find((item) => item.id === option.id));

    // @ts-ignore
    return filteredOptions;
  };

  const renderUserListItem = (
    props: HTMLAttributes<HTMLLIElement>,
    option: UserType,
    array: UserType[],
    onChange: (...event: any[]) => void,
    multiple?: boolean
  ) => {
    if (option.isActive == true) {
      return (
        <ListItem
          key={option.id}
          sx={{ cursor: "pointer" }}
          onClick={() => {
            onChange({
              target: { value: multiple ? [...array, option] : [option] },
            });
          }}
        >
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
    }
  };

  const handleDeleteChipItem = (
    value: number,
    state: UserType[],
    setState: (val: UserType[]) => void
  ) => {
    const arr = state;
    const index = arr.findIndex((i) => i.id === value);
    arr.splice(index, 1);
    setState([...arr]);
  };

  const renderCustomChips = (
    array: UserType[],
    getTagProps: ({ index }: { index: number }) => {},
    state: UserType[],
    onChange: (...event: any[]) => void
  ) => {
    return state.map((item, index) => (
      <Chip
        size="small"
        key={item.id}
        label={`${item.userData.firstName} ${item.userData.lastName}`}
        {...(getTagProps({ index }) as {})}
        deleteIcon={<Icon icon="mdi:close" />}
        //@ts-ignore
        onDelete={() => handleDeleteChipItem(item.id, state, onChange)}
      />
    ));
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
          {!!props.groupToEdit ? "Modifier" : "Ajouter"} Groupe
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
                  label="Nom du groupe"
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
                  label="Description du groupe"
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

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="administratorUsers"
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
                  options={usersStore.data.filter(
                    (user) => user.role === UserRole.Administrator
                  )}
                  ListboxComponent={List}
                  //@ts-ignore
                  filterOptions={(options, params) =>
                    filterOptions(options, params, value)
                  }
                  getOptionLabel={(option) =>
                    `${(option as UserType).userData.firstName} ${
                      (option as UserType).userData.lastName
                    }`
                  }
                  renderOption={(props, option) =>
                    renderUserListItem(props, option, value, onChange)
                  }
                  renderTags={(array: UserType[], getTagProps) =>
                    renderCustomChips(array, getTagProps, value, onChange)
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": { p: 2 },
                    "& .MuiSelect-selectMenu": { minHeight: "auto" },
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Administrateur" />
                  )}
                />
              )}
            />
            {errors.administratorUsers && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.administratorUsers.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="users"
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
                  options={usersStore.data}
                  ListboxComponent={List}
                  //@ts-ignore
                  filterOptions={(options, params) =>
                    filterOptions(options, params, value)
                  }
                  getOptionLabel={(option) =>
                    `${(option as UserType).userData.firstName} ${
                      (option as UserType).userData.lastName
                    }`
                  }
                  renderOption={(props, option) =>
                    renderUserListItem(props, option, value, onChange, true)
                  }
                  renderTags={(array: UserType[], getTagProps) =>
                    renderCustomChips(array, getTagProps, value, onChange)
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": { p: 2 },
                    "& .MuiSelect-selectMenu": { minHeight: "auto" },
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Utilisateurs" />
                  )}
                />
              )}
            />
            {errors.users && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.users.message}
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
                    src={(value ? URL.createObjectURL(value) : null) as any}
                    alt="Image du groupe"
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
            {!!props.groupToEdit && (
              <Button
                size="large"
                variant="outlined"
                color="error"
                onClick={handleDeleteGroup}
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

export default AddGroupDrawer;
