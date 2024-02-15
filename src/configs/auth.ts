import { HOST } from "src/store/constants/hostname";

export default {
  meEndpoint: `${HOST}/auth/profile`,
  loginEndpoint: `${HOST}/auth/login`,
  registerEndpoint: "/jwt/register",
  storageTokenKeyName: "accessToken",
  onTokenExpiration: "logout", // logout | refreshToken
};
