import styles from "@/styles/components/Navigation.module.scss";

export default function DesktopNav({ isAuthenticated }) {
  return (
    <div className={styles.desktopNav}>
      <div className={styles.logo}>
        <img src="/logo.svg" alt="logo" width={"100px"} color={"rgb(229, 9, 20)"} fill={"currentcolor"}/>
        {/* Netflix */}
        </div>
      <nav>
        {isAuthenticated ? (
          <>
            <a href="#">Home</a>
            <a href="#">TV Shows</a>
            <a href="#">Movies</a>
            <a href="#">My List</a>
          </>
        ) : (
          <>
            <a href="#">Sign In</a>
            <a href="#">🌐 Language</a>
          </>
        )}
      </nav>
      {isAuthenticated && (
        <div className={styles.actions}>
          <button>🔔</button>
          <button>👤</button>
        </div>
      )}
    </div>
  );
}
