# Vite React Shadcn TS

A modern React + Vite + TypeScript template bootstrapped with shadcn/ui components and utilities.

## API Client

This project includes a lightweight typed API client under `src/api` generated from your OpenAPI surface.

- Configure base URL via `VITE_API_BASE_URL` (defaults to `http://localhost:8080/api`).
- Tokens are stored in `localStorage` under `access_token` and `refresh_token`.
- Automatic token refresh on 401 using `/auth/refresh`.

### Structure

- `src/api/config.ts`: base URL and token keys
- `src/api/http.ts`: auth-aware HTTP client with refresh queueing
- `src/api/auth.ts`: login/logout and exported `http` instance
- `src/api/types.ts`: core request/response types
- `src/api/endpoints/*`: resource-specific modules

### Usage

```ts
import { AuthService } from "./src/api/auth";
import { ProductsApi } from "./src/api/endpoints/products";

await AuthService.login({ username: "user", password: "pass" });
const products = await ProductsApi.getAll({ page: 0, size: 10 });
```

### Env

Create `.env.local`:

```
VITE_API_BASE_URL=http://localhost:8080/api
```
