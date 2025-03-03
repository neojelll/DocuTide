export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  bio?: string;
  role?: string;
}
