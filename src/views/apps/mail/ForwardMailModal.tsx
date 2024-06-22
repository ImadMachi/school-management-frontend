import React, { useState, useEffect, HTMLAttributes } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { UserRole, UserType } from "src/types/apps/UserType";
import { HOST } from "src/store/constants/hostname";
import {
  Autocomplete,
  Box,
  Chip,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { getInitials } from "src/@core/utils/get-initials";
import CustomAvatar from "src/@core/components/mui/avatar";
import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
import { forwardMail } from "src/store/apps/mail";

interface ForwardMailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: number | null;
  //   fetchUserById: (userId: number) => Promise<UserType>;
}

const ForwardMailPopup: React.FC<ForwardMailPopupProps> = ({
  isOpen,
  onClose,
  messageId,
  //   fetchUserById,
}) => {
  // ** States
  const [recipients, setRecipients] = useState<UserType[]>([]);

  // ** Store
  const userStore = useSelector((state: RootState) => state.users);

  // ** hooks
  const dispatch = useDispatch();
  //   useEffect(() => {
  //     const fetchUserData = async () => {
  //       try {
  //         if (isOpen && user && user.id) {
  //           // Fetch the old user data using fetchUserById
  //           const fetchedUserData = await fetchUserById(user.id);
  //           setUserData(fetchedUserData);
  //           setEmail(fetchedUserData.email);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching user data:", error);
  //       }
  //     };

  //     if (isOpen) {
  //       // Fetch user data only when the dialog is open
  //       fetchUserData();
  //     }
  //   }, [isOpen, user, fetchUserById]);

  const addNewOption = (options: UserType[], params: any): UserType[] => {
    const { inputValue } = params;
    const filteredOptions = options.filter((option) =>
      (option?.role == UserRole.Parent
        ? `${option?.userData?.fatherFirstName} ${option?.userData?.fatherLastName} - ${option?.userData?.motherFirstName} ${option?.userData?.motherLastName}`
        : `${option?.userData?.firstName} ${option?.userData?.lastName}`
      )
        .toLowerCase()
        .includes(inputValue.toLowerCase())
    );
    // @ts-ignore
    return filteredOptions;
  };

  const renderListItem = (
    props: HTMLAttributes<HTMLLIElement>,
    option: UserType,
    array: UserType[],
    setState: (val: UserType[]) => void
  ) => {
    if (option.isActive == true) {
      return (
        <ListItem
          key={option.id}
          sx={{ cursor: "pointer" }}
          onClick={() => setState([...array, option])}
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
                  option?.role == UserRole.Parent
                    ? `${option?.userData?.fatherFirstName} ${option?.userData?.fatherLastName} - ${option?.userData?.motherFirstName} ${option?.userData?.motherLastName}`
                    : `${option?.userData?.firstName} ${option?.userData?.lastName}`
                )}
              </CustomAvatar>
            )}

            <Typography sx={{ fontSize: "0.875rem" }}>
              {option?.role == UserRole.Parent
                ? `${option?.userData?.fatherFirstName} ${option?.userData?.fatherLastName} - ${option?.userData?.motherFirstName} ${option?.userData?.motherLastName}`
                : `${option?.userData?.firstName} ${option?.userData?.lastName}`}
            </Typography>
          </Box>
        </ListItem>
      );
    }
  };

  const handleMailDelete = (
    id: number,
    array: UserType[],
    setState: (val: UserType[]) => void
  ) => {
    setState(array.filter((item) => item.id !== id));
  };

  const renderCustomChips = (
    array: UserType[],
    getTagProps: ({ index }: { index: number }) => {},
    state: UserType[],
    setState: (val: UserType[]) => void
  ) => {
    return array.map((item, index) => (
      <Chip
        size="small"
        key={item.id}
        label={
          item?.role == UserRole.Parent
            ? `${item?.userData?.fatherFirstName} ${item?.userData?.fatherLastName} - ${item?.userData?.motherFirstName} ${item?.userData?.motherLastName}`
            : `${item?.userData?.firstName} ${item?.userData?.lastName}`
        }
        {...(getTagProps({ index }) as {})}
        deleteIcon={<Icon icon="mdi:close" />}
        //@ts-ignore
        onDelete={() => handleMailDelete(item.id, state, setState)}
      />
    ));
  };

  const handleClick = () => {
    if (messageId && recipients.length > 0) {
      dispatch(
        forwardMail({
          messageId,
          recipients: recipients.map((r) => ({ id: r.id })),
        }) as any
      );
      onClose();
      setRecipients([]);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Transférer le message</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            py: 1,
            px: 4,
            alignItems: "center",
            justifyContent: "space-between",
            border: (theme) => `1px solid ${theme.palette.divider}`,
            mb: 4,
          }}
        >
          <Autocomplete
            multiple
            freeSolo
            value={recipients}
            clearIcon={false}
            id="email-to-select"
            filterSelectedOptions
            options={userStore.data}
            ListboxComponent={List}
            filterOptions={addNewOption}
            getOptionLabel={(option) =>
              (option as UserType)?.role == UserRole.Parent
                ? `${(option as UserType)?.userData?.fatherFirstName} ${
                    (option as UserType)?.userData?.fatherLastName
                  } - ${(option as UserType)?.userData?.motherFirstName} ${
                    (option as UserType)?.userData?.motherLastName
                  }`
                : `${(option as UserType)?.userData?.firstName} ${
                    (option as UserType)?.userData?.lastName
                  }`
            }
            renderOption={(props, option) =>
              renderListItem(props, option, recipients, setRecipients)
            }
            renderTags={(array: UserType[], getTagProps) =>
              renderCustomChips(array, getTagProps, recipients, setRecipients)
            }
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": { p: 2 },
              "& .MuiAutocomplete-endAdornment": { display: "none" },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Sélectionnez les destinataires"
                sx={{
                  border: 0,
                  "& fieldset": { border: "0 !important" },
                  "& .MuiOutlinedInput-root": { p: "0 !important" },
                }}
              />
            )}
          />
        </Box>
        <Button variant="contained" color="primary" onClick={handleClick}>
          Transférer
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ForwardMailPopup;
