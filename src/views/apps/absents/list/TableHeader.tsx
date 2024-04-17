// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { CSVLink } from "react-csv";
import AddAbsentDrawer from "src/views/apps/absents/list/AddAbsentDrawrer";

// ** Icon Imports
import Icon from "src/@core/components/icon";
import { AbsentsType } from "src/types/apps/absentsTypes";

interface TableHeaderProps {
  value: string;
  toggle: () => void;
  handleFilter: (val: string) => void;
  generateCSVData: () => any;
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, toggle, value } = props;
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);
  const [absentToEdit, setAbsentToEdit] = useState<AbsentsType | null>(null);
 
  const toggleAddUserDrawer = () => {setAddUserOpen(!addUserOpen)};

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <CSVLink data={props.generateCSVData()} filename={"absences.csv"}>
        <Button
          sx={{ mr: 4, mb: 2 }}
          color="secondary"
          variant="outlined"
          startIcon={<Icon icon="mdi:export-variant" fontSize={20} />}
        >
          Exporter
        </Button>
      </CSVLink>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small"
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder="Rechercher Absent"
          onChange={(e) => handleFilter(e.target.value)}
        />

        <Button
          sx={{ mb: 2 }}
          onClick={() => {
            setAddUserOpen(true);
            setAbsentToEdit(null);
          }}
          variant="contained"
        >
          Ajouter Absent
        </Button>
      </Box>
      <AddAbsentDrawer
        open={addUserOpen}
        toggle={toggleAddUserDrawer}
        absentToEdit={absentToEdit}
      />
    </Box>
  );
};

export default TableHeader;
