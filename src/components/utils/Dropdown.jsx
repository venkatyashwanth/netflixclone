"use client";
import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { useParams} from "next/navigation";
import { usePathname,useRouter } from "@/i18n/navigation";
import styles from "@/styles/components/utils/Dropdown.module.scss";



export default function Dropdown({ label = "Open", items = [], onSelect = () => { } }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (
        !buttonRef.current?.contains(e.target) &&
        !listRef.current?.contains(e.target)
      ) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Reset active item when opening
  useEffect(() => {
    if (open) {
      setActiveIndex(0);
      // focus the first item after animation
      setTimeout(() => {
        listRef.current?.querySelector('[role="menuitem"]')?.focus();
      }, 120);
    } else {
      setActiveIndex(-1);
    }
  }, [open]);

  const normalized = items.map((it) =>
    typeof it === "string" ? { id: it, label: it } : it
  );

  function toggle() {
    setOpen((v) => !v);
  }

  function handleButtonKey(e) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  }

  function handleItemKey(e, idx) {
    if (e.key === "Escape") {
      setOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (idx + 1) % normalized.length;
      setActiveIndex(next);
      focusItem(next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (idx - 1 + normalized.length) % normalized.length;
      setActiveIndex(prev);
      focusItem(prev);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectItem(idx);
    }
  }

  function focusItem(index) {
    const children = listRef.current?.querySelectorAll('[role="menuitem"]');
    children?.[index]?.focus();
  }

  function selectItem(index) {
    const item = normalized[index];
    onSelect(item);
    setOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <div className={styles.dropdown}>
      <button
        ref={buttonRef}
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={handleButtonKey}
        type="button"
      >
        {label}
        <span className={styles.chev} aria-hidden>▾</span>
      </button>

      <div
        ref={listRef}
        className={`${styles.menu} ${open ? styles.open : ""}`}
        role="menu"
        aria-hidden={!open}
      >
        {normalized.map((item, idx) => (
          <div
            key={item.id}
            role="menuitem"
            tabIndex={open ? 0 : -1}
            className={`${styles.item} ${idx === activeIndex ? styles.active : ""}`}
            onKeyDown={(e) => handleItemKey(e, idx)}
            onClick={() => selectItem(idx)}
            onMouseEnter={() => setActiveIndex(idx)}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
