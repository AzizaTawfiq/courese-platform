import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role, type User } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { authConfig, refreshTokenMaxAgeMs } from './auth.config.js';

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}

const hashRefreshToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');

const buildAccessTokenPayload = (user: {
  id: string;
  email: string;
  role: Role;
}) => ({
  id: user.id,
  email: user.email,
  role: user.role,
});

const serializeUser = (user: User) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  companyName: user.companyName,
  role: user.role,
});

const createAccessToken = (user: {
  id: string;
  email: string;
  role: Role;
}) =>
  jwt.sign(buildAccessTokenPayload(user), authConfig.accessTokenSecret, {
    expiresIn: authConfig.accessTokenExpiry as jwt.SignOptions['expiresIn'],
  });

const createStoredRefreshToken = async (userId: string) => {
  const rawToken = jwt.sign(
    {
      sub: userId,
      nonce: randomBytes(16).toString('hex'),
    },
    authConfig.refreshTokenSecret,
    {
      expiresIn: authConfig.refreshTokenExpiry as jwt.SignOptions['expiresIn'],
    },
  );

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashRefreshToken(rawToken),
      expiresAt: new Date(Date.now() + refreshTokenMaxAgeMs),
    },
  });

  return rawToken;
};

const verifyRefreshTokenPayload = (token: string) => {
  try {
    jwt.verify(token, authConfig.refreshTokenSecret);
  } catch {
    throw new AuthError('Unauthorized', 401);
  }
};

export const register = async (payload: {
  fullName: string;
  companyName: string;
  email: string;
  password: string;
}) => {
  const email = payload.email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    throw new AuthError('Email already registered.', 409);
  }

  const passwordHash = await bcrypt.hash(payload.password, 12);
  const user = await prisma.user.create({
    data: {
      fullName: payload.fullName.trim(),
      companyName: payload.companyName.trim(),
      email,
      passwordHash,
      role: Role.CUSTOMER,
    },
  });

  const refreshToken = await createStoredRefreshToken(user.id);

  return {
    accessToken: createAccessToken(user),
    refreshToken,
    user: serializeUser(user),
  };
};

export const login = async (payload: { email: string; password: string }) => {
  const email = payload.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AuthError('Invalid credentials.', 401);
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AuthError('Invalid credentials.', 401);
  }

  await prisma.refreshToken.updateMany({
    where: {
      userId: user.id,
      revoked: false,
    },
    data: {
      revoked: true,
    },
  });

  const refreshToken = await createStoredRefreshToken(user.id);

  return {
    accessToken: createAccessToken(user),
    refreshToken,
    user: serializeUser(user),
  };
};

export const refresh = async (rawToken: string) => {
  verifyRefreshTokenPayload(rawToken);

  const tokenHash = hashRefreshToken(rawToken);
  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (
    !storedToken ||
    storedToken.revoked ||
    storedToken.expiresAt.getTime() <= Date.now()
  ) {
    throw new AuthError('Unauthorized', 401);
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    const nextToken = jwt.sign(
      {
        sub: storedToken.userId,
        nonce: randomBytes(16).toString('hex'),
      },
      authConfig.refreshTokenSecret,
      {
        expiresIn: authConfig.refreshTokenExpiry as jwt.SignOptions['expiresIn'],
      },
    );

    await tx.refreshToken.create({
      data: {
        userId: storedToken.userId,
        tokenHash: hashRefreshToken(nextToken),
        expiresAt: new Date(Date.now() + refreshTokenMaxAgeMs),
      },
    });

    return {
      accessToken: createAccessToken(storedToken.user),
      refreshToken: nextToken,
    };
  });

  return result;
};

export const logout = async (rawToken: string | undefined) => {
  if (!rawToken) {
    return;
  }

  await prisma.refreshToken.updateMany({
    where: {
      tokenHash: hashRefreshToken(rawToken),
      revoked: false,
    },
    data: {
      revoked: true,
    },
  });
};

export const me = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AuthError('Unauthorized', 401);
  }

  return serializeUser(user);
};
