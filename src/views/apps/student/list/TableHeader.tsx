// ** MUI Imports
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";

// ** Icon Imports
import Icon from "src/@core/components/icon";
import { importStudents } from "src/store/apps/students";

interface TableHeaderProps {
  value: string;
  toggle: () => void;
  handleFilter: (val: string) => void;
}
interface TableHeaderProps {
  value: string;
  toggle: () => void;
  handleFilter: (val: string) => void;
  // generateCSVData: () => any;
}
const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, toggle, value } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file && file.name.endsWith(".csv")) {
      setErrorMessage(null);
      setIsLoading(true);
      await dispatch(importStudents(file) as any);
      setIsLoading(false);
    } else {
      setErrorMessage("Veuillez importer un fichier CSV");
    }
  };

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
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Button
          onClick={handleButtonClick}
          variant="outlined"
          color="secondary"
          startIcon={<Icon icon="lets-icons:import" />}
          disabled={isLoading}
        >
          Importer
        </Button>
        {errorMessage && (
          <Typography mx={4} my={0} color="error">
            {errorMessage}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small"
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder="Rechercher élèves"
          onChange={(e) => handleFilter(e.target.value)}
        />

        <Button sx={{ mb: 2 }} onClick={toggle} variant="contained">
          Ajouter élèves
        </Button>
      </Box>
    </Box>
  );
};

export default TableHeader;
