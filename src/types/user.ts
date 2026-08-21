export type UserType = {
  firstName: string,
  lastName: string,
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
export type ResponseUserAPI = {
  sciper: string
  firstName: string,
  lastName: string,
}
