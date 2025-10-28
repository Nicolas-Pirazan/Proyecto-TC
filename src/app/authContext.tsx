'use client';

import { useLogin } from '@/api/login';
import { ILoginCredentials } from '@/types/login';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  token: string | null;
  login: (run: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [logoutTimer, setLogoutTimerState] = useState<NodeJS.Timeout | null>(null); 
  const router = useRouter();
  const { mutate: loginMutation } = useLogin();

  const setLogoutTimer = (token: string) => {
    if (!token || typeof token !== 'string') {
      console.error('Invalid token provided');
      logout(); 
      return;
    }

    try {
      const decodedToken: any = jwtDecode(token); 
      const expirationTime = decodedToken.exp * 1000; // Convertir a milisegundos
      const currentTime = Date.now();

      const timeUntilLogout = expirationTime - currentTime;

      if (timeUntilLogout > 0) {
        if (logoutTimer) {
          clearTimeout(logoutTimer);
        }

        const timerId = setTimeout(() => {
          alert('Tu sesión ha expirado. Serás redirigido a la página de login.');
          logout();
        }, timeUntilLogout);

        setLogoutTimerState(timerId); 
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      logout(); 
    }
  };

  useEffect(() => {
    const storedToken = Cookies.get('authToken'); 
    if (storedToken) {
      const decodedToken: any = jwtDecode(storedToken);
      const currentTime = Date.now();
      
      // Verificar si el token ya ha expirado
      if (decodedToken.exp * 1000 < currentTime) {
        logout(); 
      } else {
        setToken(storedToken);
        setLogoutTimer(storedToken); 
      }
    }
  }, []);

  const login = async (run: string, password: string) => {
    try {
      const credentials: ILoginCredentials = { run, password };
      loginMutation(credentials, {
        onSuccess: (response) => {
          if (response.successful && response.entity) {
            const token = response.entity.token;
            setToken(token);
            Cookies.set('authToken', token, { expires: 1, sameSite: 'Strict', secure: false }); // Guardar el token en las cookies
            Cookies.set('userInfo', JSON.stringify(response.entity.arbolPermisos), { expires: 1, sameSite: 'Strict', secure: false });

            setLogoutTimer(token); 
            router.push('/');
          } else {
            throw new Error(response.error || 'Authentication failed');
          }
        },
        onError: (error) => {
          console.error('Error during login:', error);
          alert('Login failed. Please check your credentials and try again.');
          throw error;
        },
      });
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    Cookies.remove('authToken');  
    Cookies.remove('userInfo');
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }

    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
