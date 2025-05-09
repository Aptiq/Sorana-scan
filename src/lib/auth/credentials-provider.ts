import crypto from "crypto";
import { nanoid } from "nanoid";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { env } from "../env";
import { prisma } from "../prisma";
import { AUTH_COOKIE_NAME } from "./auth.const";
import { addDays } from "date-fns";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export const validatePassword = (password: string) => {
  return PASSWORD_REGEX.test(password);
};

export const hashStringWithSalt = (string: string, salt: string) => {
  const hash = crypto.createHash("sha256");

  const saltedString = salt + string;

  hash.update(saltedString);

  const hashedString = hash.digest("hex");

  return hashedString;
};

export const getCredentialsProvider = () => {
  return CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "text", placeholder: "Your email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials.email || !credentials.password) return null;

      // Add logic here to look up the user from the credentials supplied
      const passwordHash = hashStringWithSalt(
        String(credentials.password),
        env.AUTH_SECRET,
      );

      const user = await prisma.user.findFirst({
        where: {
          email: credentials.email,
          passwordHash: passwordHash,
        },
      });

      if (user) {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      } else {
        return null;
      }
    },
  });
};

type SignInCallback = NonNullable<NextAuthConfig["events"]>["signIn"];

type JwtOverride = NonNullable<NextAuthConfig["jwt"]>;

export const credentialsSignInCallback =
  (request: NextRequest | undefined): SignInCallback =>
  async ({ user }) => {
    if (!request) {
      return;
    }

    if (request.method !== "POST") {
      return;
    }

    const currentUrl = request.url;

    if (!currentUrl.includes("credentials")) {
      return;
    }

    if (!currentUrl.includes("callback")) {
      return;
    }

    const uuid = nanoid();
    const expireAt = addDays(new Date(), 14);
    await prisma.session.create({
      data: {
        sessionToken: uuid,
        userId: user.id ?? "",
        expires: expireAt,
      },
    });

    const cookieList = await cookies();

    cookieList.set(AUTH_COOKIE_NAME, uuid, {
      expires: expireAt,
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      secure: env.NODE_ENV === "production",
    });

    return;
  };

// This override cancel JWT strategy for password. (it's the default one)
export const credentialsOverrideJwt: JwtOverride = {
  encode() {
    return "";
  },
  async decode() {
    return null;
  },
};
