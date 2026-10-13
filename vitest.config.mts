import { defineConfig } from 'vitest/config'
import { existsSync, readFileSync } from 'node:fs'
import { parseEnv } from 'node:util'
import react from '@vitejs/plugin-react'

// Local Supabase keys for the integration tests.
const localEnv = existsSync('.env.local') ? parseEnv(readFileSync('.env.local', 'utf8')) : {}

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['**/*.test.{ts,tsx}'],
          exclude: ['node_modules/**', 'tests/integration/**'],
          environment: 'node',
        },
      },
      {
        // Requires the local Supabase stack (pnpm supa-run): creates real users.
        extends: true,
        test: {
          name: 'integration',
          include: ['tests/integration/**/*.test.ts'],
          environment: 'node',
          env: localEnv,
          fileParallelism: false,
          testTimeout: 20_000,
        },
      },
    ],
  },
})
