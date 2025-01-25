export interface JwtPayload {
  sub: string; // user id
  username: string;
  isAdmin: boolean;
}
