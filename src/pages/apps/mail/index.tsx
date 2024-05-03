import EmailAppLayout from "src/views/apps/mail/Mail";

const EmailApp = () => <EmailAppLayout folder="inbox" />;

EmailApp.contentHeightFixed = true;

EmailApp.acl = {
  action: "read",
  subject: "mail",
};

export default EmailApp;
