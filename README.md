# my-note nuxt

A simple note taking Nuxt Application with firebase connection, that allows Markdown view of your notes.

For the auth to work it is needed to provide an Google Service Account, go to firebase->settings->service account and
generate a JSON file as key.

To choose a database please create a .env file and assign the values "firebase" or "supabase":

TODO:

- Mover toda a logica de obter dados para API e usar os server/admin SDK's dos serviços para obter dados.

```angular2html
DB_CHOICE="firebase"
```

## Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

### Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

### Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
