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
import { fetchData } from "src/store/apps/groups";
import { HOST } from "src/store/constants/hostname";
import AddGroupDrawer from "./AddGroupDrawer";

const TabGroup = () => {
  // ** States
  const [addGroupOpen, setAddGroupOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState<any>(null);

  // ** Dispatch
  const dispatch = useDispatch();
  const groupsStore = useSelector((state: RootState) => state.groups);

  // ** Functions
  const toggleAddGroupDrawer = () => {
    setAddGroupOpen(!addGroupOpen);
    setGroupToEdit(null);
  };

  useEffect(() => {
    dispatch(fetchData() as any);
  }, []);

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography variant="h5" sx={{ marginBottom: 4 }}>
            Liste des Groupes
          </Typography>
        }
      />
      <Grid item xs={12} sx={{ mb: 4 }}>
        <Grid container spacing={6} className="match-height">
          {groupsStore.data.map((group) => {
            return (
              <Grid xs={12} sm={6} lg={4} key={group.id} sx={{ padding: 2 }}>
                <Card>
                  <CardMedia
                    sx={{ height: "14.5625rem" }}
                    image={`${HOST}/uploads/groups/${group.imagePath}`}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {group.name}
                    </Typography>
                    <Typography variant="body2">{group.description}</Typography>
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
                          setAddGroupOpen(true);
                          setGroupToEdit(group);
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
                        setAddGroupOpen(true);
                        setGroupToEdit(null);
                      }}
                    >
                      Ajouter Groupe
                    </Button>
                  </Box>
                </CardContent>
              </Grid>
            </Card>
          </Grid>
          <AddGroupDrawer
            open={addGroupOpen}
            toggle={toggleAddGroupDrawer}
            groupToEdit={groupToEdit}
            setGroupToEdit={setGroupToEdit}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TabGroup;
