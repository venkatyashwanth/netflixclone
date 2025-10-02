"use client";

import { Link } from "@/i18n/navigation";
import styles from "@/styles/components/Auth.module.scss";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

export default function SignupClient() {
    const t = useTranslations("Signup");
    const [formData, setFormData] = useState({
        username: "",
        useremail: "",
        password: "",
        confirmpassword: "",
    });
    const [errors, setErrors] = useState({});
    const [show, setShow] = useState({ password: false, confirm: false });
    const [showToolTip, setShowToolTip] = useState({ password: false, confirm: false });
    const passwordTooltipRef = useRef(null);
    const tooltipContentRef = useRef(null);

    // Refs for form fields
    const nameInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const confirmPasswordInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: "" }));
        }
    };

    const validate = () => {
        const { username, useremail, password, confirmpassword } = formData;
        const errs = {};
        // Name Validation
        if (!username.trim() || username.trim().length < 2) errs.name = "Name must be at least 2 characters.";
        // Email Validation
        if (!useremail || !/\S+@\S+\.\S+/.test(useremail)) errs.email = "Invalid Email";

        // Password validation with detailed rules
        if (!password) {
            errs.password = "Password is required";
        } else {
            const passwordErrors = [];

            if (password.length < 6) {
                passwordErrors.push("At least 6 characters");
            }
            if (!/[A-Z]/.test(password)) {
                passwordErrors.push("One uppercase letter");
            }
            if (!/[a-z]/.test(password)) {
                passwordErrors.push("One lowercase letter");
            }
            if (!/\d/.test(password)) {
                passwordErrors.push("One number");
            }
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
                passwordErrors.push("One special character");
            }

            if (passwordErrors.length > 0) {
                errs.password = `Password must contain: ${passwordErrors.join(', ')}`;
            }
        }

        // Confirm password validation
        if (!confirmpassword) {
            errs.cpassword = "Please confirm your password";
        } else if (password !== confirmpassword) {
            errs.cpassword = "Passwords do not match";
        }
        return errs;
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            console.log("got errors");

            // Focus on first field with error for better accessibility
            if (errs.name) {
                nameInputRef.current?.focus();
            } else if (errs.email) {
                emailInputRef.current?.focus();
            } else if (errs.password) {
                passwordInputRef.current?.focus();
            } else if (errs.cpassword) {
                confirmPasswordInputRef.current?.focus();
            }
            return;
        }

        console.log(formData);
    };

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
            <div className={styles.authBox}>
                <h1>{t("title")}</h1>
                {/* Live region for announcing errors to screen readers */}
                <div
                    aria-live="assertive"
                    aria-atomic="true"
                    className={styles.srOnly}
                >
                    {getErrorAnnouncement()}
                </div>

                <form className={styles.authForm} onSubmit={handleSubmit} noValidate>
                    {/* Full Name field */}
                    <div className={styles.inputWrp}>
                        <label htmlFor="uname">Full Name</label>
                        <input
                            id="uname"
                            type="text"
                            name="username"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={t("placeholder.fullname")}
                            ref={nameInputRef}
                            aria-describedby={errors.name ? "name-error" : undefined}
                            aria-invalid={!!errors.name}
                        />
                        {errors.name && (
                            <span
                                id="name-error"
                                className={styles.errorText}
                                role="alert"
                                aria-live="polite"
                            >
                                {errors.name}
                            </span>
                        )}
                    </div>

                    {/* Email field */}
                    <div className={styles.inputWrp}>
                        <label htmlFor="uemail">Email</label>
                        <input
                            id="uemail"
                            type="email"
                            name="useremail"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t("placeholder.email")}
                            ref={emailInputRef}
                            aria-describedby={errors.email ? "email-error" : undefined}
                            aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                            <span
                                id="email-error"
                                className={styles.errorText}
                                role="alert"
                                aria-live="polite"
                            >
                                {errors.email}
                            </span>
                        )}
                    </div>

                    {/* Password field */}
                    <div className={styles.inputWrp}>
                        {/* <label htmlFor="upassword">Password</label> */}
                        <div className={styles.labelWithTooltip}>
                            <label htmlFor="upassword">Password</label>
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
                            id="upassword"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={t("placeholder.password")}
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
                        {errors.password && (
                            <span
                                id="password-error"
                                className={styles.errorText}
                                role="alert"
                                aria-live="polite"
                            >
                                {errors.password}
                            </span>
                        )}
                    </div>

                    {/* Confirm Password field */}
                    <div className={styles.inputWrp}>
                        <label htmlFor="ucpassword">Confirm Password</label>
                        <input
                            type={show.confirm ? "text" : "password"}
                            id="ucpassword"
                            name="confirmpassword"
                            value={formData.confirmpassword}
                            onChange={handleChange}
                            placeholder={t("placeholder.password")}
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
                        {errors.cpassword && (
                            <span
                                id="confirm-password-error"
                                className={styles.errorText}
                                role="alert"
                                aria-live="polite"
                            >
                                {errors.cpassword}
                            </span>
                        )}
                    </div>

                    {/* Submit button */}
                    <button className={styles.frmSbmt} type="submit">
                        {t("createaccount")}
                    </button>
                </form>
                {/* Login prompt */}
                <p className={styles.authText}>
                    {t("prompttext")}{" "}
                    <Link href="/login" className={styles.authLink}>
                        {t("login")}
                    </Link>
                </p>
            </div>
        </div>
    );
}