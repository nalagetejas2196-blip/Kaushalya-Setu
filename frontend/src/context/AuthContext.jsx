import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kaushalya_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('kaushalya_token') || null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('kaushalya_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kaushalya_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('kaushalya_token', token);
    } else {
      localStorage.removeItem('kaushalya_token');
    }
  }, [token]);

  // 1-Click Instant Demo Login
  const loginDemo = async (role = 'beneficiary') => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setToken(data.token);
        return { success: true, user: data.user };
      } else {
        throw new Error(data.error || 'Demo login failed');
      }
    } catch (err) {
      console.error('Demo login error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Standard Login
  const login = async (identifier, otp, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setToken(data.token);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Registration
  const register = async (profileData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setToken(data.token);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update Profile
  const updateUser = async (updates) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/auth/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        return updated;
      }
    } catch (err) {
      console.error('Update user error:', err);
    }
  };

  // Reset Demo Data
  const resetDemoData = async () => {
    try {
      const res = await fetch('/api/reset-demo', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        // Automatically re-login beneficiary
        await loginDemo('beneficiary');
        return { success: true, message: data.message };
      }
    } catch (err) {
      console.error('Reset error:', err);
    }
    return { success: false };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('kaushalya_user');
    localStorage.removeItem('kaushalya_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      loginDemo,
      login,
      register,
      updateUser,
      resetDemoData,
      logout,
      isAuthenticated: !!user,
      isBeneficiary: user?.role === 'beneficiary',
      isOfficer: user?.role === 'officer',
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
