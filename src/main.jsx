import React, {useEffect, useMemo, useState} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Routes, Route, NavLink, Link, useLocation, useSearchParams} from 'react-router-dom'
import {Menu, X, Instagram, MapPin, Phone, MessageCircle, ShoppingBag, Search, ArrowRight, Star, Play, Plus, Pencil, Trash2, LogOut, Package, Film, ClipboardList, Sparkles, ExternalLink, Mail} from 'lucide-react'
import './styles.css'
import {loadProducts, saveProduct, removeProduct, loadReels, saveReel, removeReel, loadOrders, createOrder, updateOrderStatus, adminLogin, adminLogout, cloudEnabled} from './store'

const BRAND='Fashion2gether'
const PHONE='+91 95955 35339'
const WHATSAPP='919595535339'
const INSTAGRAM='https://www.instagram.com/fashion2gether_/'
const ADDRESS='Jay Ambe Tel Bandar behind, Veer Vamanrao Chowk, Yavatmal, Maharashtra 445001'
const MAPS='https://www.google.com/maps/search/?api=1&query=Fashion2gether+Veer+Vamanrao+Chowk+Yavatmal'
const categories=['Ethnic Wear','Western Wear','Kurtis & Sets','Dresses','Co-ords','Tops','Girls Collection']

function App(){
  const [products,setProducts]=useState([])
  const [reels,setReels]=useState([])
  const [cartProduct,setCartProduct]=useState(null)
  const [loading,setLoading]=useState(true)
  const refresh=async()=>{
    const [p,r]=await Promise.all([loadProducts(),loadReels()])
    setProducts(p); setReels(r); setLoading(false)
  }
  useEffect(()=>{refresh()},[])
  return <div className="app-shell">
    <ScrollTop/>
    <Announcement/>
    <Header/>
    <main>
      <Routes>
        <Route path="/" element={<Home products={products} reels={reels} onOrder={setCartProduct} loading={loading}/>}/>
        <Route path="/collections" element={<Collections products={products} onOrder={setCartProduct}/>}/>
        <Route path="/ethnic" element={<CategoryPage title="Ethnic Wear" products={products} onOrder={setCartProduct}/>}/>
        <Route path="/western" element={<CategoryPage title="Western Wear" products={products} onOrder={setCartProduct}/>}/>
        <Route path="/new-arrivals" element={<NewArrivals products={products} onOrder={setCartProduct}/>}/>
        <Route path="/reels" element={<ReelsPage reels={reels}/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/admin" element={<Admin products={products} reels={reels} refresh={refresh}/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </main>
    <Footer/>
    <FloatingWhatsapp/>
    {cartProduct && <OrderModal product={cartProduct} onClose={()=>setCartProduct(null)}/>} 
  </div>
}

function ScrollTop(){const {pathname}=useLocation(); useEffect(()=>window.scrollTo({top:0,behavior:'instant'}),[pathname]); return null}
function Announcement(){return <div className="announcement">New festive & everyday arrivals in store • Visit Fashion2gether, Yavatmal</div>}

function Header(){
  const [open,setOpen]=useState(false)
  const links=[['/','Home'],['/collections','Collections'],['/ethnic','Ethnic'],['/western','Western'],['/new-arrivals','New Arrivals'],['/reels','Reels'],['/about','About'],['/contact','Contact']]
  return <header className="header">
    <div className="container nav-wrap">
      <Link to="/" className="brand" onClick={()=>setOpen(false)}><img src="/logo.svg" alt="Fashion2gether"/><span><b>Fashion2gether</b><small>Women • Girls • Style</small></span></Link>
      <nav className={open?'nav-links open':'nav-links'}>{links.map(([to,label])=><NavLink key={to} to={to} onClick={()=>setOpen(false)} className={({isActive})=>isActive?'active':''}>{label}</NavLink>)}</nav>
      <div className="nav-actions"><a className="icon-btn" href={INSTAGRAM} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={19}/></a><button className="menu-btn" onClick={()=>setOpen(!open)} aria-label="Menu">{open?<X/>:<Menu/>}</button></div>
    </div>
  </header>
}

function Home({products,reels,onOrder,loading}){
  const featured=products.filter(p=>p.active!==false).slice(0,8)
  return <>
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy"><span className="eyebrow"><Sparkles size={16}/> Yavatmal's women's fashion destination</span><h1>Wear the moment.<br/><em>Own the look.</em></h1><p>Curated ethnic, western and girls' styles for everyday confidence, festive days and everything in between.</p><div className="hero-actions"><Link className="btn primary" to="/collections">Shop collections <ArrowRight size={18}/></Link><Link className="btn ghost" to="/reels"><Play size={17}/> Watch reels</Link></div><div className="trust-row"><span><Star size={16} fill="currentColor"/> 4.6 rated</span><span>15+ years in Yavatmal</span><span>Women & girls only</span></div></div>
        <div className="hero-art"><img className="hero-main" src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=88" alt="Women's fashion"/><div className="floating-note"><b>New drop</b><span>Fresh colours • New silhouettes</span></div></div>
      </div>
    </section>

    <section className="section"><div className="container"><SectionHead eyebrow="Find your style" title="Shop by category" text="A collection for every mood, from festive ethnic looks to relaxed western fits."/><div className="category-grid">{categories.map((c,i)=><Link key={c} to={`/collections?category=${encodeURIComponent(c)}`} className={`category-card c${i+1}`}><span>{String(i+1).padStart(2,'0')}</span><h3>{c}</h3><p>Explore collection</p><ArrowRight size={20}/></Link>)}</div></div></section>

    <section className="section warm"><div className="container"><SectionHead eyebrow="Curated for you" title="Trending now" text="Fresh picks you can enquire about instantly on WhatsApp." action={<Link to="/collections">View all <ArrowRight size={16}/></Link>}/>{loading?<LoadingGrid/>:<ProductGrid products={featured} onOrder={onOrder}/>}</div></section>

    <section className="story-strip"><div className="container story-grid"><div className="story-photo"><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=86" alt="Fashion boutique"/></div><div className="story-copy"><span className="eyebrow light">Local fashion, personal feel</span><h2>A boutique experience, now online.</h2><p>Discover styles online, save your favourites and connect directly with our store team for size, colour, availability and ordering.</p><Link className="btn cream" to="/about">Our story <ArrowRight size={18}/></Link></div></div></section>

    <section className="section"><div className="container"><SectionHead eyebrow="Style in motion" title="From our Instagram" text="Reel-ready fashion inspiration from Fashion2gether." action={<a href={INSTAGRAM} target="_blank" rel="noreferrer">Follow us <Instagram size={16}/></a>}/><ReelGrid reels={reels.slice(0,6)}/></div></section>

    <section className="section"><div className="container visit-card"><div><span className="eyebrow">Visit our store</span><h2>Fashion2gether, Yavatmal</h2><p><MapPin size={18}/>{ADDRESS}</p><div className="visit-actions"><a className="btn primary" href={MAPS} target="_blank" rel="noreferrer">Get directions</a><a className="btn ghost" href={`tel:${PHONE.replace(/\s/g,'')}`}><Phone size={17}/> Call now</a></div></div><div className="visit-badge"><img src="/logo.svg" alt="Fashion2gether logo"/><b>4.6 ★</b><span>Customer rating</span></div></div></section>
  </>
}

function SectionHead({eyebrow,title,text,action}){return <div className="section-head"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text&&<p>{text}</p>}</div>{action&&<div className="section-action">{action}</div>}</div>}
function LoadingGrid(){return <div className="product-grid">{Array.from({length:8},(_,i)=><div key={i} className="skeleton"/>)}</div>}

function ProductGrid({products,onOrder}){return <div className="product-grid">{products.map(p=><ProductCard key={p.id} product={p} onOrder={onOrder}/>)}</div>}
function ProductCard({product,onOrder}){return <article className="product-card"><div className="product-image"><img src={product.image} alt={product.name} loading="lazy" onError={e=>{e.currentTarget.src='https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80'}}/>{product.badge&&<span className="badge">{product.badge}</span>}<button className="quick" onClick={()=>onOrder(product)}>Enquire</button></div><div className="product-info"><span>{product.category}</span><h3>{product.name}</h3><div className="price"><b>₹{Number(product.price).toLocaleString('en-IN')}</b>{product.oldPrice&&<s>₹{Number(product.oldPrice).toLocaleString('en-IN')}</s>}</div></div></article>}

function Collections({products,onOrder}){
  const [params,setParams]=useSearchParams(); const [search,setSearch]=useState(''); const selected=params.get('category')||'All'
  const list=useMemo(()=>products.filter(p=>p.active!==false).filter(p=>selected==='All'||p.category===selected).filter(p=>(p.name+' '+p.category).toLowerCase().includes(search.toLowerCase())),[products,selected,search])
  return <PageWrap title="All Collections" intro="Browse ethnic, western, casual and girls' fashion in one place."><div className="filter-bar"><div className="search-box"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search styles..."/></div><div className="chips"><button className={selected==='All'?'active':''} onClick={()=>setParams({})}>All</button>{categories.map(c=><button key={c} className={selected===c?'active':''} onClick={()=>setParams({category:c})}>{c}</button>)}</div></div>{list.length?<ProductGrid products={list} onOrder={onOrder}/>:<Empty text="No styles found in this filter."/>}</PageWrap>
}
function CategoryPage({title,products,onOrder}){const list=products.filter(p=>p.active!==false && p.category===title); return <PageWrap title={title} intro={`Explore our latest ${title.toLowerCase()} styles for women.`}>{list.length?<ProductGrid products={list} onOrder={onOrder}/>:<Empty text="New styles are being added soon."/>}</PageWrap>}
function NewArrivals({products,onOrder}){const list=products.filter(p=>p.active!==false && ['New','Fresh','Trending'].includes(p.badge)); return <PageWrap title="New Arrivals" intro="The newest Fashion2gether looks, updated for the season."><ProductGrid products={list.length?list:products.slice(0,8)} onOrder={onOrder}/></PageWrap>}
function PageWrap({title,intro,children}){return <><section className="page-hero"><div className="container"><span className="eyebrow">Fashion2gether</span><h1>{title}</h1><p>{intro}</p></div></section><section className="section"><div className="container">{children}</div></section></>}
function Empty({text}){return <div className="empty"><ShoppingBag size={30}/><p>{text}</p></div>}

function reelEmbed(url){const m=url?.match(/instagram\.com\/(reel|p)\/([^/?#]+)/i); return m?`https://www.instagram.com/${m[1]}/${m[2]}/embed`:null}
function ReelGrid({reels}){return <div className="reel-grid">{reels.filter(r=>r.active!==false).map(r=>{const embed=reelEmbed(r.url); return <article key={r.id} className="reel-card">{embed?<iframe src={embed} title={r.title} loading="lazy" allowTransparency="true"/>:<a href={r.url||INSTAGRAM} target="_blank" rel="noreferrer" className="reel-cover"><img src={r.cover} alt={r.title}/><span className="play-circle"><Play fill="currentColor"/></span></a>}<div><b>{r.title}</b><a href={r.url||INSTAGRAM} target="_blank" rel="noreferrer">Instagram <ExternalLink size={14}/></a></div></article>})}</div>}
function ReelsPage({reels}){return <PageWrap title="Instagram Reels" intro="Short fashion videos, new arrivals and styling inspiration from our public Instagram."><ReelGrid reels={reels}/><div className="reel-note"><Instagram/><div><b>Want the newest reels?</b><p>Follow @fashion2gether_ on Instagram for the latest store updates.</p></div><a className="btn primary" href={INSTAGRAM} target="_blank" rel="noreferrer">Open Instagram</a></div></PageWrap>}

function About(){return <PageWrap title="About Fashion2gether" intro="Women's fashion with a local Yavatmal heart."><div className="about-grid"><img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=86" alt="Women's fashion boutique"/><div><span className="eyebrow">Our story</span><h2>Style that feels like you.</h2><p>Fashion2gether is a women's fashion store in Yavatmal serving customers with curated ethnic and contemporary styles. Our focus is simple: wearable fashion, fresh variety and helpful in-store guidance.</p><p>Browse online to discover the collection, then message or visit us for live availability, colours, sizes and ordering.</p><div className="stat-row"><div><b>15+</b><span>Years in fashion</span></div><div><b>4.6★</b><span>Customer rating</span></div><div><b>7</b><span>Style categories</span></div></div></div></div></PageWrap>}

function Contact(){return <PageWrap title="Contact & Visit" intro="Questions about size, colour or availability? Reach us directly."><div className="contact-grid"><div className="contact-card"><Phone/><div><span>Call</span><a href={`tel:${PHONE.replace(/\s/g,'')}`}>{PHONE}</a></div></div><div className="contact-card"><MessageCircle/><div><span>WhatsApp</span><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">Chat with store</a></div></div><div className="contact-card"><Instagram/><div><span>Instagram</span><a href={INSTAGRAM} target="_blank" rel="noreferrer">@fashion2gether_</a></div></div><div className="contact-card"><MapPin/><div><span>Store address</span><a href={MAPS} target="_blank" rel="noreferrer">{ADDRESS}</a></div></div></div><div className="map-panel"><div><span className="eyebrow">Fashion2gether, Yavatmal</span><h2>Come shop with us</h2><p>Use Google Maps for turn-by-turn directions to the store.</p><a className="btn primary" href={MAPS} target="_blank" rel="noreferrer">Open Google Maps <ArrowRight size={17}/></a></div></div></PageWrap>}

function OrderModal({product,onClose}){
  const [form,setForm]=useState({name:'',phone:'',size:'',note:''}); const [done,setDone]=useState(false); const [busy,setBusy]=useState(false)
  const submit=async e=>{e.preventDefault(); setBusy(true); try{await createOrder({customer_name:form.name,phone:form.phone,size:form.size,note:form.note,product_id:product.id,product_name:product.name,amount:Number(product.price)}); const msg=encodeURIComponent(`Hi Fashion2gether! I am interested in ${product.name} (₹${product.price}). Size: ${form.size||'Please suggest'}. Name: ${form.name}. Phone: ${form.phone}. ${form.note}`); window.open(`https://wa.me/${WHATSAPP}?text=${msg}`,'_blank'); setDone(true)} finally{setBusy(false)}}
  return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="modal"><button className="modal-close" onClick={onClose}><X/></button>{done?<div className="success"><MessageCircle size={42}/><h2>Enquiry saved</h2><p>WhatsApp is opening so you can confirm availability with the store.</p><button className="btn primary" onClick={onClose}>Done</button></div>:<><div className="modal-product"><img src={product.image} alt={product.name}/><div><span>{product.category}</span><h2>{product.name}</h2><b>₹{Number(product.price).toLocaleString('en-IN')}</b></div></div><form onSubmit={submit} className="form-grid"><label>Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Mobile<input required pattern="[0-9+ ]{10,15}" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label><label>Size<select value={form.size} onChange={e=>setForm({...form,size:e.target.value})}><option value="">Select size</option>{(product.sizes||[]).map(s=><option key={s}>{s}</option>)}</select></label><label>Message<textarea rows="3" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Colour / quantity / question"/></label><button disabled={busy} className="btn primary full">{busy?'Saving...':'Enquire on WhatsApp'}</button></form></>}</div></div>
}

function Admin({products,reels,refresh}){
  const [user,setUser]=useState(null); const [tab,setTab]=useState('products'); const [orders,setOrders]=useState([]); const [error,setError]=useState('');
  useEffect(()=>{if(user) loadOrders().then(setOrders)},[user,tab])
  if(!user) return <AdminLogin onLogin={setUser} error={error} setError={setError}/>
  const logout=async()=>{await adminLogout(); setUser(null)}
  return <div className="admin-page"><aside className="admin-side"><Link to="/" className="admin-brand"><img src="/logo.svg"/><div><b>F2G Admin</b><span>{cloudEnabled?'Cloud mode':'Demo local mode'}</span></div></Link><button className={tab==='products'?'active':''} onClick={()=>setTab('products')}><Package/> Products</button><button className={tab==='reels'?'active':''} onClick={()=>setTab('reels')}><Film/> Reels</button><button className={tab==='orders'?'active':''} onClick={()=>setTab('orders')}><ClipboardList/> Enquiries</button><div className="admin-spacer"/><Link to="/"><ExternalLink/> View store</Link><button onClick={logout}><LogOut/> Logout</button></aside><section className="admin-content"><div className="admin-top"><div><span>Dashboard</span><h1>{tab[0].toUpperCase()+tab.slice(1)}</h1></div><span className="mode-pill">{cloudEnabled?'Supabase connected':'Local browser storage'}</span></div>{tab==='products'&&<ProductsAdmin products={products} refresh={refresh}/>} {tab==='reels'&&<ReelsAdmin reels={reels} refresh={refresh}/>} {tab==='orders'&&<OrdersAdmin orders={orders} reload={()=>loadOrders().then(setOrders)}/>}</section></div>
}
function AdminLogin({onLogin,error,setError}){const [email,setEmail]=useState('admin@fashion2gether.in'); const [password,setPassword]=useState(''); const submit=async e=>{e.preventDefault();setError('');try{onLogin(await adminLogin(email,password))}catch(err){setError(err.message)}};return <div className="admin-login"><form onSubmit={submit}><img src="/logo.svg" alt="logo"/><span className="eyebrow">Fashion2gether</span><h1>Admin login</h1><p>Manage products, Instagram reels and customer enquiries.</p><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<div className="error">{error}</div>}<button className="btn primary full">Login</button>{!cloudEnabled&&<small>Demo mode: password <code>F2G@2026</code>. Connect Supabase before client handoff.</small>}<Link to="/">← Back to website</Link></form></div>}

function ProductsAdmin({products,refresh}){
  const blank={name:'',category:'Ethnic Wear',price:'',oldPrice:'',image:'',badge:'New',description:'',sizes:'S,M,L,XL',active:true}; const [form,setForm]=useState(blank); const [editing,setEditing]=useState(null); const [busy,setBusy]=useState(false)
  const edit=p=>{setEditing(p.id);setForm({...p,sizes:(p.sizes||[]).join(',')});window.scrollTo({top:0,behavior:'smooth'})}
  const submit=async e=>{e.preventDefault();setBusy(true);await saveProduct({...form,id:editing||undefined,price:Number(form.price),oldPrice:form.oldPrice?Number(form.oldPrice):null,sizes:String(form.sizes).split(',').map(s=>s.trim()).filter(Boolean)});setForm(blank);setEditing(null);await refresh();setBusy(false)}
  const del=async id=>{if(confirm('Delete this product?')){await removeProduct(id);await refresh()}}
  return <><form className="admin-form" onSubmit={submit}><div className="admin-form-head"><div><h2>{editing?'Edit product':'Add new product'}</h2><p>Products appear instantly in collections.</p></div>{editing&&<button type="button" className="text-btn" onClick={()=>{setEditing(null);setForm(blank)}}>Cancel</button>}</div><div className="fields"><label>Product name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.map(c=><option key={c}>{c}</option>)}</select></label><label>Price ₹<input required type="number" min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></label><label>Old price ₹<input type="number" min="0" value={form.oldPrice||''} onChange={e=>setForm({...form,oldPrice:e.target.value})}/></label><label className="span2">Image URL<input required type="url" value={form.image} onChange={e=>setForm({...form,image:e.target.value})}/></label><label>Badge<input value={form.badge||''} onChange={e=>setForm({...form,badge:e.target.value})}/></label><label>Sizes<input value={form.sizes} onChange={e=>setForm({...form,sizes:e.target.value})}/></label><label className="span2">Description<textarea rows="3" value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})}/></label></div><button disabled={busy} className="btn primary"><Plus size={17}/>{busy?'Saving...':editing?'Update product':'Add product'}</button></form><div className="admin-table"><div className="table-head"><b>Current products</b><span>{products.length} items</span></div>{products.map(p=><div className="table-row" key={p.id}><img src={p.image}/><div className="grow"><b>{p.name}</b><span>{p.category} • ₹{p.price}</span></div><button onClick={()=>edit(p)}><Pencil size={17}/></button><button onClick={()=>del(p.id)}><Trash2 size={17}/></button></div>)}</div></>
}
function ReelsAdmin({reels,refresh}){const blank={title:'',url:'',cover:'',active:true};const [form,setForm]=useState(blank);const [editing,setEditing]=useState(null);const submit=async e=>{e.preventDefault();await saveReel({...form,id:editing||undefined});setForm(blank);setEditing(null);await refresh()};const edit=r=>{setEditing(r.id);setForm(r)};const del=async id=>{if(confirm('Delete this reel?')){await removeReel(id);await refresh()}};return <><form className="admin-form" onSubmit={submit}><div className="admin-form-head"><div><h2>{editing?'Edit reel':'Add Instagram reel'}</h2><p>Paste a public Instagram Reel URL such as instagram.com/reel/...</p></div></div><div className="fields"><label>Title<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><label>Instagram reel URL<input required type="url" value={form.url} onChange={e=>setForm({...form,url:e.target.value})}/></label><label className="span2">Cover image URL<input required type="url" value={form.cover} onChange={e=>setForm({...form,cover:e.target.value})}/></label></div><button className="btn primary"><Plus size={17}/>{editing?'Update reel':'Add reel'}</button></form><div className="admin-table"><div className="table-head"><b>Reels</b><span>{reels.length} items</span></div>{reels.map(r=><div className="table-row" key={r.id}><img src={r.cover}/><div className="grow"><b>{r.title}</b><span>{reelEmbed(r.url)?'Embeddable reel':'Instagram/profile link'}</span></div><button onClick={()=>edit(r)}><Pencil size={17}/></button><button onClick={()=>del(r.id)}><Trash2 size={17}/></button></div>)}</div></>}
function OrdersAdmin({orders,reload}){const change=async(id,status)=>{await updateOrderStatus(id,status);reload()};return <div className="admin-table orders"><div className="table-head"><b>Customer enquiries</b><span>{orders.length} total</span></div>{orders.length?orders.map(o=><div className="order-row" key={o.id}><div><b>{o.customer_name}</b><a href={`tel:${o.phone}`}>{o.phone}</a></div><div><b>{o.product_name}</b><span>Size: {o.size||'-'} • ₹{o.amount||'-'}</span></div><div className="grow"><span>{o.note||'No note'}</span></div><select value={o.status||'New'} onChange={e=>change(o.id,e.target.value)}><option>New</option><option>Contacted</option><option>Confirmed</option><option>Closed</option></select></div>):<Empty text="No enquiries yet."/>}</div>}

function Footer(){return <footer className="footer"><div className="container footer-grid"><div><Link className="brand footer-brand" to="/"><img src="/logo.svg"/><span><b>Fashion2gether</b><small>Women • Girls • Style</small></span></Link><p>Curated women's and girls' fashion in Yavatmal — ethnic, western, casual and festive.</p></div><div><b>Explore</b><Link to="/collections">Collections</Link><Link to="/new-arrivals">New arrivals</Link><Link to="/reels">Instagram reels</Link><Link to="/admin">Admin</Link></div><div><b>Visit</b><a href={MAPS} target="_blank" rel="noreferrer">{ADDRESS}</a><a href={`tel:${PHONE.replace(/\s/g,'')}`}>{PHONE}</a></div><div><b>Connect</b><a href={INSTAGRAM} target="_blank" rel="noreferrer"><Instagram size={16}/> Instagram</a><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp</a><a href="mailto:hello@fashion2gether.in"><Mail size={16}/> Email</a></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Fashion2gether. All rights reserved.</span><span>Yavatmal, Maharashtra</span></div></footer>}
function FloatingWhatsapp(){return <a className="floating-wa" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hi Fashion2gether! I want to know about your latest collection.')}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle/></a>}
function NotFound(){return <div className="not-found"><h1>404</h1><p>This page isn't part of the collection.</p><Link className="btn primary" to="/">Back home</Link></div>}

createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><App/></BrowserRouter></React.StrictMode>)
