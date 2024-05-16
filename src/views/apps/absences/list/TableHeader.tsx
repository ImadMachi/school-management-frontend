// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
// import { CSVLink } from "react-csv";

// ** Icon Imports
import Icon from "src/@core/components/icon";

interface TableHeaderProps {
  value: string;
  toggle: () => void;
  handleFilter: (val: string) => void;
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, toggle, value } = props;
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);

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
      <div></div>
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
            toggle();
          }}
          variant="contained"
        >
          Ajouter Absence
        </Button>
      </Box>
      {/* <AddAbsenceDrawer
        open={addUserOpen}
        toggle={toggleAddUserDrawer}
        absentToEdit={absentToEdit}
      /> */}
    </Box>
  );
};

export default TableHeader;
