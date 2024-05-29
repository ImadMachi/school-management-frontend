// ** Type import
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VerticalNavItemsType } from "src/@core/layouts/types";
import { RootState } from "src/store";
import { fetchMails } from "src/store/apps/mail";

const navigation = (): VerticalNavItemsType => {
  const dispatch = useDispatch();

  const newRecipientCount = useSelector((state: RootState) => state.mail.newRecipientCount);

  useEffect(() => {
    dispatch(fetchMails({
      q: "",
      folder: "inbox",
      selectedCategory: 0,
      selectedGroup: 0,
    }) as any);
  }, [dispatch]);


  return [
    {
      action: "manage",
      subject: "user",
      title: "Gestion des utilisateurs",
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
          path: "/apps/eleves",
          action: "manage",
          subject: "Élèves",
          title: "Élèves",
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
          path: "/apps/agents",
          action: "manage",
          subject: "agents",
          title: "Agents",
          icon: "mdi:support",
        },
      ],
    },
    {
      action: "manage",
      title: "Niveaux",
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
        {
          path: "/apps/matieres",
          title: "Les Matières",
        },
      ],
    },
    {
      path: "/apps/mail",
      title: "Messages",
      icon: "mdi:email",
      action: "read",
      subject: "mail",
      badgeContent: newRecipientCount > 0 ? newRecipientCount.toString() : undefined,
      badgeColor: 'error',
    },
    {
      path: "/apps/mail-parametres",
      title: "Paramètres de messagerie",
      icon: "mdi:email-edit",
    },
    {
      path: "/apps/absences",
      title: "Gestion des absences",
      icon: "mdi:calendar-remove",
    },
  ];
};

export default navigation;
