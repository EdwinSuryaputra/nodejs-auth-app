export const conf = {
    APP_PORT: Number(process.env.APP_PORT),

    POSTGRES_URL: process.env.POSTGRES_URL,

    REDIS_URL: process.env.REDIS_URL,

    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN_SECONDS: Number(process.env.JWT_EXPIRES_IN_SECONDS),
}