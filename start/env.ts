/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),
  REFRESH_TOKEN_KEY: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),

  IPINFO_URL: Env.schema.string({ format: 'url' }),
  IPINFO_TOKEN: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the limiter package
  |----------------------------------------------------------
  */
  LIMITER_STORE: Env.schema.enum(['redis', 'memory'] as const),

  /*
  |----------------------------------------------------------
  | Variables for configuring the Germini adapter
  |----------------------------------------------------------
  */
  GEMINI_API_KEY: Env.schema.string(),
  GEMINI_MODEL: Env.schema.string(),
  GEMINI_MAX_OUTPUT_TOKENS: Env.schema.number(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the Google Name Search adapter
  |----------------------------------------------------------
  */
  GOOGLE_SEARCH_API_KEY: Env.schema.string(),
  GOOGLE_SEARCH_ENGINE_ID: Env.schema.string(),
  GOOGLE_API_BASE_URL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the mail package
  |----------------------------------------------------------
  */

  RESEND_API_KEY: Env.schema.string(),
  EMAIL_PROVIDER_TOKEN: Env.schema.string(),
  EMAIL_PROVIDER_NAME: Env.schema.string(),
  EMAIL_PROVIDER_FROM: Env.schema.string(),
  EMAIL_PROVIDER_FROM_NAME: Env.schema.string(),
  EMAIL_PROVIDER_FROM_ADDRESS: Env.schema.string(),
  EMAIL_PROVIDER_USERNAME: Env.schema.string.optional(),
  EMAIL_PROVIDER_PASSWORD: Env.schema.string.optional(),
  EMAIL_PROVIDER_HOST: Env.schema.string.optional(),
  EMAIL_PROVIDER_PORT: Env.schema.string.optional(),
  EMAIL_ADMIN_SUBSCRIBER_ID: Env.schema.string(),
  EMAIL_ADMIN_ADDRESS: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring google auth
  |----------------------------------------------------------
  */
  GOOGLE_CLIENT_ID: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring OpenAi
  |----------------------------------------------------------
  */
  OPENAI_API_KEY: Env.schema.string(),
  OPENAI_MODEL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring Firebase Admin credentials
  |----------------------------------------------------------
  */
  FIREBASE_CREDENTIALS_BASE64: Env.schema.string.optional(),
  FIREBASE_CREDENTIALS_JSON: Env.schema.string.optional(),
  FIREBASE_CREDENTIALS_PATH: Env.schema.string.optional(),
})
