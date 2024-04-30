// ** React Imports
import { useState, useEffect } from "react";

// ** Redux Imports
import { useDispatch, useSelector } from "react-redux";

// ** MUI Imports
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// ** Hooks
import { useSettings } from "src/@core/hooks/useSettings";

// ** Types
import { RootState, AppDispatch } from "src/store";
import {
  MailLayoutType,
  MailLabelColors,
  MailLabelType,
} from "src/types/apps/mailTypes";

// ** Email App Component Imports
import MailLog from "./MailLog";
import SidebarLeft from "./SidebarLeft";

// ** Actions
import {
  fetchMails,
  paginateMail,
  getCurrentMail,
  handleSelectMail,
  handleSelectAllMail,
  fetchMailsByUserId,
} from "src/store/apps/mail";
import { useRouter } from "next/router";

// ** Variables
const labelColors: MailLabelColors = {
  private: "error",
  personal: "success",
  company: "primary",
  important: "warning",
};

const EmailAppLayout = ({ folder, label }: MailLayoutType) => {
  // ** States
  const [query, setQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [composeOpen, setComposeOpen] = useState<boolean>(false);
  const [mailDetailsOpen, setMailDetailsOpen] = useState<boolean>(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // ** Hooks
  const theme = useTheme();
  const { settings } = useSettings();
  const dispatch = useDispatch<AppDispatch>();
  const lgAbove = useMediaQuery(theme.breakpoints.up("lg"));
  const mdAbove = useMediaQuery(theme.breakpoints.up("md"));
  const smAbove = useMediaQuery(theme.breakpoints.up("sm"));
  const hidden = useMediaQuery(theme.breakpoints.down("lg"));

  const store = useSelector((state: RootState) => state.mail);

  // ** Vars
  const leftSidebarWidth = 260;
  const { skin, direction } = settings;
  const composePopupWidth = mdAbove ? 754 : smAbove ? 520 : "100%";
  const routeParams = {
    label: label || "",
    folder: folder || "inbox",
  };
  const router = useRouter();
  const { params } = router.query;
  const userId = params ? params[1] : null;
  const id = params ? params[2] : null;

  useEffect(() => {
    (async () => {
      await dispatch(
        fetchMailsByUserId({
          q: query || "",
          folder: routeParams.folder,
          label: routeParams.label as MailLabelType,
          selectedCategory,
          selectedGroup,
          userId: userId ? +userId : null,
        }) as any
      );
      setIsFetching(false);
    })();
  }, [
    dispatch,
    query,
    routeParams.folder,
    routeParams.label,
    selectedCategory,
    selectedGroup,
  ]);

  const toggleComposeOpen = () => setComposeOpen(!composeOpen);
  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        borderRadius: 1,
        overflow: "hidden",
        position: "relative",
        boxShadow: skin === "bordered" ? 0 : 6,
        ...(skin === "bordered" && {
          border: `1px solid ${theme.palette.divider}`,
        }),
      }}
    >
      <SidebarLeft
        store={store}
        hidden={hidden}
        lgAbove={lgAbove}
        dispatch={dispatch}
        mailDetailsOpen={mailDetailsOpen}
        leftSidebarOpen={leftSidebarOpen}
        leftSidebarWidth={leftSidebarWidth}
        toggleComposeOpen={toggleComposeOpen}
        setMailDetailsOpen={setMailDetailsOpen}
        handleSelectAllMail={handleSelectAllMail}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        setIsFetching={setIsFetching}
      />
      <MailLog
        query={query}
        store={store}
        hidden={hidden}
        lgAbove={lgAbove}
        dispatch={dispatch}
        setQuery={setQuery}
        direction={direction}
        routeParams={routeParams}
        labelColors={labelColors}
        paginateMail={paginateMail}
        getCurrentMail={getCurrentMail}
        mailDetailsOpen={mailDetailsOpen}
        handleSelectMail={handleSelectMail}
        setMailDetailsOpen={setMailDetailsOpen}
        handleSelectAllMail={handleSelectAllMail}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        selectedCategory={selectedCategory}
        selectedGroup={selectedGroup}
        isFetching={isFetching}
      />
    </Box>
  );
};

export default EmailAppLayout;
