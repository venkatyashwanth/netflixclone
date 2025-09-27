"use client";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useState, useRef, useEffect } from "react";
import styles from "@/styles/components/utils/LocaleSwitcher.module.scss";

const LocaleSwitcherSelect = () => {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const buttonRef = useRef(null);
  const desktopDropdownRef = useRef(null);
  const mobilePopupRef = useRef(null);
  const mobileListRef = useRef(null); // ✅ New ref for the UL inside mobile popup

  const locales = routing.locales;

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const onSelectChange = (cur) => {
    setOpen(false);
    buttonRef.current?.focus();
    if (cur !== locale) {
      router.replace({ pathname, params }, { locale: cur });
    }
  };

  // Keyboard handling
  useEffect(() => {
    function handleKeyDown(e) {
      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % locales.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + locales.length) % locales.length);
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelectChange(locales[activeIndex]);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, activeIndex, locales, locale, pathname, params, router]);

  // Focus handling
  useEffect(() => {
    if (open) {
      const items = isMobile 
        ? mobileListRef.current?.querySelectorAll("li")
        : desktopDropdownRef.current?.querySelectorAll("li");
      items?.[activeIndex]?.focus();
    }
  }, [open, activeIndex, isMobile]);

  // ✅ Close on outside click - FIXED for mobile
  useEffect(() => {
    function handleClickOutside(e) {
      if (!open) return;
      
      if (isMobile) {
        // Mobile: close if click is outside the UL list (but on the dark background)
        // The mobilePopupRef is the dark overlay, mobileListRef is the white sheet
        if (mobilePopupRef.current && 
            mobileListRef.current && 
            !mobileListRef.current.contains(e.target)) {
          setOpen(false);
        }
      } else {
        // Desktop: close if click is outside both dropdown and button
        const isOutsideDropdown = desktopDropdownRef.current && 
                                 !desktopDropdownRef.current.contains(e.target);
        const isOutsideButton = buttonRef.current && 
                               !buttonRef.current.contains(e.target);
        
        if (isOutsideDropdown && isOutsideButton) {
          setOpen(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open, isMobile]);

  return (
    <div className={styles.dropdown}>
      <button
        ref={buttonRef}
        className={styles.dropbtn}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        🌐 <span className={styles.lang}>{t("locale", { locale })}</span>
        <span className={`${styles.caret} ${open ? styles.open : ""}`}></span>
      </button>

      {/* Render only ONE dropdown based on device */}
      {open && isMobile && (
        <div ref={mobilePopupRef} className={styles.mobilePopMenu}>
          <ul ref={mobileListRef} role="listbox" tabIndex={-1}> {/* ✅ Added ref here */}
            <span onClick={() => setOpen(false)} className={styles.clsbtn}></span>
            {locales.map((cur, idx) => (
              <li
                key={cur}
                role="option"
                aria-selected={cur === locale}
                tabIndex={-1}
                className={idx === activeIndex ? styles.activeOption : ""}
                onClick={() => onSelectChange(cur)}
              >
                {t("locale", { locale: cur })}
              </li>
            ))}
          </ul>
        </div>
      )}

      {open && !isMobile && (
        <ul
          ref={desktopDropdownRef}
          className={styles.dropdownContent}
          role="listbox"
          tabIndex={-1}
        >
          {locales.map((cur, idx) => (
            <li
              key={cur}
              role="option"
              aria-selected={cur === locale}
              tabIndex={-1}
              className={idx === activeIndex ? styles.activeOption : ""}
              onClick={() => onSelectChange(cur)}
            >
              {t("locale", { locale: cur })}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocaleSwitcherSelect;