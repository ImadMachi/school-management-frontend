// ** React Imports
import {
  Fragment,
  useState,
  SyntheticEvent,
  ReactNode,
  useEffect,
} from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Input from "@mui/material/Input";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Backdrop from "@mui/material/Backdrop";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import ListItem, { ListItemProps } from "@mui/material/ListItem";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Third Party Imports
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Custom Components Imports
import OptionsMenu from "src/@core/components/option-menu";

// ** Email App Component Imports
import { setTimeout } from "timers";
import MailDetails from "./MailDetails";

// ** Types
import {
  MailType,
  MailLogType,
  MailLabelType,
  MailFolderType,
  MailFoldersArrType,
  MailFoldersObjType,
} from "src/types/apps/mailTypes";
import {
  fetchMails,
  markAsStarred,
  markAsUnStarred,
  moveFromTrash,
  moveToTrash,
  paginateMail,
} from "src/store/apps/mail";
import { Button } from "@mui/material";
import { fr } from "date-fns/locale";

const MailItem = styled(ListItem)<ListItemProps>(({ theme }) => ({
  cursor: "pointer",
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  justifyContent: "space-between",
  transition:
    "border 0.15s ease-in-out, transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
  "&:not(:first-child)": {
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  "&:hover": {
    zIndex: 2,
    boxShadow: theme.shadows[3],
    transform: "translateY(-2px)",
    "& .mail-actions": { display: "flex" },
    "& .mail-info-right": { display: "none" },
    "& + .MuiListItem-root": { borderColor: "transparent" },
  },
  [theme.breakpoints.up("xs")]: {
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
  },
  [theme.breakpoints.up("sm")]: {
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
  },
}));

const ScrollWrapper = ({
  children,
  hidden,
}: {
  children: ReactNode;
  hidden: boolean;
}) => {
  if (hidden) {
    return (
      <Box sx={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}>
        {children}
      </Box>
    );
  } else {
    return (
      <PerfectScrollbar
        options={{ wheelPropagation: false, suppressScrollX: true }}
      >
        {children}
      </PerfectScrollbar>
    );
  }
};

const MailLog = (props: MailLogType) => {
  // ** Props
  const {
    store,
    query,
    hidden,
    lgAbove,
    dispatch,
    setQuery,
    direction,
    routeParams,
    labelColors,
    getCurrentMail,
    mailDetailsOpen,
    handleSelectMail,
    setMailDetailsOpen,
    handleSelectAllMail,
    handleLeftSidebarToggle,
    selectedCategory,
    selectedGroup,
    isFetching,
  } = props;

  // ** State
  const [areAllMailsLoaded, setAreAllMailsLoaded] = useState(false);

  // ** Vars
  const folders: MailFoldersArrType[] = [
    {
      name: "draft",
      icon: (
        <Box component="span" sx={{ mr: 2, display: "flex" }}>
          <Icon icon="mdi:pencil-outline" fontSize={20} />
        </Box>
      ),
    },
    {
      name: "spam",
      icon: (
        <Box component="span" sx={{ mr: 2, display: "flex" }}>
          <Icon icon="mdi:alert-octagon-outline" fontSize={20} />
        </Box>
      ),
    },
    {
      name: "trash",
      icon: (
        <Box component="span" sx={{ mr: 2, display: "flex" }}>
          <Icon icon="mdi:delete-outline" fontSize={20} />
        </Box>
      ),
    },
    {
      name: "inbox",
      icon: (
        <Box component="span" sx={{ mr: 2, display: "flex" }}>
          <Icon icon="mdi:email-outline" fontSize={20} />
        </Box>
      ),
    },
  ];

  const foldersConfig = {
    draft: {
      name: "draft",
      icon: (
        <Box component="span" sx={{ mr: 2, display: "flex" }}>
          <Icon icon="mdi:pencil-outline" fontSize={20} />
        </Box>
      ),
    },
    spam: {
      name: "spam",
      icon: (
        <Box component="span" sx={{ mr: 2, display: "flex" }}>
          <Icon icon="mdi:alert-octagon-outline" fontSize={20} />
        </Box>
      ),
    },
    trash: {
      name: "trash",
      icon: (
        <Box component="span" sx={{ mr: 2, display: "flex" }}>
          <Icon icon="mdi:delete-outline" fontSize={20} />
        </Box>
      ),
    },
    inbox: {
      name: "inbox",
      icon: (
        <Box component="span" sx={{ mr: 2, display: "flex" }}>
          <Icon icon="mdi:email-outline" fontSize={20} />
        </Box>
      ),
    },
  };

  useEffect(() => {
    setAreAllMailsLoaded(false);
  }, [routeParams.folder]);

  const foldersObj: MailFoldersObjType = {
    inbox: [foldersConfig.spam, foldersConfig.trash],
    sent: [foldersConfig.trash],
    draft: [foldersConfig.trash],
    spam: [foldersConfig.inbox, foldersConfig.trash],
    trash: [foldersConfig.inbox, foldersConfig.spam],
  };

  const handleMoveToTrash = (e: SyntheticEvent, id: number) => {
    e.stopPropagation();
    dispatch(moveToTrash({ id, folder: routeParams.folder! }));
    dispatch(handleSelectAllMail(false));
  };

  const handleMoveFromTrash = (e: SyntheticEvent, id: number) => {
    e.stopPropagation();
    dispatch(moveFromTrash({ id, folder: routeParams.folder! }));
    dispatch(handleSelectAllMail(false));
  };

  const handleClickLoad = async () => {
    if (store?.mails?.length && store.mails.length < 10) {
      setAreAllMailsLoaded(true);
      return;
    }

    const currentMailsLength = store?.mails?.length;

    await dispatch(
      paginateMail({
        offset: store?.mails?.length || 0,
        folder: routeParams.folder!,
        q: query,
        selectedCategory,
        selectedGroup,
      })
    );

    const newMailsLength = store?.mails?.length;

    // if (newMailsLength === currentMailsLength) {
    //   setAreAllMailsLoaded(true);
    // }
  };

  const handleStarMail = async (
    e: SyntheticEvent,
    id: number,
    isStarred: boolean
  ) => {
    e.stopPropagation();

    if (isStarred) {
      await dispatch(markAsUnStarred({ id, folder: routeParams.folder! }));
    }
    if (!isStarred) {
      await dispatch(markAsStarred(id));
    }
    dispatch(getCurrentMail(id));
  };

  const handleReadMail = (id: number | number[], value: boolean) => {
    const arr = Array.isArray(id) ? [...id] : [id];
    // dispatch(updateMail({ emailIds: arr, dataToUpdate: { isRead: value } }))
    dispatch(handleSelectAllMail(false));
  };

  const handleLabelUpdate = (id: number | number[], label: MailLabelType) => {
    const arr = Array.isArray(id) ? [...id] : [id];
    // dispatch(updateMailLabel({ emailIds: arr, label }))
  };

  const handleFolderUpdate = (
    id: number | number[],
    folder: MailFolderType
  ) => {
    const arr = Array.isArray(id) ? [...id] : [id];
    // dispatch(updateMail({ emailIds: arr, dataToUpdate: { folder } }))
  };

  const mailDetailsProps = {
    hidden,
    folders,
    dispatch,
    direction,
    foldersObj,
    // updateMail,
    routeParams,
    labelColors,
    handleStarMail,
    mailDetailsOpen,
    handleLabelUpdate,
    handleFolderUpdate,
    setMailDetailsOpen,
    mail: store && store.currentMail ? store.currentMail : null,
  };

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        position: "relative",
        "& .ps__rail-y": { zIndex: 5 },
      }}
    >
      <Box sx={{ height: "100%", backgroundColor: "background.paper" }}>
        <Box sx={{ px: 5, py: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Input
              value={query}
              placeholder="Rechercher un message"
              onChange={(e) => setQuery(e.target.value)}
              sx={{ width: "100%", "&:before, &:after": { display: "none" } }}
              startAdornment={
                <InputAdornment
                  position="start"
                  sx={{ color: "text.disabled" }}
                >
                  <Icon icon="mdi:magnify" fontSize="1.375rem" />
                </InputAdornment>
              }
            />
          </Box>
        </Box>

        <Divider sx={{ m: "0 !important" }} />
        <Box
          sx={{
            p: 0,
            position: "relative",
            overflowX: "hidden",
            height: "calc(100% - 7.25rem)",
          }}
        >
          {isFetching ? (
            <Backdrop
              open={true}
              sx={{
                zIndex: 5,
                position: "absolute",
                color: "common.white",
                backgroundColor: "action.disabledBackground",
              }}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : (
            <ScrollWrapper hidden={hidden}>
              {store && store.mails && store.mails.length ? (
                <List sx={{ p: 0 }}>
                  {store.mails.map((mail: MailType) => {
                    return (
                      <MailItem
                        key={mail.id}
                        sx={{
                          backgroundColor:
                            mail.isRead && routeParams.folder !== "sent"
                              ? "action.hover"
                              : "background.paper",
                        }}
                        onClick={() => {
                          setMailDetailsOpen(true);
                          dispatch(getCurrentMail(mail.id));
                          // dispatch(updateMail({ emailIds: [mail.id], dataToUpdate: { isRead: true } }))
                          setTimeout(() => {
                            dispatch(handleSelectAllMail(false));
                          }, 600);
                        }}
                      >
                        <Box
                          sx={{
                            mr: 4,
                            display: "flex",
                            overflow: "hidden",
                            alignItems: "center",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) =>
                              handleStarMail(e, mail.id, mail.isStarred)
                            }
                            sx={{
                              mr: { xs: 0, sm: 3 },
                              color:
                                routeParams.folder == "starred"
                                  ? "warning.main"
                                  : mail.isStarred
                                  ? "warning.main"
                                  : "text.secondary",
                              "& svg": {
                                display: { xs: "none", sm: "block" },
                              },
                            }}
                          >
                            <Icon icon="mdi:star-outline" />
                          </IconButton>
                          {routeParams.folder !== "sent" && (
                            <Avatar
                              alt={mail.sender.senderData?.firstName}
                              src={"./images/avatars/1.png"}
                              sx={{ mr: 3, width: "2rem", height: "2rem" }}
                            />
                          )}

                          <Box
                            sx={{
                              display: "flex",
                              overflow: "hidden",
                              flexDirection: { xs: "column", sm: "row" },
                              alignItems: { xs: "flex-start", sm: "center" },
                            }}
                          >
                            {routeParams.folder !== "sent" && (
                              <Typography
                                sx={{
                                  mr: 4,
                                  fontWeight: 500,
                                  whiteSpace: "nowrap",
                                  width: ["100%", "auto"],
                                  overflow: ["hidden", "unset"],
                                  textOverflow: ["ellipsis", "unset"],
                                }}
                              >
                                {mail.sender.senderData?.firstName}{" "}
                                {mail.sender.senderData?.lastName}
                              </Typography>
                            )}

                            <Typography
                              noWrap
                              variant="body2"
                              sx={{ width: "100%" }}
                            >
                              {mail.subject}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          className="mail-actions"
                          sx={{
                            display: "none",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          {routeParams && routeParams.folder !== "trash" ? (
                            <Tooltip placement="top" title="Supprimer Message">
                              <IconButton
                                onClick={(e) => {
                                  handleMoveToTrash(e, mail.id);
                                }}
                              >
                                <Icon icon="mdi:delete-outline" />
                              </IconButton>
                            </Tooltip>
                          ) : null}

                          {routeParams && routeParams.folder == "trash" ? (
                            <Tooltip placement="top" title="Restaurer Message">
                              <IconButton
                                onClick={(e) => {
                                  handleMoveFromTrash(e, mail.id);
                                }}
                              >
                                <Icon icon="material-symbols-light:restore-from-trash-outline-rounded" />
                              </IconButton>
                            </Tooltip>
                          ) : null}

                          {/* <Tooltip placement='top' title={mail.isRead ? 'Unread Mail' : 'Read Mail'}>
                          <IconButton
                            onClick={e => {
                              e.stopPropagation()
                              handleReadMail([mail.id], !mail.isRead)
                            }}
                          >
                            <Icon icon={mailReadToggleIcon} />
                          </IconButton>
                        </Tooltip> */}
                        </Box>
                        <Box
                          className="mail-info-right"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                          }}
                        >
                          {!!mail.parentMessage && (
                            <Typography
                              variant="caption"
                              sx={{
                                minWidth: "50px",
                                textAlign: "right",
                                whiteSpace: "nowrap",
                                color: "text.disabled",
                                marginRight: 2,
                              }}
                            >
                              <Icon icon="ic:baseline-reply" />
                            </Typography>
                          )}
                          {mail.attachments?.length ? (
                            <IconButton size="small">
                              <Icon icon="mdi:attachment" fontSize="1.375rem" />
                            </IconButton>
                          ) : null}

                          <Typography
                            variant="caption"
                            sx={{
                              minWidth: "50px",
                              textAlign: "right",
                              whiteSpace: "nowrap",
                              color: "text.disabled",
                            }}
                          >
                            {new Date(mail.createdAt).toLocaleTimeString(
                              "fr-FR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </Typography>
                        </Box>
                      </MailItem>
                    );
                  })}
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      onClick={() => handleClickLoad()}
                      disabled={areAllMailsLoaded}
                    >
                      Charger plus
                    </Button>
                  </Box>
                </List>
              ) : (
                <Box
                  sx={{
                    mt: 6,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    "& svg": { mr: 2 },
                  }}
                >
                  <Icon icon="mdi:alert-circle-outline" fontSize={20} />
                  <Typography>Aucun e-mail trouvé</Typography>
                </Box>
              )}
            </ScrollWrapper>
          )}
        </Box>
      </Box>

      {/* @ts-ignore */}
      <MailDetails {...mailDetailsProps} />
    </Box>
  );
};

export default MailLog;
