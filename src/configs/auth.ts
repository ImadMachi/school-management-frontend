// export default {
//   meEndpoint: '/auth/me',
//   loginEndpoint: '/jwt/login',
//   registerEndpoint: '/jwt/register',
//   storageTokenKeyName: 'accessToken',
//   onTokenExpiration: 'refreshToken' // logout | refreshToken
// }

export default {
  meEndpoint: 'http://localhost:8000/auth/profile',
  loginEndpoint: 'http://localhost:8000/auth/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
