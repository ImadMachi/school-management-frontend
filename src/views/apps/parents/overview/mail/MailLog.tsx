// ** React Imports
import { Fragment, useState, SyntheticEvent, ReactNode } from "react";

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
import { OptionType } from "src/@core/components/option-menu/types";
import { fetchMails } from "src/store/apps/mail";
import { fetchMailsByUserId } from "src/store/apps/mail";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

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
    updateMail,
    routeParams,
    labelColors,
    paginateMail,
    getCurrentMail,
    mailDetailsOpen,
    updateMailLabel,
    handleSelectMail,
    setMailDetailsOpen,
    handleSelectAllMail,
    handleLeftSidebarToggle,
  } = props;

  // ** State
  const [refresh, setRefresh] = useState<boolean>(false);

  // ** Store Vars
  const userId = useSelector(
    (state: RootState) => state.parents.selectedUserId
  ); // Replace 'yourSlice' with the name of your slice

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

  const foldersObj: MailFoldersObjType = {
    inbox: [foldersConfig.spam, foldersConfig.trash],
    sent: [foldersConfig.trash],
    draft: [foldersConfig.trash],
    spam: [foldersConfig.inbox, foldersConfig.trash],
    trash: [foldersConfig.inbox, foldersConfig.spam],
  };

  const handleMoveToTrash = () => {
    // dispatch(updateMail({ emailIds: store.selectedMails, dataToUpdate: { folder: 'trash' } }))
    dispatch(handleSelectAllMail(false));
  };

  const handleStarMail = (e: SyntheticEvent, id: number, value: boolean) => {
    e.stopPropagation();
    // dispatch(updateMail({ emailIds: [id], dataToUpdate: { isStarred: value } }))
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

  // const handleRefreshMailsClick = () => {
  //   // @ts-ignore
  //   dispatch(fetchMails({ q: query || '', folder: routeParams.folder, label: routeParams.label }))
  //   setRefresh(true)
  //   setTimeout(() => setRefresh(false), 1000)
  // }

  const handleRefreshMailsClick = () => {
    // Use the new function to fetch mails by userId and specify the folder
    dispatch(
      fetchMailsByUserId({
        q: query || "",
        folder: routeParams.folder as MailFolderType,
        label: routeParams.label as MailLabelType,
        userId: userId,
      })
    ); // Replace 'inbox' with the desired folder
    setRefresh(true);
    setTimeout(() => setRefresh(false), 1000);
  };
  const handleFoldersMenu = () => {
    const array: OptionType[] = [];

    if (
      routeParams &&
      routeParams.folder &&
      !routeParams.label &&
      foldersObj[routeParams.folder]
    ) {
      foldersObj[routeParams.folder].map((folder: MailFoldersArrType) => {
        array.length = 0;
        array.push({
          icon: folder.icon,
          text: (
            <Typography sx={{ textTransform: "capitalize" }}>
              {folder.name}
            </Typography>
          ),
          menuItemProps: {
            onClick: () => {
              handleFolderUpdate(store.selectedMails, folder.name);
              dispatch(handleSelectAllMail(false));
            },
          },
        });
      });
    } else if (routeParams && routeParams.label) {
      folders.map((folder: MailFoldersArrType) => {
        array.length = 0;
        array.push({
          icon: folder.icon,
          text: (
            <Typography sx={{ textTransform: "capitalize" }}>
              {folder.name}
            </Typography>
          ),
          menuItemProps: {
            onClick: () => {
              handleFolderUpdate(store.selectedMails, folder.name);
              dispatch(handleSelectAllMail(false));
            },
          },
        });
      });
    } else {
      foldersObj["inbox"].map((folder: MailFoldersArrType) => {
        array.length = 0;
        array.push({
          icon: folder.icon,
          text: (
            <Typography sx={{ textTransform: "capitalize" }}>
              {folder.name}
            </Typography>
          ),
          menuItemProps: {
            onClick: () => {
              handleFolderUpdate(store.selectedMails, folder.name);
              dispatch(handleSelectAllMail(false));
            },
          },
        });
      });
    }

    return array;
  };

  const renderMailLabels = (arr: MailLabelType[]) => {
    return arr.map((label: MailLabelType, index: number) => {
      return (
        <Box
          key={index}
          component="span"
          sx={{ mr: 3, color: `${labelColors[label]}.main` }}
        >
          <Icon icon="mdi:circle" fontSize="0.625rem" />
        </Box>
      );
    });
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
    paginateMail,
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
            {lgAbove ? null : (
              <IconButton
                onClick={handleLeftSidebarToggle}
                sx={{ mr: 1, ml: -2 }}
              >
                <Icon icon="mdi:menu" fontSize={20} />
              </IconButton>
            )}
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
        <Box sx={{ py: 2, px: { xs: 2.5, sm: 5 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton size="small" onClick={handleRefreshMailsClick}>
                <Icon icon="mdi:reload" fontSize="1.375rem" />
              </IconButton>
            </Box>
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
          <ScrollWrapper hidden={hidden}>
            {store && store.mails && store.mails.length && userId != null ? (
              <List sx={{ p: 0 }}>
                {store.mails.map((mail: MailType) => {
                  return (
                    <MailItem
                      key={mail.id}
                      sx={{ backgroundColor: "background.paper" }}
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
                            handleStarMail(e, mail.id, !mail.isStarred)
                          }
                          sx={{
                            mr: { xs: 0, sm: 3 },
                            color: mail.isStarred
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
                          <Tooltip placement="top" title="Delete Mail">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                // dispatch(updateMail({ emailIds: [mail.id], dataToUpdate: { folder: 'trash' } }))
                              }}
                            >
                              <Icon icon="mdi:delete-outline" />
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
                        {/* <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>{renderMailLabels(mail.labels)}</Box>  */}
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
                            "en-US",
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
          <Backdrop
            open={refresh}
            onClick={() => setRefresh(false)}
            sx={{
              zIndex: 5,
              position: "absolute",
              color: "common.white",
              backgroundColor: "action.disabledBackground",
            }}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Box>
      </Box>

      {/* @ts-ignore */}
      <MailDetails {...mailDetailsProps} />
    </Box>
  );
};

export default MailLog;
