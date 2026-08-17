export type UserType = {
  firstName: string,
  lastName: string,
  groups: string[],
  username: string,
  isAdmin: boolean,
  isGuide: boolean,
  image?: string,
  [key: string]: any,
}

export type User = {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  username: string;
}
