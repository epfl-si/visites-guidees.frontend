import ErrorPage from "@/pages/Error";
import { LoadingPage } from "@/pages/Loading";
import {type State, StateEnum} from "@epfl-si/react-appauth";
import { Outlet } from "react-router";

export const RequireAuth = ({ oidc }: { oidc: State }) => {
  if (oidc.state === StateEnum.InProgress) {
    return <LoadingPage/>;
  }

  if (oidc.state !== StateEnum.LoggedIn) {
    return <ErrorPage errorCode={401} message="errors.unauthenticated.title"/>
  }

  return <Outlet />;
};
