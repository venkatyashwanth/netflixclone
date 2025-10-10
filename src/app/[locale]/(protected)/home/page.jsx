import BackgroundVideo from "@/components/backgroundVideo/BackgroundVideo";
import styles from "@/styles/components/HeroSection.module.scss";
const Home = () => {
    return (
        <>

            <section className={styles.mainSection}>
                <BackgroundVideo />
                test
            </section>
            <div style={{ height: "100px", width: "100px", color: "black" }}>
                more content
                {/* more content
                more content
                more content
                more content
                more content */}
            </div>
        </>
    )
}

export default Home;