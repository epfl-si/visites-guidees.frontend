export type UserType = {
  firstName: string,
  lastName: string,
  username: string,
  isAdmin: boolean,
  isGuide: boolean,
  image?: string,
  [key: string]: any,
}

export type ResponseUserAPI = {
  sciper: string
  firstName: string,
  lastName: string,
}