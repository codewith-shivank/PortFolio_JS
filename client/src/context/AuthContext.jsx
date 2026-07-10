import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '@/lib/constants';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    return localStorage.getItem('adminToken') || null;
  });
  const [loading, setLoading] = useState(true);

  // Sync token to Axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('adminToken', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('adminToken');
    }
  }, [token]);

  // Load user profile on startup
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${API_BASE}/auth/me`);
        setUser(response.data);
      } catch (error) {
        console.error('Verify token failed:', error);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email,
      password,
    });
    setToken(response.data.token);
    setUser(response.data);
    return response.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
