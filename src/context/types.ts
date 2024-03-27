export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type RegisterParams = {
  email: string
  username: string
  password: string
}

export type UserDataType = {
  id: number;
  email: string;
  isActive: boolean;
  role: string;
  profileImage?: string;
  userData: {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  };
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  accessToken: string
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
}
