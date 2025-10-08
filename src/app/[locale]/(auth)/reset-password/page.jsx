"use client";
import { confirmPasswordReset } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/Auth.module.scss";
import { auth } from "@/lib/firebase";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [globalError, setGlobalError] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState({ password: false, confirm: false });
    const [showToolTip, setShowToolTip] = useState({ password: false, confirm: false });
    const [formData, setFormData] = useState({
        resetpswrd: "",
        cnfrmresetpswrd: ""
    });
    const [oobCode, setOobCode] = useState('');
    const searchParams = useSearchParams();

    const passwordTooltipRef = useRef(null);
    const tooltipContentRef = useRef(null);

    // Refs for form fields
    const passwordInputRef = useRef(null);
    const confirmPasswordInputRef = useRef(null);

    useEffect(() => {
        // Get the oobCode from URL parameters
        const code = searchParams.get('oobCode');
        if (code) {
            setOobCode(code);
        } else {
            setGlobalError('Invalid or expired reset link');
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const validate = () => {
        const { resetpswrd, cnfrmresetpswrd } = formData;
        const errs = {};
        // Password validation with detailed rules
        if (!resetpswrd) {
            errs.resetpswrd = "Password is required";
        } else {
            const passwordErrors = [];

            if (resetpswrd.length < 6) {
                passwordErrors.push("At least 6 characters");
            }
            if (!/[A-Z]/.test(resetpswrd)) {
                passwordErrors.push("One uppercase letter");
            }
            if (!/[a-z]/.test(resetpswrd)) {
                passwordErrors.push("One lowercase letter");
            }
            if (!/\d/.test(resetpswrd)) {
                passwordErrors.push("One number");
            }
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(resetpswrd)) {
                passwordErrors.push("One special character");
            }

            if (passwordErrors.length > 0) {
                errs.resetpswrd = `Password must contain: ${passwordErrors.join(', ')}`;
            }
        }

        // Confirm password validation
        if (!cnfrmresetpswrd) {
            errs.cresetpswrd = "Please confirm your password";
        } else if (resetpswrd !== cnfrmresetpswrd) {
            errs.cresetpswrd = "Passwords do not match";
        }
        return errs;
    };

    const handleRequest = async (e) => {
        e.preventDefault();
        setErrors({});
        const { resetpswrd, cnfrmresetpswrd } = formData;

        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            console.log("got errors");

            // Focus on first field with error for better accessibility
            if (errs.resetpswrd) {
                passwordInputRef.current?.focus();
            } else if (errs.cresetpswrd) {
                confirmPasswordInputRef.current?.focus();
            }
            return;
        }

        try {
            setGlobalError('');
            setMessage('');
            setIsLoading(true);

            await confirmPasswordReset(auth, oobCode, resetpswrd);
            setMessage('Password reset successfully! Redirecting to login...');

            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (error) {
            setGlobalError('Failed to reset password: ' + error.message);
        }

    }

    // Keyboard event handlers
    const handleTooltipKeyDown = (e, field) => {
        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                setShowToolTip(prev => ({ ...prev, [field]: !prev[field] }));
                break;
            case 'Escape':
                setShowToolTip(prev => ({ ...prev, [field]: false }));
                break;
        }
    };

    // Close tooltips when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (passwordTooltipRef.current && !passwordTooltipRef.current.contains(event.target)) {
                setShowToolTip(prev => ({ ...prev, password: false }));
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!oobCode && !globalError) {
        return (
            <div>
                <div>Loading...</div>
            </div>
        );
    }

    const passwordRules = [
        "At least 6 characters",
        "One uppercase letter",
        "One lowercase letter",
        "One number",
        "One special character"
    ];

    // Generate tooltip content as a single string for screen readers
    const getTooltipContent = () => {
        return `Password Requirements: ${passwordRules.join(', ')}`;
    };

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
                <h1>Reset Password</h1>
                {/* Live region for announcing errors to screen readers */}
                <div
                    aria-live="assertive"
                    aria-atomic="true"
                    className={styles.srOnly}
                >
                    {getErrorAnnouncement()}
                </div>
                <form className={styles.authForm} onSubmit={handleRequest}>
                    {/* New Password */}
                    <div className={styles.inputWrp}>
                        <div className={styles.labelWithTooltip}>
                            <label htmlFor="resetpswrd">New Password</label>
                            <div
                                ref={passwordTooltipRef}
                                className={styles.tooltipIcon}
                                onMouseEnter={() => setShowToolTip(prev => ({ ...prev, password: true }))}
                                onMouseLeave={() => setShowToolTip(prev => ({ ...prev, password: false }))}
                                onClick={() => setShowToolTip(prev => ({ ...prev, password: !prev.password }))}
                                onKeyDown={(e) => handleTooltipKeyDown(e, 'password')}
                                tabIndex={0}
                                role="button"
                                aria-label="Show password requirements"
                                aria-expanded={showToolTip.password}
                                aria-controls="password-tooltip"
                                aria-describedby={showToolTip.password ? "password-tooltip-content" : undefined}
                            >
                                <img src="/infoicn.svg" alt="icn" />
                                {/* Hidden content for screen readers */}
                                <div
                                    id="password-tooltip-content"
                                    aria-live="polite"
                                    aria-atomic="true"
                                    className={styles.srOnly}
                                >
                                    {showToolTip.password && getTooltipContent()}
                                </div>
                                {showToolTip.password && (
                                    <div
                                        id="password-tooltip"
                                        className={styles.tooltip}
                                        role="tooltip"
                                        ref={tooltipContentRef}
                                    >
                                        <h4>Password Requirements:</h4>
                                        <ul>
                                            {passwordRules.map((rule, index) => (
                                                <li key={index}>{rule}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                        <input
                            type={show.password ? "text" : "password"}
                            id="resetpswrd"
                            name="resetpswrd"
                            value={formData.resetpswrd}
                            onChange={handleChange}
                            placeholder="Enter New Password"
                            ref={passwordInputRef}
                            aria-describedby={errors.password ? "password-error" : undefined}
                            aria-invalid={!!errors.password}
                        />
                        <button
                            type="button"
                            onClick={() => setShow((s) => ({ ...s, password: !s.password }))}
                            className={styles.pwtglbtn}
                            aria-pressed={show.password}
                            aria-label={show.password ? "Hide password" : "Show password"}
                        >
                            {show.password ? (
                                <img src="/closeeye.svg" alt="Hide password" />
                            ) : (
                                <img src="/openeye.svg" alt="Show password" />
                            )}
                        </button>
                        {errors.resetpswrd && (
                            <span
                                id="password-error"
                                className={styles.errorText}
                                role="alert"
                                aria-live="polite"
                            >
                                {errors.resetpswrd}
                            </span>
                        )}
                    </div>
                    {/* Confirm New Password */}
                    <div className={styles.inputWrp}>
                        <label htmlFor="cnfrmresetpswrd">Confirm Password</label>
                        <input
                            type={show.confirm ? "text" : "password"}
                            id="cnfrmresetpswrd"
                            name="cnfrmresetpswrd"
                            value={formData.cnfrmresetpswrd}
                            onChange={handleChange}
                            placeholder="Confirm New Password"
                            ref={confirmPasswordInputRef}
                            aria-describedby={errors.cpassword ? "confirm-password-error" : undefined}
                            aria-invalid={!!errors.cpassword}
                        />
                        <button
                            type="button"
                            onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                            className={styles.pwtglbtn}
                            aria-pressed={show.confirm}
                            aria-label={show.confirm ? "Hide password" : "Show password"}
                        >
                            {show.confirm ? (
                                <img src="/closeeye.svg" alt="Hide password" />
                            ) : (
                                <img src="/openeye.svg" alt="Show password" />
                            )}
                        </button>
                        {errors.cresetpswrd && (
                            <span
                                id="confirm-password-error"
                                className={styles.errorText}
                                role="alert"
                                aria-live="polite"
                            >
                                {errors.cresetpswrd}
                            </span>
                        )}
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className={styles.frmSbmt}
                        disabled={isLoading}
                    >
                        {isLoading ? "Resetting Password..." : "Reset Password"}
                    </button>
                </form>
                {message && (
                    <div className={styles.authText}>
                        {message}
                    </div>
                )}

                {globalError && (
                    <div className={styles.authText}>
                        {globalError}
                    </div>
                )}
            </div>
        </div>
    )
}