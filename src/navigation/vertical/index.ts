// ** Type import
import { VerticalNavItemsType } from "src/@core/layouts/types";

const navigation = (): VerticalNavItemsType => {
  return [
    {
      path: "/apps/utilisateurs",
      action: "manage",
      subject: "user",
      title: "Utilisateurs",
      icon: "mdi:user",
    },
    {
      path: "/apps/administrateurs",
      action: "manage",
      subject: "administrator",
      title: "Administrateurs",
      icon: "mdi:account-cog",
    },
    {
      path: "/apps/directeurs",
      action: "manage",
      subject: "director",
      title: "Directeurs",
      icon: "mdi:account-tie",
    },
    {
      path: "/apps/enseignants",
      action: "manage",
      subject: "enseignants",
      title: "Enseignants",
      icon: "mdi:teacher",
    },
    {
      path: "/apps/etudiants",
      action: "manage",
      subject: "étudiants",
      title: "Étudients",
      icon: "mdi:school",
    },
    {
      path: "/apps/parents",
      action: "manage",
      subject: "parents",
      title: "Parents",
      icon: "mdi:account-child",
    },
    {
      path: "/apps/mail",
      title: "Messages",
      icon: "mdi:email",
    },
    {
      path: "/apps/classes",
      action: "manage",
      subject: "classes",
      title: "Classes",
      icon: "mdi:account-group",
    },
    {
      "path": "/apps/niveaux",
      "action": "manage",
      "subject": "niveaux",
      "title": "Niveaux",
      "icon": "mdi:school-outline"
    },    
  ];
};

export default navigation;
