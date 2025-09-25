import { AuthProvider } from "@/components/contexts/Authcontext";
import AppContainer from "./AppContainer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <AuthProvider>
          <AppContainer>
            {children}
          </AppContainer>
        </AuthProvider>
      </body>
    </html>
  );
}
