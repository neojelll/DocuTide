export interface UserGetPayload<T> {
  userId: string;
  email: string;
  username: string;
  hashPassword: string;
  biography?: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: T | string | Date | undefined;
}
