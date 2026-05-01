# Elysia with Bun runtime

this is very much vibecoded slop

## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

## Requirements

Requires PostgreSQL to be installed
bun x drizzle-kit push to initialize tables then bunx drizzle-kit migrate

## Logging 

Set up your own Logrotate script to rotate ./logs/out.log