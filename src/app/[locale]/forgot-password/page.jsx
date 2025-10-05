"use client";
import { useAuth } from "@/contexts/Authcontext";
import { Link } from "@/i18n/navigation";
import styles from "@/styles/components/Auth.module.scss";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

// export const metadata= {
//   title: 'Reset Password - Netflix Clone',
//   description: 'reset your Netflix Clone password',
// };

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        verifyEmail: ""
    });
    // Refs for form fields
    const emailInputRef = useRef(null);

    const { resetPassword } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const validate = () => {
        const { verifyEmail } = formData;
        const errs = {};
        if (!verifyEmail || !/\S+@\S+\.\S+/.test(verifyEmail)) errs.email = "Invalid Email";

        return errs;
    }

    const handleRequest = async (e) => {
        e.preventDefault();
        setErrors({});
        const { verifyEmail } = formData;
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            console.log("got errors");
            setIsLoading(false);

            // Focus on first field with error for better accessibility
            if (errs.email) {
                emailInputRef.current?.focus();
            }
            return;
        }

        try {
            setErrors({});
            setMessage("");
            setIsLoading(true);
            await resetPassword(verifyEmail);
            setMessage('Check your email for further instructions');

            // Optional: Redirect after success
            setTimeout(() => {
                router.push('/login');
            }, 3000);

        } catch (error) {
            console.log("error: ", error.message);
        }
        setIsLoading(false);
    }

    // Live region for announcing errors
    const getErrorAnnouncement = () => {
        const errorMessages = Object.values(errors).filter(error => error);
        if (errorMessages.length > 0) {
            return `Form errors: ${errorMessages.join('. ')}`;
        }
        return "";
    };
    return (
        <div className={styles.authContainer}>
            <div className={`${styles.authBox} ${styles.reset}`}>
                <h1>Recover Password</h1>
                {/* Live region for announcing errors to screen readers */}
                <div
                    aria-live="assertive"
                    aria-atomic="true"
                    className={styles.srOnly}
                >
                    {getErrorAnnouncement()}
                </div>
                <form className={styles.authForm} onSubmit={handleRequest} noValidate>
                    {/* Email Field */}
                    <div className={styles.inputWrp}>
                        <label htmlFor="verifemail">Email</label>
                        <input
                            id="verifemail"
                            ref={emailInputRef}
                            type="email"
                            name="verifyEmail"
                            value={formData.verifyEmail}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            aria-describedby={errors.email ? "email-error" : undefined}
                            aria-invalid={!!errors.email}
                        />
                        {
                            errors.email && (
                                <span
                                    id="email-error"
                                    className={styles.errorText}
                                    role="alert"
                                    aria-live="polite"
                                >
                                    {errors.email}
                                </span>
                            )
                        }
                    </div>
                    {/* Submit button */}
                    <button
                        type="submit"
                        className={styles.frmSbmt}
                        disabled={isLoading}
                    >
                        {isLoading ? "submitting..." : "submit"}
                    </button>
                    {
                        message && (
                            <span
                                className={styles.errorText}
                            >
                                {message}
                            </span>
                        )
                    }
                </form>
                <p className={styles.authText}>
                    <Link href="/login" className={styles.authLink}>
                        Back To Login
                    </Link>
                </p>
            </div>
        </div>
    )
}