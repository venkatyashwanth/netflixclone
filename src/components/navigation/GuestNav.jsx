"use client";
import Link from "next/link";
import styles from "@/styles/components/GuestNav.module.scss";

export default function GuestNav() {
  return (
    <header className={styles.guestNav}>
      <div className={styles.logo}>Netflix</div>
      <nav className={styles.nav}>
        <Link href="/login" className={styles.signIn}>
          Sign In
        </Link>
        <select className={styles.languageSelect}>
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>
      </nav>
    </header>
  );
}
