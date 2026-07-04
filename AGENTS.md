<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:convex-setup -->
# Convex backend — configuratore page

The `/configuratore` page uses Convex as its database. To enable it:

1. Run `npx convex dev` in the project root — this creates a Convex dev deployment and generates the real `convex/_generated/` files (the current stubs are placeholders for the build to pass)
2. Set `NEXT_PUBLIC_CONVEX_URL` in `.env.local` (the `npx convex dev` output will provide this)
3. The real `convex/_generated/` files will have proper TypeScript types — the `as any` casts in configurator components can then be removed
4. To seed the database with products and options: run `npx convex run seed` after deployment is live
5. Set `RESEND_API_KEY` as a Convex env var: `npx convex env set RESEND_API_KEY <key>` for email notifications
6. The `convex/` directory and `src/components/configurator/` + `src/app/[locale]/configuratore/` are in sync — edit schema first, then regenerate types with `npx convex codegen`
<!-- END:convex-setup -->

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
