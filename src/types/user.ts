export type UserType = {
  firstName: string,
  lastName: string,
  username: string,
  roles: string[],
  image?: string,
  [key: string]: unknown,
}
