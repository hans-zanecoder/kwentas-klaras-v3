export const NODE_ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const

export const IS_DEVELOPMENT = process.env.NODE_ENV === NODE_ENV.DEVELOPMENT
export const IS_PRODUCTION = process.env.NODE_ENV === NODE_ENV.PRODUCTION
export const IS_TEST = process.env.NODE_ENV === NODE_ENV.TEST
