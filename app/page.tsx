import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import styles from './page.module.css'

export default function Home() {
  const cookieStore = cookies();
  const jwt_auth = cookieStore.get("jwt_auth");

  if (jwt_auth) {
    redirect("/dashboard");
  } else {
    redirect("/auth/login");
  }
}
