"use client";
import Link from "next/link";
import styles from "@/styles/components/Auth.module.scss";

export default function LoginPage() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1>Login</h1>
        <form className={styles.authForm}>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button className={styles.btnPrimary} type="submit">
            Sign In
          </button>
        </form>
        <p className={styles.authText}>
          Don’t have an account?{" "}
          <Link href="/signup" className={styles.authLink}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
