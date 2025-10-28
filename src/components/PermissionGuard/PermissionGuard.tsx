'use client';

import { getPermissionsByRol } from '@/api/permissions';
import { Box, CircularProgress } from '@mui/material';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PermissionGuardProps {
  children: React.ReactNode;
}

const PermissionGuard = ({ children }: PermissionGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      if (pathname === '/login' || pathname === '/registro') {
        setLoading(false);
        return;
      }
      const userInfoCookie = Cookies.get('userInfo');
      let idRol: number | null = null;
      if (userInfoCookie) {
        try {
          const userInfo = JSON.parse(userInfoCookie);
          if (userInfo.roles && userInfo.roles.length > 0) {
            idRol = Number(userInfo.roles[0].consecutive);
          }
        } catch (error) {
          console.error('Error al parsear la cookie userInfo:', error);
        }
      }

      if (!idRol) {
        router.push('/login');
        return;
      }

      const pathParts = pathname.split('/').filter(Boolean);
      const filtered = pathParts.filter(part => !/^\d+$/.test(part));
      const modulo = filtered[0] || '';
      const ruta = filtered.length > 1 ? `/${filtered.slice(1).join('/')}` : '/';

      try {
        if (modulo !== '') {
          const data = await getPermissionsByRol(idRol, modulo, ruta);
          const hasAccess = data?.entity?.[0]?.accion?.acceso;
          if (!hasAccess) {
            router.push('/');
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error verificando permisos:', error);
        router.push('/');
      }
    };

    checkPermission();
  }, [pathname, router]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;
