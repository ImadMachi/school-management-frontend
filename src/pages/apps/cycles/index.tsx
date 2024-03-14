// ** MUI Imports
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

// ** Custom Components Imports
import PageHeader from "src/@core/components/page-header";

// ** Components Imports
import RoleCards from "src/views/apps/cycles/CycleCards";

const CyclesComponent = () => {
  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant="h5">Liste des cycles</Typography>}
      />
      <Grid item xs={12} sx={{ mb: 4 }}>
        <RoleCards />
      </Grid>
    </Grid>
  );
};

export default CyclesComponent;
