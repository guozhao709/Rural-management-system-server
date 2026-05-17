# servers

Node.js + Express backend service for admin and client frontends.

## Structure

```text
.
|-- data/
|   |-- admin/             # Admin JSON data
|   `-- client/            # Client SQLite data
|-- docs/                  # Development docs
|-- src/
|   |-- app.js             # Server entry
|   |-- app/               # Route mounting entry modules
|   |-- admin/             # Admin routes and utilities
|   `-- client/            # Client routes, tools, db, prompts
|-- package.json
`-- README.md
```

## Scripts

```bash
npm run dev
npm start
```
