"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/BackgroundVideo.module.scss";

const BackgroundVideo = () => {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);
    useEffect(() => {
        const video = videoRef.current;

        // Only play video if it's visible (desktop)
        const playVideo = () => {
            if (video && window.innerWidth > 1024) {
                video.play().catch(error => {
                    console.log('Auto-play prevented:', error);
                })
            }
        }

        playVideo();

        // Optional: Handle window resize
        const handleResize = () => {
            if (video) {
                if (window.innerWidth <= 768) {
                    video.pause();
                } else {
                    playVideo();
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleVolume = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };
    return (
        <div className={styles.backgroundVideo}>
            <video
                className={styles.video}
                ref={videoRef}
                autoPlay
                muted
                loop
            >
                <source src="https://res.cloudinary.com/dc7msdklx/video/upload/v1758135554/movies/Product%20Demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className={styles.overlay}></div>
            <button
                className={styles.volumeButton}
                onClick={toggleVolume}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
                {isMuted ? "🔇" : "🔊"}
            </button>
        </div>
    )
}

export default BackgroundVideo