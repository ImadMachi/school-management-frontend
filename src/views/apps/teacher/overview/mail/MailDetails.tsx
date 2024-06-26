// ** React Imports
import {
  Fragment,
  useState,
  ReactNode,
  useEffect,
  SyntheticEvent,
} from "react";

// ** MUI Imports
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Box, { BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Third Party Imports
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Hooks
import { useSettings } from "src/@core/hooks/useSettings";

// ** Custom Components Imports
import Sidebar from "src/@core/components/sidebar";
import CustomChip from "src/@core/components/mui/chip";
import OptionsMenu from "src/@core/components/option-menu";

// ** Types
import { ThemeColor } from "src/@core/layouts/types";
import { OptionType } from "src/@core/components/option-menu/types";
import {
  MailType,
  MailLabelType,
  MailDetailsType,
  MailFoldersArrType,
  MailAttachmentType,
} from "src/types/apps/mailTypes";
import { Button, Chip } from "@mui/material";
import Link from "next/link";
import { HOST } from "src/store/constants/hostname";
import {
  getCurrentMail,
  handleSelectAllMail,
  markAsRead,
  moveFromTrash,
  moveToTrash,
} from "src/store/apps/mail";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { UserRole } from "src/types/apps/UserType";

const HiddenReplyBack = styled(Box)<BoxProps>(({ theme }) => ({
  height: 11,
  width: "90%",
  opacity: 0.5,
  borderWidth: 1,
  borderBottom: 0,
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
  borderStyle: "solid",
  borderColor: theme.palette.divider,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

const HiddenReplyFront = styled(Box)<BoxProps>(({ theme }) => ({
  height: 12,
  width: "95%",
  opacity: 0.75,
  borderWidth: 1,
  borderBottom: 0,
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
  borderStyle: "solid",
  borderColor: theme.palette.divider,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

const MailDetails = (props: MailDetailsType) => {
  // ** Props
  const {
    mail,
    hidden,
    folders,
    dispatch,
    direction,
    foldersObj,
    labelColors,
    routeParams,
    paginateMail,
    handleStarMail,
    mailDetailsOpen,
    handleLabelUpdate,
    handleFolderUpdate,
    setMailDetailsOpen,
  } = props;

  // ** State
  const [showReplies, setShowReplies] = useState<boolean>(false);

  // ** Hook
  const { settings } = useSettings();

  const userData = useSelector((state: RootState) => state.users.data);

  const findUserDataById = (userId: number) => {
    return userData.find((user) => user.id === userId);
  };

  // ** Effects
  useEffect(() => {
    if (mail) {
      if (!mail.isRead) {
        dispatch(markAsRead(mail.id));
      }
    }
  }, [mail]);

  const handleMoveToTrash = (e: SyntheticEvent) => {
    e.stopPropagation();
    dispatch(moveToTrash({ id: mail.id, folder: routeParams.folder! }));
    dispatch(handleSelectAllMail(false));
    setMailDetailsOpen(false);
  };

  const handleMoveFromTrash = (e: SyntheticEvent) => {
    e.stopPropagation();
    dispatch(moveFromTrash({ id: mail.id, folder: routeParams.folder! }));
    dispatch(handleSelectAllMail(false));
    setMailDetailsOpen(false);
  };

  const prevMailIcon =
    direction === "rtl" ? "mdi:chevron-right" : "mdi:chevron-left";
  const nextMailIcon =
    direction === "rtl" ? "mdi:chevron-left" : "mdi:chevron-right";
  const goBackIcon = prevMailIcon;
  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return (
        <Box sx={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}>
          {children}
        </Box>
      );
    } else {
      return (
        <PerfectScrollbar options={{ wheelPropagation: false }}>
          {children}
        </PerfectScrollbar>
      );
    }
  };
  const user = findUserDataById(mail?.sender.id);

  return (
    <Sidebar
      hideBackdrop
      direction="right"
      show={mailDetailsOpen}
      sx={{ zIndex: 3, width: "100%", overflow: "hidden" }}
      onClose={() => {
        setMailDetailsOpen(false);
        setShowReplies(false);
      }}
    >
      {mail ? (
        <Fragment>
          <Box
            sx={{
              px: 2.6,
              py: [2.25, 3],
              backgroundColor: "background.paper",
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: ["flex-start", "center"],
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  overflow: "hidden",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                <IconButton
                  size="small"
                  sx={{ mr: 3.5 }}
                  onClick={() => {
                    setMailDetailsOpen(false);
                    setShowReplies(false);
                  }}
                >
                  <Icon icon={goBackIcon} fontSize="2rem" />
                </IconButton>
                <Box
                  sx={{
                    display: "flex",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    flexDirection: ["column", "row"],
                  }}
                >
                  <Typography noWrap sx={{ mr: 2, fontWeight: 500 }}>
                    {mail.subject}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: "background.paper",
              p: (theme) => theme.spacing(3, 2, 3, 3),
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <>
                  {mail.isDeleted ? (
                    <IconButton size="small" onClick={handleMoveFromTrash}>
                      <Icon
                        icon="material-symbols-light:restore-from-trash-outline-rounded"
                        fontSize="1.375rem"
                      />
                    </IconButton>
                  ) : (
                    <IconButton size="small" onClick={handleMoveToTrash}>
                      <Icon icon="mdi:delete-outline" fontSize="1.375rem" />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    onClick={(e) => handleStarMail(e, mail.id, mail.isStarred)}
                    sx={{
                      ...(mail.isStarred ? { color: "warning.main" } : {}),
                    }}
                  >
                    <Icon icon="mdi:star-outline" fontSize="1.375rem" />
                  </IconButton>
                </>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              height: "calc(100% - 7.75rem)",
              backgroundColor: "action.hover",
            }}
          >
            <ScrollWrapper>
              <Box
                sx={{
                  py: 4,
                  px: 5,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    mb: 4,
                    width: "100%",
                    borderRadius: 1,
                    overflow: "visible",
                    position: "relative",
                    backgroundColor: "background.paper",
                    boxShadow: settings.skin === "bordered" ? 0 : 6,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ p: 5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          alt={
                            mail.sender.role == UserRole.Parent
                              ? `${mail.sender.senderData.fatherFirstName} ${mail.sender.senderData.fatherLastName} - ${mail.sender.senderData.motherFirstName} ${mail.sender.senderData.motherLastName}`
                              : `${mail.sender.senderData.firstName} ${mail.sender.senderData.lastName}`
                          }
                          src={`${HOST}/uploads/${user?.profileImage}`}
                          sx={{ width: "2.375rem", height: "2.375rem", mr: 3 }}
                        />
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography sx={{ fontWeight: 500 }}>
                            {mail.sender.role == UserRole.Parent
                              ? `${mail.sender.senderData.fatherFirstName} ${mail.sender.senderData.fatherLastName} - ${mail.sender.senderData.motherFirstName} ${mail.sender.senderData.motherLastName}`
                              : `${mail.sender.senderData.firstName} ${mail.sender.senderData.lastName}`}
                          </Typography>
                          <Typography variant="body2">
                            {mail.sender.email}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {!!mail.parentMessage && (
                          <Button
                            sx={{
                              mr: 8,
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              dispatch(
                                getCurrentMail(mail.parentMessage?.id as number)
                              );
                              setTimeout(() => {
                                dispatch(handleSelectAllMail(false));
                              }, 600);
                            }}
                          >
                            <Icon
                              icon="ic:baseline-reply"
                              style={{ marginRight: 4, color: "GrayText" }}
                            />
                            <Typography variant="caption">
                              Ce message est une Réponse
                            </Typography>
                          </Button>
                        )}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginRight: "30px",
                          }}
                        >
                          <Avatar
                            src={`${HOST}/uploads/categories-images/${mail.category.imagepath}`}
                            alt={mail.category.name}
                            style={{
                              borderRadius: "5px",
                              marginRight: "10px",
                              height: "30px",
                              width: "30px",
                            }}
                          />
                          <Typography variant="body2">
                            {mail.category.name}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ mr: 3 }}>
                          {new Date(mail.createdAt).toLocaleDateString(
                            "fr-FR",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}{" "}
                          {new Date(mail.createdAt).toLocaleTimeString(
                            "fr-FR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }
                          )}
                        </Typography>
                        {mail.attachments.length ? (
                          <IconButton size="small">
                            <Icon icon="mdi:attachment" fontSize="1.375rem" />
                          </IconButton>
                        ) : null}
                      </Box>
                    </Box>
                  </Box>
                  <Divider sx={{ m: "0 !important" }} />
                  <Box sx={{ p: 5, pt: 0 }}>
                    <Box dangerouslySetInnerHTML={{ __html: mail.body }} />
                  </Box>
                  {mail.attachments.length ? (
                    <Fragment>
                      <Divider sx={{ m: "0 !important" }} />
                      <Box sx={{ p: 5 }}>
                        <Typography variant="body2">Pièces jointes</Typography>
                        <Box
                          sx={{
                            py: 1,
                            px: 4,
                            display: "flex",
                            borderBottom: (theme) =>
                              `1px solid ${theme.palette.divider}`,
                            cursor: "pointer",
                            mt: 2,
                            mb: 2,
                          }}
                        >
                          {mail.attachments.map((item: MailAttachmentType) => (
                            <Box
                              key={item.id}
                              sx={{
                                display: "flex",
                                marginBottom: "3px",
                                marginRight: "15px",
                                alignItems: "center",
                              }}
                            >
                              <Link
                                href={`${HOST}/uploads/attachments/${item.filepath}`}
                                download={item.filename}
                                target="_blank"
                              >
                                <Chip
                                  size="small"
                                  key={item.filename}
                                  label={item.filename}
                                />
                              </Link>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Fragment>
                  ) : null}
                </Box>
              </Box>
            </ScrollWrapper>
          </Box>
        </Fragment>
      ) : null}
    </Sidebar>
  );
};

export default MailDetails;
