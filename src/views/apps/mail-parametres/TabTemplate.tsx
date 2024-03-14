// ** MUI Imports
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import PageHeader from "src/@core/components/page-header";
import { RootState } from "src/store";
import { fetchData } from "src/store/apps/templates";
import { HOST } from "src/store/constants/hostname";
import AddTemplateDrawer from "./AddTemplateDrawer";
// import AddTemplateDrawer from "./AddTemplateDrawer";

const TabTemplate = () => {
  // ** States
  const [addTemplateOpen, setAddTemplateOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<any>(null);

  // ** Dispatch
  const dispatch = useDispatch();
  const templatesStore = useSelector((state: RootState) => state.templates);

  // ** Functions
  const toggleAddTemplateDrawer = () => {
    setAddTemplateOpen(!addTemplateOpen);
    setTemplateToEdit(null);
  };

  useEffect(() => {
    dispatch(fetchData() as any);
  }, []);

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography variant="h5" sx={{ marginBottom: 4 }}>
            Liste des Catégories
          </Typography>
        }
      />
      <Grid item xs={12} sx={{ mb: 4 }}>
        <Grid container spacing={6} className="match-height">
          {templatesStore.data.map((template) => {
            return (
              <Grid xs={12} sm={6} lg={4} key={template.id} sx={{ padding: 2 }}>
                <Card>
                  {/* <CardMedia
                    sx={{ height: "14.5625rem" }}
                    image={`${HOST}/uploads/templates-images/${template.imagepath}`}
                  /> */}
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {template.title}
                    </Typography>
                    <Typography variant="body2">
                      {template.description}
                    </Typography>
                  </CardContent>
                  <CardActions className="card-action-dense">
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        onClick={() => {
                          setAddTemplateOpen(true);
                          setTemplateToEdit(template);
                        }}
                      >
                        Modifier
                      </Button>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
          <Grid xs={12} sm={6} lg={4} sx={{ padding: 2 }}>
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
                        setAddTemplateOpen(true);
                        setTemplateToEdit(null);
                      }}
                    >
                      Ajouter Template
                    </Button>
                  </Box>
                </CardContent>
              </Grid>
            </Card>
          </Grid>
          <AddTemplateDrawer
            open={addTemplateOpen}
            toggle={toggleAddTemplateDrawer}
            templateToEdit={templateToEdit}
            setTemplateToEdit={setTemplateToEdit}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TabTemplate;
