export type UserType = {
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  roles: string[],
  image?: string,
}

export type ResponseUserAPI = {
  sciper: string
  firstName: string,
  lastName: string,
}