// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { CSVLink } from "react-csv";

// ** Icon Imports
import Icon from "src/@core/components/icon";

interface TableHeaderProps {
  value: string;
  toggle: () => void;
  handleFilter: (val: string) => void;
  generateCSVData: () => any;
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, toggle, value } = props;

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
          placeholder="Rechercher Utilisateur"
          onChange={(e) => handleFilter(e.target.value)}
        />
        {/* 
        <Button sx={{ mb: 2 }} onClick={toggle} variant='contained'>
          Ajouter Administrateur
        </Button> */}
      </Box>
    </Box>
  );
};

export default TableHeader;
