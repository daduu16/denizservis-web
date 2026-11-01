<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## DənizServis Git workflow

- All development changes belong on `dev`, the default branch.
- Never commit or push directly to `prod`; release only through a `dev` → `prod` Pull Request with passing CI.
- Preserve history; no force pushes. Do not commit env files, credentials, generated builds, screenshots or original private briefs.
- Before publishing changes run `npm run check:repo`, lint, typecheck, tests, the normal build and static checks. See `GITHUB_WORKFLOW.md`.
