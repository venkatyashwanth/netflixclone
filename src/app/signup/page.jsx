"use client";
import Link from "next/link";
import styles from "@/styles/components/Auth.module.scss";

export default function SignupPage() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1>Sign Up</h1>
        <form className={styles.authForm}>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button className={styles.btnPrimary} type="submit">
            Create Account
          </button>
        </form>
        <p className={styles.authText}>
          Already have an account?{" "}
          <Link href="/login" className={styles.authLink}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
