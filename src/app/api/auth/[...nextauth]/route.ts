/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "placeholder",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder",
        }),
        CredentialsProvider({
            name: 'Credenciales',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@estetica.pro" },
                password: { label: "Contraseña", type: "password" }
            },
            async authorize(credentials) {
                if (credentials?.email === "admin@estetica.pro" && credentials?.password === "admin123") {
                    return { id: "1", name: "Admin Demo", email: "admin@estetica.pro" };
                }
                return null;
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async session({ session, token }: any) {
            if (token && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        }
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
