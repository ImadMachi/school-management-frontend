import MailSettings from "src/views/apps/mail-parametres/mail-settings";

export type MailSettingTabType = "category" | "template" | "group";

const MailSettingsTab = ({ tab }: { tab: MailSettingTabType }) => {
  return <MailSettings tab={tab} />;
};

export default MailSettingsTab;
