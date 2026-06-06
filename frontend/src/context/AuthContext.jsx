import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { api } from '../services/api';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export function AuthProvider({ children }) {
  const [user,setUser]=useState(JSON.parse(localStorage.getItem('user')||'null')); const [socket,setSocket]=useState(null);
  useEffect(()=>{ if(user){ const s=io(import.meta.env.VITE_SOCKET_URL||'http://localhost:5000'); s.emit('join:user',user.id); setSocket(s); return()=>s.close(); }},[user?.id]);
  const login=async(email,password)=>{ const {data}=await api.post('/auth/login',{email,password}); localStorage.setItem('token',data.token); localStorage.setItem('user',JSON.stringify(data.user)); setUser(data.user); };
  const register=async(payload)=>{ const {data}=await api.post('/auth/register',payload); localStorage.setItem('token',data.token); localStorage.setItem('user',JSON.stringify(data.user)); setUser(data.user); };
  const logout=()=>{ localStorage.clear(); setUser(null); };
  const value=useMemo(()=>({user,socket,login,register,logout,setUser}),[user,socket]); return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
