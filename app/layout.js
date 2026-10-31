import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";

export const metadata = {
  title: "CYBERLAB — Interactive Cybersecurity Academy",
  description:
    "Master foundational Linux, networking, Nmap scanning, and offensive security analysis through guided missions, simulated terminal execution, and progressive feedback.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-cyber-bg text-cyber-text antialiased min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
