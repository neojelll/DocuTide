export interface UserGetPayload {
  userId: string;
  email: string;
  emailConfirmed: boolean;
  username: string;
  hashPassword: string;
  biography?: string;
  role?: string;
  notificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}
