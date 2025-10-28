'use client';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import es from 'date-fns/locale/es';
import { Inter } from 'next/font/google';

import PermissionGuard from '@/components/PermissionGuard/PermissionGuard';
import lightTheme from '@/themes/lightTheme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AuthProvider } from './authContext';

// import darkTheme from "@/themes/darkTheme";

const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Plataforma primera marcha',
//   description: 'Plataforma primera marcha',
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <html lang="es">
      <head>
        <title>Plataforma primera marcha</title>
      </head>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <AuthProvider>
                <PermissionGuard>
                  {children}
                </PermissionGuard>
              </AuthProvider>
            </LocalizationProvider>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}

// <PermissionGuard></PermissionGuard>
