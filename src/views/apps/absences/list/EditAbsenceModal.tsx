import React, { useState, useEffect, HTMLAttributes } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchData as fetchUsers } from "src/store/apps/users";
import * as yup from "yup";
import { addAbsence, updateAbsence } from "src/store/apps/absences";
import { UserType } from "src/types/apps/UserType";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  ListItem,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import CustomAvatar from "src/@core/components/mui/avatar";
import { getInitials } from "src/@core/utils/get-initials";
import { HOST } from "src/store/constants/hostname";
import { AbsenceType } from "src/types/apps/absenceTypes";
import { Icon } from "@iconify/react";
import { addDays, differenceInDays, format } from "date-fns";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { sendMail } from "src/store/apps/mail";

type SelectType = UserType;

const schema = yup.object().shape({
  absentUser: yup
    .number()
    .required("Absent est requis")
    .typeError("Absent est requis"),
  startDate: yup.string().required("Date de début est requis"),
  endDate: yup.string().required("Date de fin est requis"),
  reason: yup.string().required("Raison est requis"),
  justified: yup.boolean().nullable(),
  status: yup.string().required("Status est requis"),
});

interface EditAbsenceModalProps {
  open: boolean;
  toggle: () => void;
  absenceToEdit: AbsenceType | null;
  setAbsenceToEdit: (absence: AbsenceType | null) => void;
}
const EditAbsenceModal: React.FC<EditAbsenceModalProps> = (
  props: EditAbsenceModalProps
) => {
  // ** Props
  const { open, toggle, absenceToEdit, setAbsenceToEdit } = props;

  if (!absenceToEdit) return null;

  const dispatch = useDispatch<AppDispatch>();

  // ** State
  const [absenceDays, setAbsenceDays] = useState<any[]>([]);
  const [notificationMessage, setNotificationMessage] = useState("");

  // ** Store
  const userStore = useSelector((state: RootState) => state.users);
  const absenceStore = useSelector((state: RootState) => state.absences);

  const defaultValues = {
    absentUser: absenceToEdit?.absentUser.id || "",
    startDate: format(new Date(absenceToEdit?.startDate), "yyyy-MM-dd") || "",
    endDate: format(new Date(absenceToEdit?.endDate), "yyyy-MM-dd") || "",
    reason: absenceToEdit?.reason || "",
    justified: absenceToEdit?.justified,
    status: absenceToEdit?.status || "",
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
    dispatch(fetchUsers() as any);
  }, []);

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      id: absenceToEdit?.id,
      absentUser: { id: data.absentUser },
      absenceDays,
    };

    dispatch(updateAbsence(payload) as any);

    handleClose();
  };

  const sendMessage = () => {
    const recipients: { id: number }[] = [];

    absenceDays.forEach((day) => {
      day.sessions.forEach((session: any) => {
        if (session.user) {
          if (!recipients.includes(session.user.id)) {
            recipients.push({ id: session.user.id });
          }
        }
      });
    });

    const subject = "Notification de remplacement";

    let body = `${absenceToEdit.absenceDays.map(
      (day) =>
        `${format(new Date(day.date), "dd/MM/yyyy")} ${translateDay(
          format(new Date(day.date), "EEEE")
        )} \n` +
        `${day.sessions.map(
          (session, i) =>
            `Séance ${i + 1} : ${session.user
              ? `${userStore.data.find((user) => user.id === session.user.id)
                ?.userData.firstName
              } ${userStore.data.find((user) => user.id === session.user.id)
                ?.userData.lastName
              }`
              : "Non défini"
            }`
        )}`
    )}`;
    body += `\n\n${notificationMessage}`;

    const category = 2;

    dispatch(sendMail({ recipients, subject, body, category }) as any);
  };

  const handleClose = () => {
    setAbsenceToEdit(null);
    toggle();
    reset();
  };

  function translateDay(day: string) {
    switch (day) {
      case "Monday":
        return "Lundi";
      case "Tuesday":
        return "Mardi";
      case "Wednesday":
        return "Mercredi";
      case "Thursday":
        return "Jeudi";
      case "Friday":
        return "Vendredi";
      case "Saturday":
        return "Samedi";
      case "Sunday":
        return "Dimanche";
      default:
        return day;
    }
  }

  const renderListItem = (
    props: HTMLAttributes<HTMLLIElement>,
    option: UserType
  ) => {
    const { absentUser } = absenceToEdit || {};
    if (absentUser) {
      if (
        (absentUser.role === "Teacher" && option.role === "Teacher") ||
        (absentUser.role === "Agent" && option.role === "Agent")
      ) {
        // Check if the option is not the absent user
        if (option.id !== absentUser.id) {
          return (
            <ListItem key={option.id} sx={{ cursor: "pointer" }} {...props}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  alt={`Profile Image of ${option.userData?.firstName} ${option.userData?.lastName}`}
                  src={`${HOST}/uploads/${option.profileImage}`}
                  sx={{ width: 30, height: 30, marginRight: "10px" }}
                />
                <Typography sx={{ fontSize: "0.875rem" }}>
                  {option.userData.firstName} {option.userData.lastName}
                </Typography>
              </Box>
            </ListItem>
          );
        }
      }
    }
  };
  
  

  const numberOfDays =
    differenceInDays(
      new Date(absenceToEdit.endDate),
      new Date(absenceToEdit.startDate)
    ) + 1;

  const daysArray = Array.from({ length: numberOfDays }, (_, i) => {
    const date = addDays(new Date(absenceToEdit.startDate), i);
    return {
      date,
      sessions: Array.from({ length: 7 }, (_, j) => ({
        user: null,
      })),
    };
  });

  useEffect(() => {
    if (absenceToEdit.absenceDays.length > 0) {
      setAbsenceDays(absenceToEdit.absenceDays);
    } else {
      setAbsenceDays(daysArray);
    }
  }, []);

  return (
    <Dialog
      open={open}
      onClose={toggle}
      sx={{ "& .MuiPaper-root": { maxWidth: 650 } }}
    >
      <DialogTitle>Modifier Absence</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name="absentUser"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    id="absent-user-autocomplete"
                    readOnly
                    options={userStore.data.filter(
                      (option) =>
                        !absenceStore.data.some(
                          (absent) => absent.absentUser.id === option.id
                        )
                    )}
                    getOptionLabel={(option) =>
                      `${option.userData?.firstName} ${option.userData?.lastName}`
                    }
                    value={
                      value
                        ? userStore.data.find(
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
                        label="Absent"
                        disabled
                        error={Boolean(errors.absentUser)}
                        helperText={
                          errors.absentUser ? errors.absentUser.message : ""
                        }
                      />
                    )}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name="startDate"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    id="startDate"
                    label="Date de début"
                    type="date"
                    disabled
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.startDate)}
                    helperText={
                      errors.startDate ? errors.startDate.message : ""
                    }
                    InputLabelProps={{ shrink: true }}
                    sx={{ "& .MuiOutlinedInput-root": { p: 2 } }}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name="endDate"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    id="endDate"
                    label="Date de fin"
                    type="date"
                    value={value}
                    disabled
                    onChange={onChange}
                    error={Boolean(errors.endDate)}
                    helperText={errors.endDate ? errors.endDate.message : ""}
                    InputLabelProps={{ shrink: true }}
                    sx={{ "& .MuiOutlinedInput-root": { p: 2 } }}
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name="reason"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    id="reason"
                    label="Raison"
                    disabled
                    multiline
                    rows={4}
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.reason)}
                    helperText={errors.reason ? errors.reason.message : ""}
                    sx={{ "& .MuiOutlinedInput-root": { p: 2 } }}
                  />
                )}
              />
            </FormControl>
            <FormControl component="fieldset" fullWidth sx={{ mb: 6 }}>
              <FormLabel component="legend">Justifié</FormLabel>
              <Controller
                name="justified"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <RadioGroup
                    value={value}
                    onChange={(e) => {
                      if (e.target.value === "true") {
                        onChange(true);
                      } else if (e.target.value === "false") {
                        onChange(false);
                      }
                    }}
                    row
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="Oui"
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label="Non"
                    />
                  </RadioGroup>
                )}
              />
              {errors.justified && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.justified.message}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel htmlFor="status">Statut</InputLabel>
              <Controller
                name="status"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    id="status"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    label="Statut"
                    error={Boolean(errors.status)}
                  >
                    <MenuItem value="not treated">Pas Traitée</MenuItem>
                    <MenuItem value="treating">En cours de traitement</MenuItem>
                    <MenuItem value="treated">Traitée</MenuItem>
                  </Select>
                )}
              />
              {errors.status && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.status.message}
                </FormHelperText>
              )}
            </FormControl>

            <Box sx={{ mb: 8 }}>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Jours d'absence
              </Typography>

              {absenceDays.map((day, day_index) => (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                  >
                    {format(new Date(day.date), "dd/MM/yyyy")}{" "}
                    {translateDay(format(new Date(day.date), "EEEE"))}
                  </AccordionSummary>
                  <AccordionDetails>
                    {day.sessions.map((session: any, session_index: number) => {
                      const selectedUser = userStore.data.find(
                        (user) =>
                          user.id ===
                          Number(
                            absenceDays[day_index]?.sessions[session_index]
                              ?.user?.id
                          )
                      );
                      return (
                        <FormControl fullWidth sx={{ mb: 6 }}>
                          <Autocomplete
                            id="replacing-user-autocomplete"
                            options={userStore.data}
                            getOptionLabel={(option) =>
                              `${option.userData?.firstName} ${option.userData?.lastName}`
                            }
                            value={selectedUser ? selectedUser : null}
                            onChange={(event, newValue) => {
                              setAbsenceDays((prevState) =>
                                prevState.map((day, i) => {
                                  if (i === day_index) {
                                    return {
                                      ...day,
                                      sessions: day.sessions.map(
                                        (session: any, j: number) => {
                                          if (j === session_index) {
                                            return {
                                              ...session,
                                              user: newValue,
                                            };
                                          }
                                          return session;
                                        }
                                      ),
                                    };
                                  }
                                  return day;
                                })
                              );
                            }}
                            renderOption={(props, option) =>
                              renderListItem(props, option)
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={`Séance ${session_index + 1}`}
                                error={Boolean(errors.absentUser)}
                                helperText={
                                  errors.absentUser
                                    ? errors.absentUser.message
                                    : ""
                                }
                              />
                            )}
                          />
                        </FormControl>
                      );
                    })}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            <FormControl fullWidth sx={{ mb: 6 }}>
              <TextField
                id="notification"
                label="Message aux remplaçants"
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                multiline
                rows={4}
                sx={{ "& .MuiOutlinedInput-root": { p: 2 } }}
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
              <Button
                size="large"
                variant="outlined"
                onClick={sendMessage}
                sx={{ mr: 3 }}
              >
                Notifier
              </Button>
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
      </DialogContent>
    </Dialog>
  );
};

export default EditAbsenceModal;
