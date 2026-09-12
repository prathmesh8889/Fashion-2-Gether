import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const cloudEnabled = Boolean(supabaseUrl && supabaseKey)
export const supabase = cloudEnabled ? createClient(supabaseUrl, supabaseKey) : null

const K = {
  products: 'f2g_products_v1',
  reels: 'f2g_reels_v1',
  orders: 'f2g_orders_v1'
}

export const seedProducts = [
  { id:'p1', name:'Rose Anarkali Set', category:'Ethnic Wear', price:1899, oldPrice:2299, image:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=84', badge:'New', description:'Festive-ready flowing Anarkali set for women.', sizes:['S','M','L','XL'], active:true },
  { id:'p2', name:'Indigo Everyday Kurti', category:'Kurtis & Sets', price:899, oldPrice:1099, image:'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=84', badge:'Bestseller', description:'Easy cotton-inspired kurti for daily styling.', sizes:['S','M','L','XL','XXL'], active:true },
  { id:'p3', name:'Blush Party Dress', category:'Western Wear', price:1499, oldPrice:1899, image:'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=84', badge:'Trending', description:'Elegant western party dress with a flattering silhouette.', sizes:['XS','S','M','L'], active:true },
  { id:'p4', name:'Olive Co-ord Set', category:'Co-ords', price:1399, oldPrice:1699, image:'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=84', badge:'Fresh', description:'Relaxed two-piece co-ord for smart casual days.', sizes:['S','M','L','XL'], active:true },
  { id:'p5', name:'Ivory Celebration Suit', category:'Ethnic Wear', price:2199, oldPrice:2599, image:'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=84', badge:'Festive', description:'Occasion-ready ethnic suit with graceful detailing.', sizes:['M','L','XL'], active:true },
  { id:'p6', name:'Satin Evening Dress', category:'Dresses', price:1699, oldPrice:1999, image:'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=84', badge:'New', description:'Polished evening dress made for dinner and celebrations.', sizes:['XS','S','M','L'], active:true },
  { id:'p7', name:'Peach Girls Festive Set', category:'Girls Collection', price:1199, oldPrice:1499, image:'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=84', badge:'Girls', description:'Bright festive styling for girls.', sizes:['4Y','6Y','8Y','10Y','12Y'], active:true },
  { id:'p8', name:'Classic Women Top', category:'Tops', price:699, oldPrice:899, image:'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=84', badge:'Daily', description:'Versatile top for denim, trousers and skirts.', sizes:['XS','S','M','L','XL'], active:true }
]

export const seedReels = Array.from({length:6}, (_,i) => ({
  id:`r${i+1}`,
  title:['Latest arrivals','Ethnic edit','Party looks','Everyday kurtis','Girls festive','Western favourites'][i],
  url:'https://www.instagram.com/fashion2gether_/',
  cover: seedProducts[i % seedProducts.length].image,
  active:true
}))

const getLocal = (key, fallback) => {
  try { const v = JSON.parse(localStorage.getItem(key)); return Array.isArray(v) && v.length ? v : fallback }
  catch { return fallback }
}
const setLocal = (key, value) => localStorage.setItem(key, JSON.stringify(value))

export async function loadProducts(){
  if (cloudEnabled){
    const {data,error}=await supabase.from('products').select('*').order('created_at',{ascending:false})
    if(!error && data) return data
  }
  return getLocal(K.products, seedProducts)
}
export async function saveProduct(product){
  if (cloudEnabled){
    const payload={...product}; if(String(payload.id||'').startsWith('p')) delete payload.id
    const {data,error}=await supabase.from('products').upsert(payload).select().single(); if(error) throw error; return data
  }
  const list=getLocal(K.products, seedProducts); const item={...product,id:product.id||crypto.randomUUID()}; const next=list.some(x=>x.id===item.id)?list.map(x=>x.id===item.id?item:x):[item,...list]; setLocal(K.products,next); return item
}
export async function removeProduct(id){
  if(cloudEnabled){ const {error}=await supabase.from('products').delete().eq('id',id); if(error) throw error; return }
  setLocal(K.products,getLocal(K.products,seedProducts).filter(x=>x.id!==id))
}

export async function loadReels(){
  if(cloudEnabled){ const {data,error}=await supabase.from('reels').select('*').order('created_at',{ascending:false}); if(!error&&data) return data }
  return getLocal(K.reels,seedReels)
}
export async function saveReel(reel){
  if(cloudEnabled){ const payload={...reel}; if(String(payload.id||'').startsWith('r')) delete payload.id; const {data,error}=await supabase.from('reels').upsert(payload).select().single(); if(error) throw error; return data }
  const list=getLocal(K.reels,seedReels); const item={...reel,id:reel.id||crypto.randomUUID()}; const next=list.some(x=>x.id===item.id)?list.map(x=>x.id===item.id?item:x):[item,...list]; setLocal(K.reels,next); return item
}
export async function removeReel(id){
  if(cloudEnabled){ const {error}=await supabase.from('reels').delete().eq('id',id); if(error) throw error; return }
  setLocal(K.reels,getLocal(K.reels,seedReels).filter(x=>x.id!==id))
}

export async function loadOrders(){
  if(cloudEnabled){ const {data,error}=await supabase.from('orders').select('*').order('created_at',{ascending:false}); if(!error&&data) return data }
  return getLocal(K.orders,[])
}
export async function createOrder(order){
  const payload={...order,status:'New'}
  if(cloudEnabled){ const {data,error}=await supabase.from('orders').insert(payload).select().single(); if(error) throw error; return data }
  const item={...payload,id:crypto.randomUUID(),created_at:new Date().toISOString()}; const list=getLocal(K.orders,[]); setLocal(K.orders,[item,...list]); return item
}
export async function updateOrderStatus(id,status){
  if(cloudEnabled){ const {error}=await supabase.from('orders').update({status}).eq('id',id); if(error) throw error; return }
  setLocal(K.orders,getLocal(K.orders,[]).map(x=>x.id===id?{...x,status}:x))
}

export async function adminLogin(email,password){
  if(cloudEnabled){ const {data,error}=await supabase.auth.signInWithPassword({email,password}); if(error) throw error; return data.user }
  if(email==='admin@fashion2gether.in' && password==='F2G@2026') return {email,local:true}
  throw new Error('Invalid admin credentials')
}
export async function adminLogout(){ if(cloudEnabled) await supabase.auth.signOut() }
