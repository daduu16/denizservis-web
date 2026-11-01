"use client";

import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";
import { useLanguage } from "./LanguageProvider";

export function LocalizedImage({ alt, ...props }: ComponentProps<typeof Image>) {
  const { t } = useLanguage();
  return <Image {...props} alt={t(alt)} />;
}

export function LocalizedLink(props: ComponentProps<typeof Link>) {
  const { t } = useLanguage();
  return <Link {...props} aria-label={props["aria-label"] ? t(props["aria-label"]) : undefined} title={props.title ? t(props.title) : undefined} />;
}

export function LocalizedAnchor(props: ComponentProps<"a">) {
  const { t } = useLanguage();
  return <a {...props} aria-label={props["aria-label"] ? t(props["aria-label"]) : undefined} title={props.title ? t(props.title) : undefined} />;
}

export function LocalizedNav(props: ComponentProps<"nav">) {
  const { t } = useLanguage();
  return <nav {...props} aria-label={props["aria-label"] ? t(props["aria-label"]) : undefined} />;
}

export function LocalizedGroup(props: ComponentProps<"div">) {
  const { t } = useLanguage();
  return <div {...props} aria-label={props["aria-label"] ? t(props["aria-label"]) : undefined} />;
}

export function LocalizedList(props: ComponentProps<"ul">) {
  const { t } = useLanguage();
  return <ul {...props} aria-label={props["aria-label"] ? t(props["aria-label"]) : undefined} />;
}

export function LocalizedAside(props: ComponentProps<"aside">) {
  const { t } = useLanguage();
  return <aside {...props} aria-label={props["aria-label"] ? t(props["aria-label"]) : undefined} />;
}

export function LocalizedInput(props: ComponentProps<"input">) {
  const { t } = useLanguage();
  return <input {...props} placeholder={props.placeholder ? t(props.placeholder) : undefined} />;
}

export function LocalizedTextarea(props: ComponentProps<"textarea">) {
  const { t } = useLanguage();
  return <textarea {...props} placeholder={props.placeholder ? t(props.placeholder) : undefined} />;
}
