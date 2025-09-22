import styles from "@/styles/components/Navigation.module.scss"

export default function TabletNav({ isAuthenticated }) {
  return (
    <div className={styles.tabletNav}>
      <div className={styles.logo}>Netflix</div>
      <nav>
        {isAuthenticated ? (
          <>
            <a href="#">Home</a>
            <a href="#">Browse</a>
            <a href="#">My List</a>
          </>
        ) : (
          <>
            <a href="#">Sign In</a>
            <a href="#">🌐 Language</a>
          </>
        )}
      </nav>
      {isAuthenticated && <button className={styles.menuBtn}>☰</button>}
    </div>
  );
}
