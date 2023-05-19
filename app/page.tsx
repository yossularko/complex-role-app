import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import styles from './page.module.css'

export default async function Home() {
  const cookieStore = cookies();
  const jwt_refresh = cookieStore.get("jwt_refresh");

  if (!jwt_refresh) {
    redirect("/auth/login");
  } else {
    redirect("/dashboard");
  }
}
