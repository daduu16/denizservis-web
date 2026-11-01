"use client";

import { T } from "@/components/LanguageProvider";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import styles from "./DeviceTypeSelect.module.css";

const options = [
  { value: "paltaryuyan", label: "Paltaryuyan" },
  { value: "qabyuyan", label: "Qabyuyan" },
] as const;

type Props = {
  value?: "paltaryuyan" | "qabyuyan";
  onChange: (value: "paltaryuyan" | "qabyuyan") => void;
  onBlur: () => void;
  inputRef?: (node: HTMLButtonElement | null) => void;
  error?: string;
  wide?: boolean;
};

export function DeviceTypeSelect({ value, onChange, onBlur, inputRef, error, wide }: Props) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [above, setAbove] = useState(false);
  const [active, setActive] = useState(-1);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  const show = (initial?: number) => {
    const rect = trigger.current?.getBoundingClientRect();
    setAbove(!!rect && window.innerHeight - rect.bottom < 230 && rect.top > 180);
    setActive(initial ?? options.findIndex((option) => option.value === value));
    setOpen(true);
  };

  const select = (index: number) => {
    onChange(options[index].value);
    setOpen(false);
    trigger.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        const step = event.key === "ArrowDown" ? 1 : -1;
        if (!open) show(value ? undefined : step === 1 ? 0 : options.length - 1);
        else setActive((index) => index < 0 ? (step === 1 ? 0 : options.length - 1) : (index + step + options.length) % options.length);
        break;
      }
      case "Home":
      case "End":
        if (open) { event.preventDefault(); setActive(event.key === "Home" ? 0 : options.length - 1); }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) select(Math.max(0, active));
        else show();
        break;
      case "Escape":
        if (open) { event.preventDefault(); event.stopPropagation(); setOpen(false); }
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div className={`field ${wide ? "field--wide" : ""}`}>
      <label className="field-label" id={`${id}-label`} htmlFor={`${id}-trigger`}><T>Cihaz növü</T><span aria-hidden="true"> *</span></label>
      <div ref={root} className={styles.root} onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) { setOpen(false); onBlur(); }
      }}>
        <button
          ref={(node) => { trigger.current = node; inputRef?.(node); }}
          id={`${id}-trigger`}
          type="button"
          role="combobox"
          className={`form-control ${styles.trigger}`}
          aria-labelledby={`${id}-label`}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? `${id}-list` : undefined}
          aria-activedescendant={open && active >= 0 ? `${id}-option-${active}` : undefined}
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          onClick={() => open ? setOpen(false) : show()}
          onKeyDown={handleKeyDown}
        >
          <span className={`${styles.value} ${!selected ? styles.placeholder : ""}`}>
            <T>{selected?.label ?? "Cihaz növünü seçin"}</T>
          </span>
          <ChevronDown size={19} aria-hidden="true" className={styles.chevron} />
        </button>
        {open && (
          <div className={`${styles.menu} ${above ? styles.above : ""}`} id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`}>
            {options.map((option, index) => (
              <button
                  key={option.value}
                  id={`${id}-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={value === option.value}
                  tabIndex={-1}
                  className={`${styles.option} ${active === index ? styles.active : ""}`}
                  onPointerMove={() => setActive(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => select(index)}
              >
                <span><T>{option.label}</T></span>
                {value === option.value && <Check size={19} className={styles.check} aria-hidden="true" />}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <span id={`${id}-error`} className="field-error" role="alert"><T>{error}</T></span>}
    </div>
  );
}
