import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Redacao.ai - Correção de Redações com IA",
  description: "Corrija suas redações de concursos públicos com inteligência artificial. Transcrição automática e avaliação conforme critérios do edital.",
  keywords: ["redação", "concurso público", "correção", "IA", "inteligência artificial"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ptBR as any} appearance={{
      variables: {
        colorPrimary: '#1e1b4b',
        fontFamily: 'var(--font-inter)',
      }
    }}>
      <html lang="pt-BR" className="dark">
        <body
          className={`${inter.variable} ${outfit.variable} antialiased`}
        >
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
