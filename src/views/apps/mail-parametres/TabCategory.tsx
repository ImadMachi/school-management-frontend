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
import { fetchData } from "src/store/apps/categories";
import { HOST } from "src/store/constants/hostname";
import AddCategoryDrawer from "./AddCategoryDrawer";

const TabCategory = () => {
  // ** States
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<any>(null);

  // ** Dispatch
  const dispatch = useDispatch();
  const categoriesStore = useSelector((state: RootState) => state.categories);

  // ** Functions
  const toggleAddCategoryDrawer = () => {
    setAddCategoryOpen(!addCategoryOpen);
    setCategoryToEdit(null);
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
          {categoriesStore.data.map((category) => {
            return (
              <Grid xs={12} sm={6} lg={4} key={category.id} sx={{ padding: 2 }}>
                <Card>
                  <CardMedia
                    sx={{ height: "14.5625rem" }}
                    image={`${HOST}/uploads/categories-images/${category.imagepath}`}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {category.name}
                    </Typography>
                    <Typography variant="body2">
                      {category.description}
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
                          setAddCategoryOpen(true);
                          setCategoryToEdit(category);
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
                        setAddCategoryOpen(true);
                        setCategoryToEdit(null);
                      }}
                    >
                      Ajouter Catégorie
                    </Button>
                  </Box>
                </CardContent>
              </Grid>
            </Card>
          </Grid>
          <AddCategoryDrawer
            open={addCategoryOpen}
            toggle={toggleAddCategoryDrawer}
            categoryToEdit={categoryToEdit}
            setCategoryToEdit={setCategoryToEdit}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TabCategory;
