import "./globals.css";

export const metadata = {
  title: "CYBERLAB — Interactive Cybersecurity Learning Platform",
  description:
    "Master foundational Linux networking, Nmap scanning, and security analysis through guided missions, simulated terminal practice, and progressive hints.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-cyber-bg text-cyber-text antialiased min-h-screen selection:bg-cyber-emerald selection:text-black">
        {children}
      </body>
    </html>
  );
}
