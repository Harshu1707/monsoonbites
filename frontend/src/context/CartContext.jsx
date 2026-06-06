import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
const CartContext=createContext(); export const useCart=()=>useContext(CartContext);
export function CartProvider({children}){ const {user}=useAuth(); const [cart,setCart]=useState({items:[],total:0}); const load=async()=>{ if(user){ const {data}=await api.get('/cart'); setCart(data); } else setCart({items:[],total:0});}; useEffect(()=>{load();},[user?.id]); const add=async(food_id,quantity=1)=>{await api.post('/cart',{food_id,quantity}); await load();}; const update=async(id,quantity)=>{await api.put(`/cart/${id}`,{quantity}); await load();}; const remove=async(id)=>{await api.delete(`/cart/${id}`); await load();}; return <CartContext.Provider value={{cart,load,add,update,remove}}>{children}</CartContext.Provider>}
