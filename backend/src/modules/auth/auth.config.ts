const parseExpiryToMs = (value: string) => {
  const match = value.match(/^(\d+)([smhd])$/i);

  if (!match) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 's':
      return amount * 1000;
    case 'm':
      return amount * 60 * 1000;
    case 'h':
      return amount * 60 * 60 * 1000;
    case 'd':
      return amount * 24 * 60 * 60 * 1000;
    default:
      return 7 * 24 * 60 * 60 * 1000;
  }
};

const requireAuthEnv = (value: string | undefined, key: string) => {
  if (value && value.trim().length > 0) {
    return value;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required auth environment variable: ${key}`);
  }

  return `development-${key.toLowerCase()}`;
};

export const authConfig = {
  accessTokenSecret: requireAuthEnv(process.env.JWT_ACCESS_SECRET, 'JWT_ACCESS_SECRET'),
  refreshTokenSecret: requireAuthEnv(
    process.env.JWT_REFRESH_SECRET,
    'JWT_REFRESH_SECRET',
  ),
  accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY ?? '15m',
  refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY ?? '7d',
};

export const refreshTokenMaxAgeMs = parseExpiryToMs(authConfig.refreshTokenExpiry);
