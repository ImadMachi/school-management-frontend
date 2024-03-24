// ** Type import
import { VerticalNavItemsType } from "src/@core/layouts/types";

const navigation = (): VerticalNavItemsType => {
  return [
    {
      action: "manage",
      subject: "user",
      title: "Utilisateurs",
      icon: "mdi:users",
      children: [
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
      ],
    },
    {
      action: "manage",
      title: "Ecoles",
      icon: "mdi:school",
      children: [
        {
          path: "/apps/cycles",
          title: "Les Cycles",
        },
        {
          path: "/apps/niveaux",
          title: "Les Niveaux",
        },
        {
          path: "/apps/classes",
          title: "Les Classes",
        },
      ],
    },
    {
      path: "/apps/mail",
      title: "Messages",
      icon: "mdi:email",
    },
    {
      path: "/apps/mail-parametres",
      title: "Paramètres de messagerie",
      icon: "mdi:email-edit",
    },
  ];
};

export default navigation;
