// ** MUI Components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

// ** Icon Imports
import Icon from "src/@core/components/icon";
import { UserType } from "src/types/apps/UserType";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useAuth } from "src/hooks/useAuth";
// ** Types

interface Props {
  about: UserType[];
  contacts: UserType[];
}

const renderList = (arr: UserType[]) => {
  if (arr && arr.length) {
    return arr.map((item, index) => {
      return (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            "&:not(:last-of-type)": { mb: 4 },
            "& svg": { color: "text.secondary" },
          }}
        >
          <PersonOutlineIcon />
          <Typography sx={{ mx: 2, fontWeight: 600, color: "text.secondary" }}>
            Nom complet : {item.userData.firstName} {item.userData.lastName}
          </Typography>{" "}
          <StarBorderIcon />
          <Typography sx={{ mx: 2, fontWeight: 600, color: "text.secondary" }}>
            Role : {item.role}
          </Typography>{" "}
          <Icon icon="PersonOutlineIcon" />
        </Box>
      );
    });
  } else {
    return null;
  }
};

const AboutOverivew = () => {
  const item = useAuth();

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="caption"
                sx={{
                  mb: 2,
                  display: "block",
                  textTransform: "uppercase",
                }}
              >
                About
              </Typography>
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    "& svg": { color: "text.secondary", marginRight: "8px" },
                  }}
                >
                  <PersonOutlineIcon />
                  <Typography sx={{ fontWeight: 600, color: "text.secondary" }}>
                    Nom complet : {item.user?.userData.firstName}{" "}
                    {item.user?.userData.lastName}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    "& svg": { color: "text.secondary", marginRight: "8px" },
                  }}
                >
                  <StarBorderIcon />
                  <Typography sx={{ fontWeight: 600, color: "text.secondary" }}>
                    Role : {item.user?.role}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="caption"
                sx={{
                  mb: 2,
                  display: "block",
                  textTransform: "uppercase",
                }}
              >
                Contacts
              </Typography>
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    "& svg": { color: "text.secondary", marginRight: "8px" },
                  }}
                >
                  <LocalPhoneOutlinedIcon />
                  <Typography sx={{ fontWeight: 600, color: "text.secondary" }}>
                    Tel : {item.user?.userData.phoneNumber}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    "& svg": { color: "text.secondary", marginRight: "8px" },
                  }}
                >
                  <EmailOutlinedIcon />
                  <Typography sx={{ fontWeight: 600, color: "text.secondary" }}>
                    Email : {item.user?.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AboutOverivew;
