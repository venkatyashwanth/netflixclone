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

  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const wrapperRef = useRef(null); // ✅ wrap entire dropdown

  const locales = routing.locales;

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
    if (open && listRef.current) {
      const items = listRef.current.querySelectorAll("li");
      items[activeIndex]?.focus();
    }
  }, [open, activeIndex]);

  // ✅ Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if(open && 

        listRef.current &&
      !listRef.current.contains(e.target)
      )
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

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

      {/* Desktop dropdown */}
      {open && (
        <ul
          ref={listRef}
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

      {/* Mobile popup */}
      {open && (
        <div ref={wrapperRef} className={styles.mobilePopMenu} >
          <ul ref={listRef} role="listbox" tabIndex={-1}>
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
    </div>
  );
};

export default LocaleSwitcherSelect;
