import { refreshToken } from "@/shared/utils/fetchApi";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import styles from './page.module.css'

export default async function Home() {
  const cookieStore = cookies();
  const jwt_auth = cookieStore.get("jwt_auth");
  const jwt_refresh = cookieStore.get("jwt_refresh");

  if (!jwt_refresh) {
    redirect("/auth/login");
  } else {
    if (!jwt_auth) {
      const dataRefresh = {
        refresh_token: jwt_refresh.value,
      };

      await refreshToken(dataRefresh)
        .then(() => {
          redirect("/dashboard");
        })
        .catch((err) => {
          console.log("error refresh: ", err);
          redirect("/auth/login");
        });
    } else {
      redirect("/dashboard");
    }
  }
}
