// ** React Imports
import { SyntheticEvent, useEffect, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import DialogTitle from "@mui/material/DialogTitle";
import CardContent from "@mui/material/CardContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TableContainer from "@mui/material/TableContainer";
import FormControlLabel from "@mui/material/FormControlLabel";

// ** Icon Imports
import Icon from "src/@core/components/icon";
import { fetchData } from "src/store/apps/subjects";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { useSelector } from "react-redux";
import SidebarAddSubject from "./AddSubjectDrawrer";
import { SubjectType } from "src/types/apps/subjectTypes";

interface CardDataType {
  title: string;
  totalStudents: number;
}

const rolesArr: string[] = [
  "User Management",
  "Content Management",
  "Disputes Management",
  "Database Management",
  "Financial Management",
  "Reporting",
  "API Control",
  "Repository Management",
  "Payroll",
];

const SubjectCards = () => {
  // ** States
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);
  const [subjectToEdit, setSubjectToEdit] = useState<SubjectType | null>(null);

  // ** Dispatch
  const dispatch = useDispatch<AppDispatch>();

  // ** Stores
  const subjectsStore = useSelector((state: RootState) => state.subjects);

  useEffect(() => {
    dispatch(fetchData() as any);
  }, [dispatch]);

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

  const renderCards = () =>
    subjectsStore.data.map((item, index: number) => (
      <Grid item xs={12} sm={6} lg={4} key={index}>
        <Card>
          <CardContent>
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2">{`${item.teachers.length} Enseignants`}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="h6">{item.name}</Typography>
                <Typography
                  href="/"
                  variant="body2"
                  component={Link}
                  sx={{ color: "primary.main" }}
                  onClick={(e: SyntheticEvent) => {
                    e.preventDefault();
                    setSubjectToEdit(item);
                    setAddUserOpen(true);
                  }}
                >
                  Modifier la Matière
                </Typography>
              </Box>
              {/* <IconButton sx={{ color: "text.secondary" }}>
                <Typography variant="body2">{item.schoolYear}</Typography>
              </IconButton> */}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ));

  return (
    <Grid container spacing={6} className="match-height">
      {renderCards()}
      <Grid item xs={12} sm={6} lg={4}>
        <Card sx={{ cursor: "pointer" }}>
          <Grid
            container
            sx={{
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CardContent>
              <Box sx={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  sx={{ mb: 3, whiteSpace: "nowrap" }}
                  onClick={() => {
                    setAddUserOpen(true);
                    setSubjectToEdit(null);
                  }}
                >
                  Ajouter Matière
                </Button>
              </Box>
            </CardContent>
          </Grid>
        </Card>
      </Grid>
      <SidebarAddSubject
        open={addUserOpen}
        toggle={toggleAddUserDrawer}
        subjectToEdit={subjectToEdit}
      />
    </Grid>
  );
};

export default SubjectCards;
