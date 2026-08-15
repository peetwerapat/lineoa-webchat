# LINE OA Webchat

Next.js 16 (App Router) webchat console for a LINE Official Account. Customer
messages arrive through the LINE webhook, land in PostgreSQL, and are pushed to
every open console over SSE — no polling.

## Stack

| Layer         | Choice                                                                   |
| ------------- | ------------------------------------------------------------------------ |
| Framework     | Next.js 16 App Router, React 19                                          |
| UI            | Tailwind v4 + shadcn/ui (`src/components/ui/`)                           |
| Server state  | TanStack Query (`src/providers/QueryProvider.tsx`, `src/services/`)      |
| Client state  | Zustand (`src/features/chat/store/chatStore.ts`)                         |
| HTTP          | `fetch` wrapper (`src/lib/http.ts`) — no axios                           |
| DB            | Prisma 7 + PostgreSQL over `@prisma/adapter-pg` (`prisma/schema.prisma`) |
| LINE          | `@line/bot-sdk` (`src/infrastructure/line/`)                             |
| Realtime      | SSE (`src/app/api/chat/stream/route.ts`)                                 |
| Lint / format | ESLint flat config + Prettier, enforced by Husky                         |

## Architecture

The `src/` tree is layered, and every import points inward — `domain` knows
nothing about Prisma, LINE, or React.

```
src/
  domain/          entities, repository/gateway interfaces, value objects
  application/     use cases (orchestration) + entity → DTO mappers
  infrastructure/  Prisma repositories, LINE gateway, in-memory event bus
  app/api/         route handlers — parse the request, call a use case
  features/chat/   the console UI: components, hooks, store, utils
  services/        typed fetch + TanStack Query wrappers
```

`src/infrastructure/container.ts` wires the concrete implementations together
once and exports them as `container`; route handlers only ever touch that
object, so swapping a repository or the event bus never reaches the routes.

## Getting started

```bash
pnpm install
cp .env.example .env    # fill in DATABASE_URL and the LINE credentials
pnpm db:migrate         # create the schema
pnpm dev
```

Requires Node.js 22+ (`@line/bot-sdk` and the pinned pnpm both need it).

## Environment

| Variable                    | Purpose                                        |
| --------------------------- | ---------------------------------------------- |
| `DATABASE_URL`              | PostgreSQL connection string                   |
| `LINE_CHANNEL_ACCESS_TOKEN` | Messaging API token, used for push/reply       |
| `LINE_CHANNEL_SECRET`       | Verifies the `x-line-signature` webhook header |
| `NEXT_PUBLIC_APP_URL`       | Absolute base URL for server-side `fetch`      |

Server-side variables are read through `src/lib/env.ts`, which throws on a
missing value instead of failing later with `undefined`.

## LINE webhook

Point the LINE Developers Console at `https://<your-domain>/api/line/webhook`
and turn on "Use webhook". Locally, expose port 3000 with a tunnel
(`ngrok http 3000` or similar) — LINE only calls public HTTPS URLs.

Inbound events are signature-verified, deduplicated by `lineMessageId`, stored
with their raw payload, and published to the SSE bus. Non-text messages keep a
`[type]` placeholder as `content`; the original event stays in `payload` so the
UI can render the real thing — that is how customer stickers are shown, using
`stickerId` from the payload against the LINE sticker CDN.

## API

| Route                          | Method  | Does                                                 |
| ------------------------------ | ------- | ---------------------------------------------------- |
| `/api/line/webhook`            | `POST`  | Receives LINE events (signature-verified)            |
| `/api/customers`               | `GET`   | Customer list with unread counts + last message      |
| `/api/customers/[id]/messages` | `GET`   | Message history, paginated (`page`, `limit`)         |
| `/api/customers/[id]/messages` | `POST`  | Sends a message, pushes it to LINE                   |
| `/api/customers/[id]/read`     | `PATCH` | Clears the unread counter                            |
| `/api/chat/stream`             | `GET`   | SSE stream of `message.created` / `customer.updated` |

Responses share one envelope from `src/lib/apiResponse.ts` —
`{ statusCode, message, data }`, plus `meta` for paginated routes. Message
history defaults to 30 per page (max 100) and is returned oldest-first.

## Scripts

| Script             | Does                                                  |
| ------------------ | ----------------------------------------------------- |
| `pnpm dev`         | Dev server                                            |
| `pnpm build`       | Production build (`output: "standalone"`)             |
| `pnpm lint`        | ESLint (`lint:fix` to autofix)                        |
| `pnpm format`      | Prettier write (`format:check` to verify)             |
| `pnpm type-check`  | `next typegen` + `tsc --noEmit`                       |
| `pnpm db:migrate`  | Create and apply a migration (dev)                    |
| `pnpm db:deploy`   | Apply migrations (production)                         |
| `pnpm db:studio`   | Prisma Studio                                         |
| `pnpm db:generate` | Regenerate the client into `src/lib/generated/prisma` |

`pre-commit` runs lint-staged (ESLint + Prettier on staged files) then
`type-check`.

## Notes

- The realtime bus is in-process
  (`src/infrastructure/realtime/in-memory-chat-event.bus.ts`). Running more than
  one instance means a console connected to instance A misses events published
  on instance B — swap it for Redis pub/sub before scaling out.
- The console has no auth yet. Anyone who can reach it can read every
  conversation and send messages as the OA.
- Images, video, audio, and files still render as placeholders. Unlike stickers,
  their binaries need `GET /v2/bot/message/{messageId}/content` plus somewhere to
  store them.
- `src/lib/generated/prisma` is generated and git-ignored; `postinstall`
  rebuilds it.
