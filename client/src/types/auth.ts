export interface LoginInput {
  email: string;
  password: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
