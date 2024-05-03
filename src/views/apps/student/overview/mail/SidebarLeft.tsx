// ** React Imports
import { ElementType, ReactNode } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItem, { ListItemProps } from "@mui/material/ListItem";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Third Party Imports
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Custom Components Imports
import CustomBadge from "src/@core/components/mui/badge";

// ** Types
import { CustomBadgeProps } from "src/@core/components/mui/badge/types";
import {
  MailFolderType,
  MailLabelType,
  MailSidebarType,
} from "src/types/apps/mailTypes";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import Image from "next/image";
import { HOST } from "src/store/constants/hostname";
import { Avatar } from "@mui/material";
import { CategoryType } from "src/types/apps/categoryTypes";
import { GroupType } from "src/types/apps/groupTypes";
import { useRouter } from "next/router";

// ** Styled Components
const ListItemStyled = styled(ListItem)<
  ListItemProps & { component?: ElementType; href: string }
>(({ theme }) => ({
  borderLeftWidth: "3px",
  borderLeftStyle: "solid",
  padding: theme.spacing(0, 5),
  marginBottom: theme.spacing(1),
}));

const ListBadge = styled(CustomBadge)<CustomBadgeProps>(() => ({
  "& .MuiBadge-badge": {
    height: "18px",
    minWidth: "18px",
    transform: "none",
    position: "relative",
    transformOrigin: "none",
  },
}));

const SidebarLeft = (props: MailSidebarType) => {
  // ** Props
  const {
    store,
    hidden,
    lgAbove,
    dispatch,
    leftSidebarOpen,
    leftSidebarWidth,
    toggleComposeOpen,
    setMailDetailsOpen,
    handleSelectAllMail,
    handleLeftSidebarToggle,
    selectedCategory,
    setSelectedCategory,
    selectedGroup,
    setSelectedGroup,
    setIsFetching,
  } = props;

  const router = useRouter();
  const { params } = router.query;
  const userId = params ? params[1] : null;
  const id = params ? params[2] : null;

  const categoryStore = useSelector((state: RootState) => state.categories);
  const groupStore = useSelector((state: RootState) => state.groups);

  const RenderBadge = (
    folder: "inbox" | "spam",
    color:
      | "default"
      | "primary"
      | "secondary"
      | "success"
      | "error"
      | "warning"
      | "info"
  ) => {
    if (store && store.mailMeta && store.mailMeta[folder] > 0) {
      return (
        <ListBadge
          skin="light"
          color={color}
          sx={{ ml: 2 }}
          badgeContent={store.mailMeta[folder]}
        />
      );
    } else {
      return null;
    }
  };

  const handleActiveItem = (
    type: "folder" | "label",
    value: MailFolderType | MailLabelType
  ) => {
    if (store && store.filter[type] !== value) {
      return false;
    } else {
      return true;
    }
  };

  const handleListItemClick = (folder: string) => {
    if (store.filter.folder === folder) {
      return;
    }

    setIsFetching(true);
    setMailDetailsOpen(false);
    setTimeout(() => dispatch(handleSelectAllMail(false)), 50);
    handleLeftSidebarToggle();
  };

  const handleCategoryClick = (e: any, id: number) => {
    e.preventDefault();

    if (selectedCategory == id) {
      setSelectedCategory(0);
    } else {
      setSelectedCategory(id);
    }
  };

  const handleGroupeClick = (e: any, id: number) => {
    e.preventDefault();

    if (selectedGroup == id) {
      setSelectedGroup(0);
    } else {
      setSelectedGroup(id);
    }
  };

  const activeInboxCondition =
    store &&
    handleActiveItem("folder", "inbox") &&
    store.filter.folder === "inbox";

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
    <Drawer
      open={leftSidebarOpen}
      onClose={handleLeftSidebarToggle}
      variant={lgAbove ? "permanent" : "temporary"}
      ModalProps={{
        disablePortal: true,
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        zIndex: 9,
        display: "block",
        position: lgAbove ? "static" : "absolute",
        "& .MuiDrawer-paper": {
          boxShadow: "none",
          width: leftSidebarWidth,
          zIndex: lgAbove ? 2 : "drawer",
          position: lgAbove ? "static" : "absolute",
        },
        "& .MuiBackdrop-root": {
          position: "absolute",
        },
      }}
    >
      <ScrollWrapper>
        <Box sx={{ pt: 0, overflowY: "hidden" }}>
          <List component="div">
            <ListItemStyled
              component={Link}
              href={`/apps/eleves/overview/inbox/${userId}/${id}`}
              onClick={handleListItemClick.bind(null, "inbox")}
              sx={{
                borderLeftColor: activeInboxCondition
                  ? "primary.main"
                  : "transparent",
              }}
            >
              <ListItemIcon
                sx={{
                  color: activeInboxCondition
                    ? "primary.main"
                    : "text.secondary",
                }}
              >
                <Icon icon="mdi:email-outline" />
              </ListItemIcon>
              <ListItemText
                primary="Boîte de réception"
                primaryTypographyProps={{
                  noWrap: true,
                  sx: {
                    fontWeight: 500,
                    ...(activeInboxCondition && { color: "primary.main" }),
                  },
                }}
              />
              {RenderBadge("inbox", "primary")}
            </ListItemStyled>
            <ListItemStyled
              component={Link}
              href={`/apps/eleves/overview/sent/${userId}/${id}`}
              onClick={handleListItemClick.bind(null, "sent")}
              sx={{
                borderLeftColor: handleActiveItem("folder", "sent")
                  ? "primary.main"
                  : "transparent",
              }}
            >
              <ListItemIcon
                sx={{
                  color: handleActiveItem("folder", "sent")
                    ? "primary.main"
                    : "text.secondary",
                }}
              >
                <Icon icon="mdi:send-outline" />
              </ListItemIcon>
              <ListItemText
                primary="Envoyés"
                primaryTypographyProps={{
                  noWrap: true,
                  sx: {
                    fontWeight: 500,
                    ...(handleActiveItem("folder", "sent") && {
                      color: "primary.main",
                    }),
                  },
                }}
              />
            </ListItemStyled>
          </List>
          <Typography
            component="h6"
            variant="caption"
            sx={{
              mx: 6,
              mt: 4,
              mb: 0,
              color: "text.disabled",
              letterSpacing: "0.21px",
              textTransform: "uppercase",
            }}
          >
            Groupes
          </Typography>
          <List component="div">
            {groupStore.data.map((group: GroupType) => {
              return (
                <ListItemStyled
                  key={group.id}
                  component={Link}
                  onClick={(e) => handleGroupeClick(e, group.id)}
                  href="#"
                  sx={{
                    borderLeftColor:
                      selectedGroup == group.id
                        ? "primary.main"
                        : "transparent",
                    marginBottom: "10px",
                  }}
                >
                  <Avatar
                    src={`${HOST}/uploads/groups/${group.imagePath}`}
                    alt={group.name}
                    style={{
                      borderRadius: "5px",
                      marginRight: "10px",
                    }}
                  />
                  <ListItemText
                    primary={group.name}
                    primaryTypographyProps={{
                      noWrap: true,
                      sx: {
                        fontWeight: 500,
                        ...(selectedGroup == group.id && {
                          color: "primary.main",
                        }),
                      },
                    }}
                  />
                </ListItemStyled>
              );
            })}
          </List>
          <Typography
            component="h6"
            variant="caption"
            sx={{
              mx: 6,
              mt: 4,
              mb: 0,
              color: "text.disabled",
              letterSpacing: "0.21px",
              textTransform: "uppercase",
            }}
          >
            Catégories
          </Typography>
          <List component="div">
            {categoryStore.data.map((category: CategoryType) => {
              return (
                <ListItemStyled
                  key={category.id}
                  component={Link}
                  onClick={(e) => handleCategoryClick(e, category.id)}
                  href="#"
                  sx={{
                    borderLeftColor:
                      selectedCategory == category.id
                        ? "primary.main"
                        : "transparent",
                    marginBottom: "10px",
                  }}
                >
                  <Avatar
                    src={`${HOST}/uploads/categories-images/${category.imagepath}`}
                    alt={category.name}
                    style={{
                      borderRadius: "5px",
                      marginRight: "10px",
                    }}
                  />
                  <ListItemText
                    primary={category.name}
                    primaryTypographyProps={{
                      noWrap: true,
                      sx: {
                        fontWeight: 500,
                        ...(selectedCategory == category.id && {
                          color: "primary.main",
                        }),
                      },
                    }}
                  />
                </ListItemStyled>
              );
            })}
          </List>
        </Box>
      </ScrollWrapper>
    </Drawer>
  );
};

export default SidebarLeft;
