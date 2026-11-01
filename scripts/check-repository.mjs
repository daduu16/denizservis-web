// Scan only Git's index. Never print matched secrets or inspect ignored env files.
import { execFileSync } from "node:child_process";

const files = execFileSync("git", ["ls-files", "--cached", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean);
const issues = [];
const forbidden = /(?:^|\/)(?:node_modules|\.next|out(?:\.previous-[^/]+)?|qa|\.vercel|\.wrangler|ServisPlus_Sekiller)(?:\/|$)|(?:^|\/)\.env(?:\..*)?$|\.(?:pem|key|p12|pfx|tsbuildinfo)$|(?:^|\/)(?:next-env\.d\.ts|ServisPlus_Texniki_Tapsiriq\.md)$/;
const secretPatterns = [
  ["private key", /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/],
  ["GitHub token", /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/],
  ["AWS access key", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ["Resend key", /\bre_[A-Za-z0-9_]{24,}\b/],
  ["credential in URL", /https?:\/\/[^\s/:]+:[^\s/@]+@/],
];
for (const file of files) {
  if (file !== ".env.example" && forbidden.test(file)) issues.push(`${file}: generated or private file must not be tracked`);
  const content = execFileSync("git", ["show", `:${file}`], { maxBuffer: 110 * 1024 * 1024 });
  if (content.length > 100 * 1024 * 1024) issues.push(`${file}: exceeds GitHub's regular file limit`);
  if (content.includes(0)) continue;
  const text = content.toString("utf8");
  for (const [name, pattern] of secretPatterns) if (pattern.test(text)) issues.push(`${file}: possible ${name}; value redacted`);
  if (file === ".env.example" && /^[ \t]*(?:RESEND_API_KEY|BOOKING_TO_EMAIL|BOOKING_FROM_EMAIL)[ \t]*=[ \t]*\S/m.test(text)) issues.push(`${file}: server credential placeholders must stay empty`);
}
if (!files.length) issues.push("No tracked/staged files found; stage the intended source before checking.");
if (issues.length) {
  console.error(issues.join("\n"));
  process.exitCode = 1;
} else console.log(`Repository safety check passed for ${files.length} staged/tracked files. Pattern checks are not a guarantee against every possible secret.`);
