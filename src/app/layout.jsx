import { AuthProvider } from "@/components/contexts/Authcontext";
import AppContainer from "./AppContainer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Add favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Optional: SVG or PNG variants */}
        {/* <link rel="icon" type="image/svg+xml" href="/favicon.svg" /> */}
        {/* <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> */}
      </head>
      <body>
        <AuthProvider>
          <AppContainer>{children}</AppContainer>
        </AuthProvider>
      </body>
    </html>
  );
}
