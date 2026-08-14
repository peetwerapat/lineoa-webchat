import "server-only";

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const serverEnv = {
  get databaseUrl() {
    return required("DATABASE_URL");
  },
  get lineChannelAccessToken() {
    return required("LINE_CHANNEL_ACCESS_TOKEN");
  },
  get lineChannelSecret() {
    return required("LINE_CHANNEL_SECRET");
  },
};

export const isProduction = process.env.NODE_ENV === "production";
