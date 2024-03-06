// ** React Imports
import { Fragment, useState, ReactNode, useEffect } from "react";

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
import { Chip } from "@mui/material";
import Link from "next/link";
import { HOST } from "src/store/constants/hostname";
import { markAsRead } from "src/store/apps/mail";

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

  // ** Effects
  useEffect(() => {
    if (mail) {
      if (!mail.isRead) {
        dispatch(markAsRead(mail.id));
      }
    }
  }, [mail]);

  const handleMoveToTrash = () => {
    // dispatch(updateMail({ emailIds: [mail.id], dataToUpdate: { folder: 'trash' } }))
    setMailDetailsOpen(false);
  };

  const handleReadMail = () => {
    // dispatch(updateMail({ emailIds: [mail.id], dataToUpdate: { isRead: false } }))
    setMailDetailsOpen(false);
  };
  const handleLabelsMenu = () => {
    const array: OptionType[] = [];
    Object.entries(labelColors).map(([key, value]: string[]) => {
      array.push({
        text: (
          <Typography sx={{ textTransform: "capitalize" }}>{key}</Typography>
        ),
        icon: (
          <Box component="span" sx={{ mr: 2, color: `${value}.main` }}>
            <Icon icon="mdi:circle" fontSize="0.75rem" />
          </Box>
        ),
        menuItemProps: {
          onClick: () => {
            handleLabelUpdate([mail.id], key as MailLabelType);
            setMailDetailsOpen(false);
          },
        },
      });
    });

    return array;
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
              handleFolderUpdate(mail.id, folder.name);
              setMailDetailsOpen(false);
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
              handleFolderUpdate(mail.id, folder.name);
              setMailDetailsOpen(false);
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
              handleFolderUpdate(mail.id, folder.name);
              setMailDetailsOpen(false);
            },
          },
        });
      });
    }

    return array;
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
                  {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {mail.labels && mail.labels.length
                      ? mail.labels.map((label: MailLabelType) => {
                          return (
                            <CustomChip
                              key={label}
                              size='small'
                              skin='light'
                              label={label}
                              color={labelColors[label] as ThemeColor}
                              sx={{ textTransform: 'capitalize', '&:not(:last-of-type)': { mr: 2 } }}
                            />
                          )
                        })
                      : null}
                  </Box> */}
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
                {routeParams && routeParams.folder !== "trash" ? (
                  <>
                    <IconButton size="small" onClick={handleMoveToTrash}>
                      <Icon icon="mdi:delete-outline" fontSize="1.375rem" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) =>
                        handleStarMail(e, mail.id, mail.isStarred)
                      }
                      sx={{
                        ...(mail.isStarred ? { color: "warning.main" } : {}),
                      }}
                    >
                      <Icon icon="mdi:star-outline" fontSize="1.375rem" />
                    </IconButton>
                  </>
                ) : null}
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
                            mail.sender.senderData.firstName +
                            " " +
                            mail.sender.senderData.lastName
                          }
                          // src={mail.sender?.senderData?.avatar}
                          sx={{ width: "2.375rem", height: "2.375rem", mr: 3 }}
                        />
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography sx={{ fontWeight: 500 }}>
                            {mail.sender.senderData.firstName +
                              " " +
                              mail.sender.senderData.lastName}
                          </Typography>
                          <Typography variant="body2">
                            {mail.sender.email}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
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
