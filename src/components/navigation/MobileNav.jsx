import styles from "@/styles/components/Navigation.module.scss"

export default function MobileNav({ isAuthenticated }) {
  return (
    <>
      <header className={styles.mobileHeader}>
        <div className={styles.logo}>Netflix</div>
      </header>

      <nav className={styles.mobileNav}>
        {isAuthenticated ? (
          <>
            <button>🏠</button>
            <button>🔍</button>
            <button>📺</button>
            <button>👤</button>
          </>
        ) : (
          <>
            <button>🌐</button>
            <button>🔑 Sign In</button>
          </>
        )}
      </nav>
    </>
  );
}
