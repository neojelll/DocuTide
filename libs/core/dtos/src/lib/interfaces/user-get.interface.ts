export interface UserGetPayload {
  userId: string;
  email: string;
  username: string;
  hashPassword: string;
  biography?: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}
