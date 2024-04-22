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
import { mapRoleToFrench } from "src/pages/apps/utilisateurs";
// ** Types

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
                À PROPOS
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
                    Rôle : {item.user?.role && mapRoleToFrench(item.user.role)}
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
                    Tél : {item.user?.userData.phoneNumber}
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
