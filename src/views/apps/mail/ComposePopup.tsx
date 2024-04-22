// ** React Imports
import {
  useState,
  useRef,
  HTMLAttributes,
  ReactNode,
  ChangeEvent,
  useEffect,
  use,
} from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import Menu from "@mui/material/Menu";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import MenuItem from "@mui/material/MenuItem";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import ButtonGroup from "@mui/material/ButtonGroup";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Third Party Components
import { EditorState } from "draft-js";

// ** Custom Components Imports
import OptionsMenu from "src/@core/components/option-menu";
import CustomAvatar from "src/@core/components/mui/avatar";
import ReactDraftWysiwyg from "src/@core/components/react-draft-wysiwyg";

// ** Styled Component Imports
import { EditorWrapper } from "src/@core/styles/libs/react-draft-wysiwyg";

// ** Types
import { MailComposeType } from "src/types/apps/mailTypes";

// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";

// ** Styles
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { sendMail } from "src/store/apps/mail";
import {
  Avatar,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  Select,
} from "@mui/material";
import { useSelector } from "react-redux";
import { fetchData } from "src/store/apps/users";
import { fetchData as fetchCategoryData } from "src/store/apps/categories";
import { fetchData as fetchClassesData } from "src/store/apps/classes";
import { fetchData as fetchTemplatesData } from "src/store/apps/templates";
import { fetchData as fetchGroupsData } from "src/store/apps/groups";
import { GroupType } from "src/types/apps/groupTypes";
import VoiceRecorder from "./VoiceRecorder";
import { UserRole, UserType } from "src/types/apps/UserType";
import { useRouter } from "next/router";
import { ClassType } from "src/types/apps/classTypes";
import toast from "react-hot-toast";
import CardSnippet from "src/@core/components/card-snippet";
import SwiperThumbnails from "src/views/components/swiper/SwiperThumbnails";
import { useSettings } from "src/@core/hooks/useSettings";
import * as source from "src/views/components/swiper/SwiperSourceCode";
import { TemplateType } from "src/types/apps/templateTypes";

type ToUserType = UserType;

const ComposePopup = (props: MailComposeType) => {
  // ** Props
  const { mdAbove, composeOpen, composePopupWidth, toggleComposeOpen } = props;

  // ** States
  const [emailToStudents, setEmailToStudents] = useState<ToUserType[]>([]);
  const [emailToTeachers, setEmailToTeachers] = useState<ToUserType[]>([]);
  const [emailToParents, setEmailToParents] = useState<ToUserType[]>([]);
  const [emailToClasses, setEmailToClasses] = useState<ClassType[]>([]);
  const [emailToGroups, setEmailToGroups] = useState<GroupType[]>([]);
  const [subjectValue, setSubjectValue] = useState<string>("");
  const [messageValue, setMessageValue] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [category, setCategory] = useState(-1);
  const [studentUsers, setStudentUsers] = useState<UserType[]>([]);
  const [parentUsers, setParentUsers] = useState<UserType[]>([]);
  const [teacherUsers, setTeacherUsers] = useState<UserType[]>([]);
  const [checkedRecipients, setCheckedRecipients] = useState<boolean[]>([
    true,
    false,
    false,
    true,
    false,
  ]);
  const [selectedAudios, setSelectedAudios] = useState<
    { id: number; blob: Blob }[]
  >([]);

  // ** Errors
  const [emailToError, setEmailToError] = useState<boolean>(false);
  const [subjectError, setObjectError] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<boolean>(false);
  const [categoryError, setCategoryError] = useState<boolean>(false);

  // ** Ref
  const anchorRefSendBtn = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ** Store
  const userStore = useSelector((state: RootState) => state.users);
  const categoryStore = useSelector((state: RootState) => state.categories);
  const classStore = useSelector((state: RootState) => state.classes);
  const templateStore = useSelector((state: RootState) => state.templates);
  const groupStore = useSelector((state: RootState) => state.groups);

  // ** Router
  const router = useRouter();

  // ** Settings
  const {
    settings: { direction },
  } = useSettings();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchData() as any);
    dispatch(fetchCategoryData() as any);
    dispatch(fetchClassesData() as any);
    dispatch(fetchTemplatesData() as any);
    dispatch(fetchGroupsData() as any);
  }, []);

  useEffect(() => {
    const studentUsers = userStore.data.filter(
      (user) => user.role === UserRole.Student
    );
    setStudentUsers(studentUsers);
    const parentUsers = userStore.data.filter(
      (user) => user.role === UserRole.Parent
    );
    setParentUsers(parentUsers);

    const teacherUsers = userStore.data.filter(
      (user) => user.role === UserRole.Teacher
    );
    setTeacherUsers(teacherUsers);
  }, [userStore.data]);

  useEffect(() => {
    setCategory(categoryStore.data[0]?.id);
  }, [categoryStore.data]);

  const handleAttachmentButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to handle changes in the select input
  const handleSelectChange = (event: any) => {
    setCategory(event.target.value);
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const uniqueNewFiles = newFiles.filter((newFile) =>
        selectedFiles.every(
          (existingFile) => existingFile.name !== newFile.name
        )
      );
      setSelectedFiles((prevFiles) => [...prevFiles, ...uniqueNewFiles]);
    }
  };

  const handleDeleteSelectedFile = (fileName: string) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  const handlePopupSendMail = () => {
    setEmailToError(false);
    setObjectError(false);
    setMessageError(false);
    const emailTo = emailToStudents
      .concat(emailToParents)
      .concat(emailToTeachers);
    if (emailToClasses.length) {
      emailToClasses.forEach((cls) => {
        cls.students.forEach((student) => {
          const studentUser = studentUsers.find(
            (user) => user.userData.id === student.id
          );
          if (studentUser && !emailTo.includes(studentUser)) {
            emailTo.push(studentUser);
          }
        });
      });
    }
    if (emailToGroups.length) {
      emailToGroups.forEach((group) => {
        group.users.forEach((user) => {
          if (!emailTo.includes(user)) {
            emailTo.push(user);
          }
        });
        group.administratorUsers.forEach((user) => {
          if (!emailTo.includes(user)) {
            emailTo.push(user);
          }
        });
      });
    }
    if (
      !emailTo.length ||
      !subjectValue.length ||
      !messageValue.length ||
      category < 1
    ) {
      if (!emailTo.length) {
        setEmailToError(true);
      }
      if (!subjectValue.length) {
        setObjectError(true);
      }
      if (!messageValue.length) {
        setMessageError(true);
      }
      if (category < 1) {
        setCategoryError(true);
      }
      return;
    }

    // Convert audio blob to file
    const attachments = selectedFiles.concat(
      selectedAudios.map(
        (audio) => new File([audio.blob], `audio${audio.id}.wav`)
      )
    );

    const mail = {
      subject: subjectValue,
      body: messageValue,
      recipients: emailTo,
      attachments,
      category,
    };

    // @ts-ignore
    dispatch(sendMail(mail));
    router.replace({
      pathname: "/apps/mail/sent",
      query: { returnUrl: router.asPath },
    });
    handlePopupClose();
  };

  const handleMailDelete = (
    value: number,
    state: (ToUserType | ClassType)[],
    setState: (val: (ToUserType | ClassType)[]) => void
  ) => {
    const arr = state;
    const index = arr.findIndex((i) => i.id === value);
    arr.splice(index, 1);
    setState([...arr]);
  };

  const handlePopupClose = () => {
    toggleComposeOpen();
    setEmailToStudents([]);
    setEmailToTeachers([]);
    setEmailToParents([]);
    setEmailToClasses([]);
    setEmailToGroups([]);
    setSubjectValue("");
    setMessageValue("");
    setSelectedFiles([]);
  };

  const handleMinimize = () => {
    toggleComposeOpen();
    setEmailToStudents(emailToStudents);
    setEmailToTeachers(emailToTeachers);
    setEmailToParents(emailToParents);
    setEmailToClasses(emailToClasses);
    setEmailToGroups(emailToGroups);
    setMessageValue(messageValue);
    setSubjectValue(subjectValue);
  };

  const renderCustomChips = (
    array: ToUserType[],
    getTagProps: ({ index }: { index: number }) => {},
    state: ToUserType[],
    setState: (val: ToUserType[]) => void
  ) => {
    return array.map((item, index) => (
      <Chip
        size="small"
        key={item.id}
        label={`${item.userData.firstName} ${item.userData.lastName}`}
        {...(getTagProps({ index }) as {})}
        deleteIcon={<Icon icon="mdi:close" />}
        //@ts-ignore
        onDelete={() => handleMailDelete(item.id, state, setState)}
      />
    ));
  };
  const renderCustomClassChips = (
    array: (GroupType | ClassType)[],
    getTagProps: ({ index }: { index: number }) => {},
    state: (ClassType | GroupType)[],
    setState: (val: (GroupType | ClassType)[]) => void
  ) => {
    return array.map((item, index) => (
      <Chip
        size="small"
        key={item.id}
        label={`${item.name}`}
        {...(getTagProps({ index }) as {})}
        deleteIcon={<Icon icon="mdi:close" />}
        //@ts-ignore
        onDelete={() => handleMailDelete(item.id, state, setState)}
      />
    ));
  };

  const renderListItem = (
    props: HTMLAttributes<HTMLLIElement>,
    option: ToUserType,
    array: ToUserType[],
    setState: (val: ToUserType[]) => void
  ) => {
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
              src={`http://localhost:8000/uploads/${option.profileImage}`}
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
  };

  const renderClassListItem = (
    props: HTMLAttributes<HTMLLIElement>,
    option: ClassType | GroupType,
    array: (ClassType | GroupType)[],
    setState: (val: (ClassType | GroupType)[]) => void
  ) => {
    return (
      <ListItem
        key={option.id}
        sx={{ cursor: "pointer" }}
        onClick={() => setState([...array, option])}
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

  const addNewOption = (options: ToUserType[], params: any): ToUserType[] => {
    const { inputValue } = params;
    const filteredOptions = options.filter((option) =>
      `${option.userData.firstName} ${option.userData.lastName}`
        .toLowerCase()
        .includes(inputValue.toLowerCase())
    );
    // @ts-ignore
    return filteredOptions;
  };

  const addNewClassOption = (
    options: ClassType[],
    params: any
  ): ClassType[] => {
    const { inputValue } = params;
    const filteredOptions = options.filter((option) =>
      option.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    // @ts-ignore
    return filteredOptions;
  };

  const addNewGroupOption = (
    options: GroupType[],
    params: any
  ): GroupType[] => {
    const { inputValue } = params;
    const filteredOptions = options.filter((option) =>
      option.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    // @ts-ignore
    return filteredOptions;
  };

  const handleSelectTemplate = (template: TemplateType) => {
    setSubjectValue(template.subject);
    setMessageValue(template.body);
    setCategory(template.category.id);
  };

  const handleChangeCheckedRecipient = (index: number) => {
    setCheckedRecipients((prevValues) =>
      prevValues.map((v, i) => (i === index ? !v : v))
    );
  };

  return (
    <Drawer
      hideBackdrop
      anchor="bottom"
      open={composeOpen}
      variant="temporary"
      onClose={toggleComposeOpen}
      sx={{
        top: "auto",
        left: "auto",
        right: mdAbove ? "1.5rem" : "1rem",
        bottom: "1.5rem",
        display: "block",
        zIndex: (theme) => `${theme.zIndex.drawer} + 1`,
        "& .MuiDrawer-paper": {
          borderRadius: 1,
          position: "static",
          width: composePopupWidth,
        },
      }}
    >
      <Box
        sx={{
          px: 4,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: (theme) =>
            `rgba(${theme.palette.customColors.main}, 0.08)`,
        }}
      >
        <Typography sx={{ fontWeight: 500 }}>Ecrire un message</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton sx={{ p: 1, mr: 2 }} onClick={handleMinimize}>
            <Icon icon="mdi:minus" fontSize={20} />
          </IconButton>
          <IconButton sx={{ p: 1 }} onClick={handlePopupClose}>
            <Icon icon="mdi:close" fontSize={20} />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          py: 1,
          px: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        {templateStore.data.length > 0 && (
          <Grid item xs={12} sx={{ width: "100%" }}>
            <SwiperThumbnails
              direction={direction}
              templates={templateStore.data}
              handleSelectTemplate={handleSelectTemplate}
            />
          </Grid>
        )}
      </Box>
      <Box
        sx={{
          py: 1,
          px: 4,
          display: "flex",
          alignItems: "center",
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <InputLabel sx={{ mr: 3, fontSize: "0.875rem" }}>
          Destinataires:
        </InputLabel>
        <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedRecipients[0]}
                onChange={() => handleChangeCheckedRecipient(0)}
              />
            }
            label="Etudiants"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedRecipients[1]}
                onChange={() => handleChangeCheckedRecipient(1)}
              />
            }
            label="Enseignants"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedRecipients[2]}
                onChange={() => handleChangeCheckedRecipient(2)}
              />
            }
            label="Parents"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedRecipients[3]}
                onChange={() => handleChangeCheckedRecipient(3)}
              />
            }
            label="Classes"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedRecipients[4]}
                onChange={() => handleChangeCheckedRecipient(4)}
              />
            }
            label="Groupes"
          />
        </FormGroup>
      </Box>
      <Box
        sx={{
          py: 1,
          px: 4,
          display: checkedRecipients[0] ? "flex" : "none",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
          <div>
            <InputLabel
              sx={{ mr: 3, fontSize: "0.875rem" }}
              htmlFor="email-to-select"
            >
              Aux Élèves:
            </InputLabel>
          </div>
          <Autocomplete
            multiple
            freeSolo
            value={emailToStudents}
            clearIcon={false}
            id="email-to-select"
            filterSelectedOptions
            options={studentUsers}
            ListboxComponent={List}
            filterOptions={addNewOption}
            getOptionLabel={(option) =>
              `${(option as ToUserType).userData.firstName} ${
                (option as ToUserType).userData.lastName
              }`
            }
            renderOption={(props, option) =>
              renderListItem(props, option, emailToStudents, setEmailToStudents)
            }
            renderTags={(array: ToUserType[], getTagProps) =>
              renderCustomChips(
                array,
                getTagProps,
                emailToStudents,
                setEmailToStudents
              )
            }
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": { p: 2 },
              "& .MuiAutocomplete-endAdornment": { display: "none" },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                autoComplete="new-password"
                sx={{
                  border: 0,
                  "& fieldset": { border: "0 !important" },
                  "& .MuiOutlinedInput-root": { p: "0 !important" },
                }}
              />
            )}
          />
        </Box>
      </Box>
      <Box
        sx={{
          py: 1,
          px: 4,
          display: checkedRecipients[1] ? "flex" : "none",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
          <div>
            <InputLabel
              sx={{ mr: 3, fontSize: "0.875rem" }}
              htmlFor="email-to-select"
            >
              Aux Enseignants:
            </InputLabel>
          </div>
          <Autocomplete
            multiple
            freeSolo
            value={emailToTeachers}
            clearIcon={false}
            id="email-to-select"
            filterSelectedOptions
            options={teacherUsers}
            ListboxComponent={List}
            filterOptions={addNewOption}
            getOptionLabel={(option) =>
              `${(option as ToUserType).userData.firstName} ${
                (option as ToUserType).userData.lastName
              }`
            }
            renderOption={(props, option) =>
              renderListItem(props, option, emailToTeachers, setEmailToTeachers)
            }
            renderTags={(array: ToUserType[], getTagProps) =>
              renderCustomChips(
                array,
                getTagProps,
                emailToTeachers,
                setEmailToTeachers
              )
            }
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": { p: 2 },
              "& .MuiAutocomplete-endAdornment": { display: "none" },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                autoComplete="new-password"
                sx={{
                  border: 0,
                  "& fieldset": { border: "0 !important" },
                  "& .MuiOutlinedInput-root": { p: "0 !important" },
                }}
              />
            )}
          />
        </Box>
      </Box>
      <Box
        sx={{
          py: 1,
          px: 4,
          display: checkedRecipients[2] ? "flex" : "none",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
          <div>
            <InputLabel
              sx={{ mr: 3, fontSize: "0.875rem" }}
              htmlFor="email-to-select"
            >
              Aux Parents:
            </InputLabel>
          </div>
          <Autocomplete
            multiple
            freeSolo
            value={emailToParents}
            clearIcon={false}
            id="email-to-select"
            filterSelectedOptions
            options={parentUsers}
            ListboxComponent={List}
            filterOptions={addNewOption}
            getOptionLabel={(option) =>
              `${(option as ToUserType).userData.firstName} ${
                (option as ToUserType).userData.lastName
              }`
            }
            renderOption={(props, option) =>
              renderListItem(props, option, emailToParents, setEmailToParents)
            }
            renderTags={(array: ToUserType[], getTagProps) =>
              renderCustomChips(
                array,
                getTagProps,
                emailToParents,
                setEmailToParents
              )
            }
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": { p: 2 },
              "& .MuiAutocomplete-endAdornment": { display: "none" },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                autoComplete="new-password"
                sx={{
                  border: 0,
                  "& fieldset": { border: "0 !important" },
                  "& .MuiOutlinedInput-root": { p: "0 !important" },
                }}
              />
            )}
          />
        </Box>
      </Box>
      <Box
        sx={{
          py: 1,
          px: 4,
          display: checkedRecipients[3] ? "flex" : "none",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
          <div>
            <InputLabel
              sx={{ mr: 3, fontSize: "0.875rem" }}
              htmlFor="email-to-select"
            >
              Aux Classes:
            </InputLabel>
          </div>
          <Autocomplete
            multiple
            freeSolo
            value={emailToClasses}
            clearIcon={false}
            id="email-to-select"
            filterSelectedOptions
            options={classStore.data}
            ListboxComponent={List}
            filterOptions={addNewClassOption}
            getOptionLabel={(option) =>
              `${(option as ClassType).name}
              }`
            }
            renderOption={(props, option) =>
              renderClassListItem(
                props,
                option,
                emailToClasses,
                setEmailToClasses as any
              )
            }
            renderTags={(array: ClassType[], getTagProps) =>
              renderCustomClassChips(
                array,
                getTagProps,
                emailToClasses,
                setEmailToClasses as any
              )
            }
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": { p: 2 },
              "& .MuiAutocomplete-endAdornment": { display: "none" },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                autoComplete="new-password"
                sx={{
                  border: 0,
                  "& fieldset": { border: "0 !important" },
                  "& .MuiOutlinedInput-root": { p: "0 !important" },
                }}
              />
            )}
          />
        </Box>
      </Box>
      <Box
        sx={{
          py: 1,
          px: 4,
          display: checkedRecipients[4] ? "flex" : "none",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
          <div>
            <InputLabel
              sx={{ mr: 3, fontSize: "0.875rem" }}
              htmlFor="email-to-select"
            >
              Aux Groupes:
            </InputLabel>
          </div>
          <Autocomplete
            multiple
            freeSolo
            value={emailToGroups}
            clearIcon={false}
            id="email-to-select"
            filterSelectedOptions
            options={groupStore.data}
            ListboxComponent={List}
            filterOptions={addNewGroupOption}
            getOptionLabel={(option) =>
              `${(option as GroupType).name}
              }`
            }
            renderOption={(props, option) =>
              renderClassListItem(
                props,
                option,
                emailToGroups,
                setEmailToGroups as any
              )
            }
            renderTags={(array: GroupType[], getTagProps) =>
              renderCustomClassChips(
                array,
                getTagProps,
                emailToGroups,
                setEmailToGroups as any
              )
            }
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": { p: 2 },
              "& .MuiAutocomplete-endAdornment": { display: "none" },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                autoComplete="new-password"
                sx={{
                  border: 0,
                  "& fieldset": { border: "0 !important" },
                  "& .MuiOutlinedInput-root": { p: "0 !important" },
                }}
              />
            )}
          />
        </Box>
      </Box>
      {emailToError && (
        <FormHelperText sx={{ color: "error.main", paddingLeft: "15px" }}>
          Au moins un destinataire doit être sélectionné
        </FormHelperText>
      )}
      <Box
        sx={{
          py: 1,
          px: 4,
          display: "flex",
          alignItems: "center",
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <div>
          <InputLabel
            sx={{ mr: 3, fontSize: "0.875rem" }}
            htmlFor="select-input"
          >
            Catégorie:
          </InputLabel>
        </div>
        <Select
          value={category}
          onChange={handleSelectChange}
          input={<Input />}
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": { p: 2 },
            "& .MuiSelect-selectMenu": { minHeight: "auto" },
          }}
          disableUnderline={true}
        >
          {categoryStore.data.length > 0 &&
            categoryStore.data.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
        </Select>
      </Box>
      {categoryError && (
        <FormHelperText sx={{ color: "error.main", paddingLeft: "15px" }}>
          La catégorie ne peut pas être vide
        </FormHelperText>
      )}
      <Box
        sx={{
          py: 1,
          px: 4,
          display: "flex",
          alignItems: "center",
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <div>
          <InputLabel
            sx={{ mr: 3, fontSize: "0.875rem" }}
            htmlFor="email-subject-input"
          >
            Objet:
          </InputLabel>
        </div>
        <Input
          fullWidth
          value={subjectValue}
          id="email-subject-input"
          onChange={(e) => setSubjectValue(e.target.value)}
          sx={{
            "&:before, &:after": { display: "none" },
            "& .MuiInput-input": { py: 1.875 },
          }}
        />
      </Box>
      {subjectError && (
        <FormHelperText sx={{ color: "error.main", paddingLeft: "15px" }}>
          L'objet ne peut pas être vide
        </FormHelperText>
      )}
      <TextField
        multiline
        fullWidth
        rows={4}
        value={messageValue}
        onChange={(e) => setMessageValue(e.target.value)}
        placeholder="Message"
        sx={{
          "&:before, &:after": { display: "none" },
          "& .MuiInput-input": { py: 1.875 },
          "& fieldset": { border: "none" },
        }}
      />
      {messageError && (
        <FormHelperText sx={{ color: "error.main", paddingLeft: "15px" }}>
          Le message ne peut pas être vide
        </FormHelperText>
      )}

      <Box
        sx={{
          py: 1,
          px: 4,
          display: "flex",
          alignItems: "center",
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <VoiceRecorder
          selectedAudios={selectedAudios}
          setSelectedAudios={setSelectedAudios}
        />
      </Box>

      <Box
        sx={{
          py: 1,
          px: 4,
          display: "flex",
          flexWrap: "wrap",
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        {selectedFiles.map((file, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              marginBottom: "3px",
              marginRight: "15px",
              alignItems: "center",
            }}
          >
            {/* <Typography sx={{ fontSize: '0.875rem', color: 'success.main' }}>{file.name}</Typography> */}
            <Chip
              size="small"
              key={file.name}
              label={file.name}
              deleteIcon={<Icon icon="mdi:close" />}
              onDelete={() => handleDeleteSelectedFile(file.name)}
            />
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          py: 2,
          px: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ButtonGroup
            variant="contained"
            ref={anchorRefSendBtn}
            aria-label="split button"
          >
            <Button onClick={handlePopupSendMail}>Envoyer</Button>
          </ButtonGroup>

          <IconButton
            size="small"
            sx={{ ml: 3, color: "text.secondary" }}
            onClick={handleAttachmentButtonClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileInputChange}
              multiple
            />
            <Icon icon="mdi:attachment" fontSize="1.375rem" />
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ComposePopup;
