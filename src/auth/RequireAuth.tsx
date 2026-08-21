import ErrorPage from "@/pages/Error";
import {type State, StateEnum} from "@epfl-si/react-appauth";
import { Outlet } from "react-router";

export const RequireAuth = ({ oidc }: { oidc: State }) => {
  if (oidc.state === StateEnum.InProgress) {
    return <div className="flex justify-center items-center h-full p-10">Chargement...</div>;
  }

  if (oidc.state !== StateEnum.LoggedIn) {
    return <ErrorPage errorCode={401} message="errors.unauthenticated.title"/>
  }

  return <Outlet />;
};
