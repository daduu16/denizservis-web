import { siteConfig } from "@/config/site";
import { LocalizedAnchor, LocalizedNav } from "./LocalizedElements";

type Platform = (typeof siteConfig.socialLinks)[number]["icon"];

function SocialIcon({ platform }: { platform: Platform }) {
  if (platform === "instagram") return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
  if (platform === "youtube") return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M21.5 7.1a2.7 2.7 0 0 0-1.9-1.9C17.9 4.75 12 4.75 12 4.75s-5.9 0-7.6.45a2.7 2.7 0 0 0-1.9 1.9A28.4 28.4 0 0 0 2 12c0 1.65.16 3.29.5 4.9a2.7 2.7 0 0 0 1.9 1.9c1.7.45 7.6.45 7.6.45s5.9 0 7.6-.45a2.7 2.7 0 0 0 1.9-1.9c.34-1.61.5-3.25.5-4.9s-.16-3.29-.5-4.9Z" />
      <path d="m10 8.5 6 3.5-6 3.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.11-.01 2.17-.66 2.75-1.6.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z" />
    </svg>
  );
}

export function SocialLinks() {
  return (
    <LocalizedNav className="footer-socials" aria-label="Sosial şəbəkələr">
      {siteConfig.socialLinks.map(({ name, url, icon }) => (
        <LocalizedAnchor key={icon} className="footer-social-link" href={url} target="_blank" rel="noopener noreferrer" aria-label={`${name} — yeni pəncərədə açılır`} title={name}>
          <SocialIcon platform={icon} />
        </LocalizedAnchor>
      ))}
    </LocalizedNav>
  );
}
