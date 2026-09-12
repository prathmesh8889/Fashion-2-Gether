import React,{useEffect,useMemo,useState} from 'react'
import {Routes,Route,Link,NavLink,useLocation,useSearchParams} from 'react-router-dom'
import {Menu,X,Instagram,MapPin,Phone,MessageCircle,ShoppingBag,Search,ArrowRight,Star,Play,Plus,Pencil,Trash2,LogOut,Package,Film,ClipboardList,ExternalLink,Minus,Truck,CreditCard,CheckCircle2} from 'lucide-react'
import {loadProducts,saveProduct,removeProduct,loadReels,saveReel,removeReel,loadOrders,createOrder,saveOrder,updateOrderStatus,removeOrder,adminLogin,adminLogout,cloudEnabled} from './store2'
import './app.css'

const PHONE='+91 95955 35339'
const WHATSAPP='919595535339'
const INSTAGRAM='https://www.instagram.com/fashion2gether_/'
const ADDRESS='Jay Ambe Tel Bandar behind, Veer Vamanrao Chowk, Yavatmal, Maharashtra 445001'
const MAPS='https://www.google.com/maps/search/?api=1&query=Fashion2gether+Veer+Vamanrao+Chowk+Yavatmal'
const CATS=['Ethnic Wear','Western Wear','Kurtis & Sets','Dresses','Co-ords','Tops','Girls Collection']
const CART_KEY='f2g_cart_v2'

const money=n=>`₹${Number(n||0).toLocaleString('en-IN')}`

export default function App(){
  const [products,setProducts]=useState([])
  const [reels,setReels]=useState([])
  const [loading,setLoading]=useState(true)
  const [cart,setCart]=useState(()=>{try{return JSON.parse(localStorage.getItem(CART_KEY)||'[]')}catch{return []}})
  const [cartOpen,setCartOpen]=useState(false)

  const refresh=async()=>{const [p,r]=await Promise.all([loadProducts(),loadReels()]);setProducts(p);setReels(r);setLoading(false)}
  useEffect(()=>{refresh()},[])
  useEffect(()=>{localStorage.setItem(CART_KEY,JSON.stringify(cart))},[cart])

  const addCart=(p,size='')=>{setCart(prev=>{const key=`${p.id}-${size}`;const found=prev.find(x=>x.key===key);return found?prev.map(x=>x.key===key?{...x,qty:x.qty+1}:x):[...prev,{key,id:p.id,name:p.name,image:p.image,price:Number(p.price),size,qty:1}]});setCartOpen(true)}
  const setQty=(key,qty)=>setCart(prev=>qty<=0?prev.filter(x=>x.key!==key):prev.map(x=>x.key===key?{...x,qty}:x))
  const cartCount=cart.reduce((s,x)=>s+x.qty,0)

  return <div className="site-shell">
    <ScrollTop/>
    <div className="announce">New arrivals • Women & girls fashion • Yavatmal</div>
    <Header cartCount={cartCount} onCart={()=>setCartOpen(true)}/>
    <main>
      <Routes>
        <Route path="/" element={<Home products={products} reels={reels} loading={loading} addCart={addCart}/>}/>
        <Route path="/collections" element={<Collections products={products} addCart={addCart}/>}/>
        <Route path="/ethnic" element={<Category title="Ethnic Wear" products={products} addCart={addCart}/>}/>
        <Route path="/western" element={<Category title="Western Wear" products={products} addCart={addCart}/>}/>
        <Route path="/new-arrivals" element={<NewArrivals products={products} addCart={addCart}/>}/>
        <Route path="/reels" element={<ReelsPage reels={reels}/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/admin" element={<Admin products={products} reels={reels} refresh={refresh}/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </main>
    <Footer/>
    <a className="wa-float" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer"><MessageCircle/></a>
    {cartOpen&&<CartDrawer cart={cart} setQty={setQty} close={()=>setCartOpen(false)} clear={()=>setCart([])}/>} 
  </div>
}

function ScrollTop(){const {pathname}=useLocation();useEffect(()=>window.scrollTo({top:0,left:0,behavior:'auto'}),[pathname]);return null}

function Header({cartCount,onCart}){
  const [open,setOpen]=useState(false)
  const links=[['/','Home'],['/collections','Collections'],['/ethnic','Ethnic'],['/western','Western'],['/new-arrivals','New Arrivals'],['/reels','Reels'],['/about','About'],['/contact','Contact']]
  return <header className="topbar"><div className="wrap navrow">
    <Link className="logo" to="/" onClick={()=>setOpen(false)}><img src="/logo.svg" alt="Fashion 2 Gether"/><div><b>Fashion 2 Gether</b><span>Wear better. Look better.</span></div></Link>
    <nav className={open?'nav open':'nav'}>{links.map(([to,label])=><NavLink key={to} to={to} onClick={()=>setOpen(false)}>{label}</NavLink>)}</nav>
    <div className="navtools"><a href={INSTAGRAM} target="_blank" rel="noreferrer" className="round"><Instagram size={19}/></a><button className="cartbtn" onClick={onCart}><ShoppingBag size={19}/><span>Cart</span>{cartCount>0&&<i>{cartCount}</i>}</button><button className="hamb" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div>
  </div></header>
}

function Home({products,reels,loading,addCart}){
  const featured=products.filter(x=>x.active!==false).slice(0,8)
  return <>
    <section className="hero"><div className="wrap hero-grid">
      <div className="hero-copy"><span className="kicker">FASHION 2 GETHER • YAVATMAL</span><h1>Looks made for<br/><em>her moment.</em></h1><p>Women’s and girls’ fashion for festive days, college looks, celebrations and everyday confidence.</p><div className="hero-actions"><Link to="/collections" className="btn hot">Shop Collection <ArrowRight size={18}/></Link><Link to="/reels" className="btn line"><Play size={17}/> Watch Reels</Link></div><div className="rating"><Star fill="currentColor" size={17}/><b>4.6</b><span>local customer rating</span></div></div>
      <div className="hero-visual"><img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1100&q=88" alt="Women fashion"/><div className="hero-logo"><img src="/logo.svg" alt="Fashion2gether logo"/></div></div>
    </div></section>

    <section className="section"><div className="wrap"><SectionTitle over="SHOP YOUR MOOD" title="Collections for every plan"/><div className="catgrid">{CATS.map((c,i)=><Link key={c} to={`/collections?category=${encodeURIComponent(c)}`} className={`cat c${i+1}`}><small>0{i+1}</small><h3>{c}</h3><span>Explore <ArrowRight size={17}/></span></Link>)}</div></div></section>
    <section className="section tint"><div className="wrap"><SectionTitle over="TRENDING NOW" title="Fresh picks" action={<Link to="/collections">View all</Link>}/>{loading?<div className="loading">Loading collection…</div>:<ProductGrid products={featured} addCart={addCart}/>}</div></section>
    <section className="brandstory"><div className="wrap storygrid"><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=86" alt="Boutique"/><div><span className="kicker pale">LOCAL STYLE. MODERN SHOPPING.</span><h2>See it. Love it. Add it to cart.</h2><p>Browse the store online, add multiple styles to your cart and place a delivery order directly. Our team can confirm size, colour and availability.</p><Link to="/collections" className="btn cream">Start shopping <ArrowRight size={18}/></Link></div></div></section>
    <section className="section"><div className="wrap"><SectionTitle over="INSTAGRAM" title="Short looks from our feed" action={<a href={INSTAGRAM} target="_blank" rel="noreferrer">Follow @fashion2gether_</a>}/><ReelGrid reels={reels.slice(0,6)}/></div></section>
  </>
}

function SectionTitle({over,title,action}){return <div className="section-title"><div><span>{over}</span><h2>{title}</h2></div>{action&&<div>{action}</div>}</div>}
function ProductGrid({products,addCart}){return <div className="products">{products.map(p=><ProductCard key={p.id} p={p} addCart={addCart}/>)}</div>}
function ProductCard({p,addCart}){const [size,setSize]=useState('');return <article className="product"><div className="pic"><img src={p.image} alt={p.name} loading="lazy" onError={e=>{e.currentTarget.src='https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80'}}/>{p.badge&&<b className="tag">{p.badge}</b>}</div><div className="pdata"><small>{p.category}</small><h3>{p.name}</h3><div className="price"><strong>{money(p.price)}</strong>{p.oldPrice&&<s>{money(p.oldPrice)}</s>}</div>{p.sizes?.length>0&&<select value={size} onChange={e=>setSize(e.target.value)}><option value="">Select size</option>{p.sizes.map(s=><option key={s}>{s}</option>)}</select>}<button className="add" onClick={()=>addCart(p,size)}><ShoppingBag size={17}/> Add to cart</button></div></article>}

function Collections({products,addCart}){const [params,setParams]=useSearchParams();const [q,setQ]=useState('');const category=params.get('category')||'All';const list=useMemo(()=>products.filter(p=>p.active!==false).filter(p=>category==='All'||p.category===category).filter(p=>(p.name+' '+p.category).toLowerCase().includes(q.toLowerCase())),[products,category,q]);return <Page title="Collections" intro="Ethnic, western, dresses, co-ords, tops and girls styles."><div className="filters"><div className="search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products"/></div><div className="chips"><button className={category==='All'?'active':''} onClick={()=>setParams({})}>All</button>{CATS.map(c=><button key={c} className={category===c?'active':''} onClick={()=>setParams({category:c})}>{c}</button>)}</div></div>{list.length?<ProductGrid products={list} addCart={addCart}/>:<Empty text="No products found."/>}</Page>}
function Category({title,products,addCart}){return <Page title={title} intro={`Explore our ${title.toLowerCase()} collection.`}><ProductGrid products={products.filter(p=>p.active!==false&&p.category===title)} addCart={addCart}/></Page>}
function NewArrivals({products,addCart}){const list=products.filter(p=>p.active!==false&&['New','Fresh','Trending'].includes(p.badge));return <Page title="New Arrivals" intro="The newest pieces at Fashion 2 Gether."><ProductGrid products={list.length?list:products.slice(0,8)} addCart={addCart}/></Page>}
function Page({title,intro,children}){return <><section className="pagehero"><div className="wrap"><img src="/logo.svg" alt=""/><div><span>FASHION 2 GETHER</span><h1>{title}</h1><p>{intro}</p></div></div></section><section className="section"><div className="wrap">{children}</div></section></>}
function Empty({text}){return <div className="empty"><ShoppingBag/><p>{text}</p></div>}

function reelEmbed(url){const m=url?.match(/instagram\.com\/(reel|p)\/([^/?#]+)/i);return m?`https://www.instagram.com/${m[1]}/${m[2]}/embed`:null}
function ReelGrid({reels}){return <div className="reels">{reels.filter(r=>r.active!==false).map(r=>{const embed=reelEmbed(r.url);return <article className="reel" key={r.id}>{embed?<iframe title={r.title} src={embed} loading="lazy"/>:<a className="reelcover" href={r.url||INSTAGRAM} target="_blank" rel="noreferrer"><img src={r.cover} alt={r.title}/><i><Play fill="currentColor"/></i></a>}<div><b>{r.title}</b><a href={r.url||INSTAGRAM} target="_blank" rel="noreferrer">Instagram <ExternalLink size={14}/></a></div></article>})}</div>}
function ReelsPage({reels}){return <Page title="Instagram Reels" intro="Add your exact public Instagram reel links from Admin and they will appear here."><ReelGrid reels={reels}/></Page>}
function About(){return <Page title="About Us" intro="Fashion for women and girls, with a local Yavatmal touch."><div className="about"><img src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1100&q=86"/><div><h2>Wear better. Look better.</h2><p>Fashion 2 Gether brings together ethnic, western, casual and festive styles for women and girls. The website is designed so customers can browse, create a cart and send an online delivery order without waiting for multiple pages to reload.</p><p>For live stock, colour and fitting support, customers can also connect through WhatsApp or visit the Yavatmal store.</p></div></div></Page>}
function Contact(){return <Page title="Contact & Store" intro="Call, WhatsApp, Instagram or visit us."><div className="contact"><a href={`tel:${PHONE.replace(/\s/g,'')}`}><Phone/><span><small>Call</small><b>{PHONE}</b></span></a><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer"><MessageCircle/><span><small>WhatsApp</small><b>Chat with store</b></span></a><a href={INSTAGRAM} target="_blank" rel="noreferrer"><Instagram/><span><small>Instagram</small><b>@fashion2gether_</b></span></a><a href={MAPS} target="_blank" rel="noreferrer"><MapPin/><span><small>Store</small><b>{ADDRESS}</b></span></a></div></Page>}

function CartDrawer({cart,setQty,close,clear}){
  const [checkout,setCheckout]=useState(false);const [done,setDone]=useState(false);const [busy,setBusy]=useState(false)
  const [form,setForm]=useState({customer_name:'',phone:'',address:'',city:'Yavatmal',pincode:'',payment_method:'COD',customer_note:''})
  const total=cart.reduce((s,x)=>s+x.price*x.qty,0)
  const submit=async e=>{e.preventDefault();setBusy(true);try{await createOrder({...form,product_name:cart.map(x=>`${x.name} x${x.qty}`).join(', '),amount:total,items:cart,delivery_type:'Online Delivery',status:'New'});setDone(true);clear()}finally{setBusy(false)}}
  return <div className="drawerback" onMouseDown={e=>e.target===e.currentTarget&&close()}><aside className="drawer"><div className="drawerhead"><div><small>FASHION 2 GETHER</small><h2>{done?'Order placed':'Your cart'}</h2></div><button onClick={close}><X/></button></div>{done?<div className="done"><CheckCircle2 size={54}/><h3>Order saved successfully</h3><p>Our store team can contact you on the mobile number you entered.</p><a className="btn hot" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hi Fashion 2 Gether! I just placed an online delivery order from the website.')}`} target="_blank" rel="noreferrer">Confirm on WhatsApp</a></div>:cart.length===0?<Empty text="Your cart is empty."/>:!checkout?<><div className="cartlist">{cart.map(x=><div className="cartitem" key={x.key}><img src={x.image}/><div><b>{x.name}</b><span>{x.size?`Size ${x.size} • `:''}{money(x.price)}</span><div className="qty"><button onClick={()=>setQty(x.key,x.qty-1)}><Minus size={15}/></button><b>{x.qty}</b><button onClick={()=>setQty(x.key,x.qty+1)}><Plus size={15}/></button></div></div><strong>{money(x.price*x.qty)}</strong></div>)}</div><div className="cartfoot"><div><span>Subtotal</span><b>{money(total)}</b></div><button className="btn hot full" onClick={()=>setCheckout(true)}><Truck size={18}/> Continue to delivery</button></div></>:<form className="checkout" onSubmit={submit}><button type="button" className="backlink" onClick={()=>setCheckout(false)}>← Back to cart</button><h3>Delivery details</h3><label>Name<input required value={form.customer_name} onChange={e=>setForm({...form,customer_name:e.target.value})}/></label><label>Mobile<input required pattern="[0-9+ ]{10,15}" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label><label>Full address<textarea required rows="3" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></label><div className="twocol"><label>City<input required value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/></label><label>Pincode<input required pattern="[0-9]{6}" value={form.pincode} onChange={e=>setForm({...form,pincode:e.target.value})}/></label></div><label>Payment<select value={form.payment_method} onChange={e=>setForm({...form,payment_method:e.target.value})}><option>COD</option><option>UPI on confirmation</option><option>Store pickup</option></select></label><label>Note<textarea rows="2" value={form.customer_note} onChange={e=>setForm({...form,customer_note:e.target.value})}/></label><div className="checkouttotal"><span>Order total</span><b>{money(total)}</b></div><button className="btn hot full" disabled={busy}><CreditCard size={18}/>{busy?'Saving order…':'Place order'}</button></form>}</aside></div>
}

function Admin({products,reels,refresh}){
  const [user,setUser]=useState(null);const [tab,setTab]=useState('products');const [orders,setOrders]=useState([])
  const reloadOrders=()=>loadOrders().then(setOrders)
  useEffect(()=>{if(user)reloadOrders()},[user,tab])
  if(!user)return <AdminLogin onLogin={setUser}/>
  return <div className="admin"><aside className="aside"><Link to="/" className="adminlogo"><img src="/logo.svg"/><div><b>F2G Admin</b><small>{cloudEnabled?'Cloud connected':'Local demo mode'}</small></div></Link><button className={tab==='products'?'active':''} onClick={()=>setTab('products')}><Package/> Product Cards</button><button className={tab==='orders'?'active':''} onClick={()=>setTab('orders')}><ClipboardList/> Online Orders</button><button className={tab==='reels'?'active':''} onClick={()=>setTab('reels')}><Film/> Reels</button><div className="spacer"/><Link to="/"><ExternalLink/> View Website</Link><button onClick={async()=>{await adminLogout();setUser(null)}}><LogOut/> Logout</button></aside><section className="adminmain"><div className="adminhead"><div><small>ADMIN DASHBOARD</small><h1>{tab==='products'?'Product Cards':tab==='orders'?'Online Delivery Orders':'Instagram Reels'}</h1></div><span>{cloudEnabled?'Supabase':'Browser storage'}</span></div>{tab==='products'&&<ProductsAdmin products={products} refresh={refresh}/>} {tab==='orders'&&<OrdersAdmin orders={orders} reload={reloadOrders}/>} {tab==='reels'&&<ReelsAdmin reels={reels} refresh={refresh}/>}</section></div>
}
function AdminLogin({onLogin}){const [email,setEmail]=useState('admin@fashion2gether.in');const [password,setPassword]=useState('');const [error,setError]=useState('');const submit=async e=>{e.preventDefault();setError('');try{onLogin(await adminLogin(email,password))}catch(err){setError(err.message)}};return <div className="login"><form onSubmit={submit}><img src="/logo.svg"/><h1>Admin Login</h1><p>Manage product cards, reels and online delivery orders.</p><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<div className="error">{error}</div>}<button className="btn hot full">Login</button>{!cloudEnabled&&<small>Demo password: <code>F2G@2026</code></small>}<Link to="/">← Back to store</Link></form></div>}

function ProductsAdmin({products,refresh}){
  const blank={name:'',category:'Ethnic Wear',price:'',oldPrice:'',image:'',badge:'New',description:'',sizes:'S,M,L,XL',active:true};const [show,setShow]=useState(false);const [editing,setEditing]=useState(null);const [form,setForm]=useState(blank);const [busy,setBusy]=useState(false)
  const startNew=()=>{setEditing(null);setForm(blank);setShow(true);window.scrollTo({top:0,behavior:'smooth'})}
  const edit=p=>{setEditing(p.id);setForm({...p,sizes:(p.sizes||[]).join(',')});setShow(true);window.scrollTo({top:0,behavior:'smooth'})}
  const submit=async e=>{e.preventDefault();setBusy(true);try{await saveProduct({...form,id:editing||undefined,price:Number(form.price),oldPrice:form.oldPrice?Number(form.oldPrice):null,sizes:String(form.sizes).split(',').map(x=>x.trim()).filter(Boolean)});await refresh();setShow(false);setEditing(null);setForm(blank)}finally{setBusy(false)}}
  const del=async id=>{if(confirm('Delete this product card?')){await removeProduct(id);await refresh()}}
  return <><div className="adminactions"><button className="btn hot" onClick={startNew}><Plus size={18}/> Add New Product Card</button><b>{products.length} cards</b></div>{show&&<form className="adminform" onSubmit={submit}><div className="formhead"><div><h2>{editing?'Edit Product Card':'Add New Product Card'}</h2><p>Add image, category, price, sizes and description.</p></div><button type="button" onClick={()=>setShow(false)}><X/></button></div><div className="fields"><label>Product Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{CATS.map(c=><option key={c}>{c}</option>)}</select></label><label>Price ₹<input required type="number" min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></label><label>Old Price ₹<input type="number" min="0" value={form.oldPrice||''} onChange={e=>setForm({...form,oldPrice:e.target.value})}/></label><label className="wide">Image URL<input required type="url" value={form.image} onChange={e=>setForm({...form,image:e.target.value})}/></label><label>Badge<input value={form.badge||''} onChange={e=>setForm({...form,badge:e.target.value})}/></label><label>Sizes<input value={form.sizes} onChange={e=>setForm({...form,sizes:e.target.value})}/></label><label className="wide">Description<textarea rows="3" value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})}/></label></div><button className="btn hot" disabled={busy}>{busy?'Saving…':editing?'Update Product':'Add Product Card'}</button></form>}<div className="adminlist"><div className="listhead"><b>Current Product Cards</b><span>Customers can add these to cart</span></div>{products.map(p=><div className="prow" key={p.id}><img src={p.image}/><div className="grow"><b>{p.name}</b><span>{p.category} • {money(p.price)}</span></div><button onClick={()=>edit(p)}><Pencil size={17}/></button><button onClick={()=>del(p.id)}><Trash2 size={17}/></button></div>)}</div></>
}

function OrdersAdmin({orders,reload}){
  const blank={customer_name:'',phone:'',product_name:'',amount:'',address:'',city:'Yavatmal',pincode:'',payment_method:'COD',customer_note:'',status:'New',delivery_type:'Online Delivery',quantity:1};const [show,setShow]=useState(false);const [editing,setEditing]=useState(null);const [form,setForm]=useState(blank);const [busy,setBusy]=useState(false)
  const newOrder=()=>{setEditing(null);setForm(blank);setShow(true)}
  const edit=o=>{setEditing(o.id);setForm({...blank,...o,amount:o.amount||'',customer_note:o.customer_note||''});setShow(true);window.scrollTo({top:0,behavior:'smooth'})}
  const submit=async e=>{e.preventDefault();setBusy(true);try{await saveOrder({...form,id:editing||undefined,amount:Number(form.amount||0),quantity:Number(form.quantity||1)});await reload();setShow(false);setEditing(null);setForm(blank)}finally{setBusy(false)}}
  const del=async id=>{if(confirm('Delete this order?')){await removeOrder(id);reload()}}
  const status=async(id,s)=>{await updateOrderStatus(id,s);reload()}
  return <><div className="adminactions"><button className="btn hot" onClick={newOrder}><Plus/> Add Online Order</button><b>{orders.length} orders</b></div>{show&&<form className="adminform" onSubmit={submit}><div className="formhead"><div><h2>{editing?'Edit Online Order':'Add Online Delivery Order'}</h2><p>Admin can manually create or edit delivery orders.</p></div><button type="button" onClick={()=>setShow(false)}><X/></button></div><div className="fields"><label>Customer Name<input required value={form.customer_name} onChange={e=>setForm({...form,customer_name:e.target.value})}/></label><label>Mobile<input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label><label>Product / Items<input required value={form.product_name} onChange={e=>setForm({...form,product_name:e.target.value})}/></label><label>Amount ₹<input type="number" min="0" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/></label><label className="wide">Delivery Address<input value={form.address||''} onChange={e=>setForm({...form,address:e.target.value})}/></label><label>City<input value={form.city||''} onChange={e=>setForm({...form,city:e.target.value})}/></label><label>Pincode<input value={form.pincode||''} onChange={e=>setForm({...form,pincode:e.target.value})}/></label><label>Payment<select value={form.payment_method} onChange={e=>setForm({...form,payment_method:e.target.value})}><option>COD</option><option>UPI on confirmation</option><option>Store pickup</option></select></label><label>Status<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>New</option><option>Contacted</option><option>Confirmed</option><option>Closed</option></select></label><label className="wide">Note<textarea rows="3" value={form.customer_note||''} onChange={e=>setForm({...form,customer_note:e.target.value})}/></label></div><button className="btn hot" disabled={busy}>{busy?'Saving…':editing?'Update Order':'Add Order'}</button></form>}<div className="adminlist orders"><div className="listhead"><b>Online Delivery Orders</b><span>Add, edit, delete and update status</span></div>{orders.length?orders.map(o=><div className="orow" key={o.id}><div><b>{o.customer_name}</b><a href={`tel:${o.phone}`}>{o.phone}</a></div><div className="grow"><b>{o.product_name}</b><span>{money(o.amount)} • {o.payment_method||'COD'}</span><small>{[o.address,o.city,o.pincode].filter(Boolean).join(', ')||'No delivery address'}</small></div><select value={o.status||'New'} onChange={e=>status(o.id,e.target.value)}><option>New</option><option>Contacted</option><option>Confirmed</option><option>Closed</option></select><button onClick={()=>edit(o)}><Pencil size={17}/></button><button onClick={()=>del(o.id)}><Trash2 size={17}/></button></div>):<Empty text="No online orders yet."/>}</div></>
}

function ReelsAdmin({reels,refresh}){const blank={title:'',url:'',cover:'',active:true};const [form,setForm]=useState(blank);const [editing,setEditing]=useState(null);const submit=async e=>{e.preventDefault();await saveReel({...form,id:editing||undefined});setForm(blank);setEditing(null);refresh()};const del=async id=>{if(confirm('Delete this reel?')){await removeReel(id);refresh()}};return <><form className="adminform" onSubmit={submit}><div className="formhead"><div><h2>{editing?'Edit Reel':'Add Instagram Reel'}</h2><p>Paste the exact public Instagram reel URL.</p></div></div><div className="fields"><label>Title<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><label>Reel URL<input required type="url" value={form.url} onChange={e=>setForm({...form,url:e.target.value})}/></label><label className="wide">Cover Image URL<input required type="url" value={form.cover} onChange={e=>setForm({...form,cover:e.target.value})}/></label></div><button className="btn hot"><Plus/> {editing?'Update Reel':'Add Reel'}</button></form><div className="adminlist"><div className="listhead"><b>Reels</b><span>{reels.length} items</span></div>{reels.map(r=><div className="prow" key={r.id}><img src={r.cover}/><div className="grow"><b>{r.title}</b><span>{r.url}</span></div><button onClick={()=>{setEditing(r.id);setForm(r)}}><Pencil size={17}/></button><button onClick={()=>del(r.id)}><Trash2 size={17}/></button></div>)}</div></>}

function Footer(){return <footer><div className="wrap footgrid"><div><Link to="/" className="footlogo"><img src="/logo.svg"/><span><b>Fashion 2 Gether</b><small>Wear better. Look better.</small></span></Link><p>Women’s & girls’ fashion in Yavatmal.</p></div><div><b>Shop</b><Link to="/collections">Collections</Link><Link to="/new-arrivals">New arrivals</Link><Link to="/reels">Reels</Link></div><div><b>Contact</b><a href={`tel:${PHONE.replace(/\s/g,'')}`}>{PHONE}</a><a href={INSTAGRAM} target="_blank" rel="noreferrer">Instagram</a><a href={MAPS} target="_blank" rel="noreferrer">Google Maps</a></div><div><b>Admin</b><Link to="/admin">Dashboard</Link></div></div><div className="wrap copyright">© {new Date().getFullYear()} Fashion 2 Gether • Yavatmal</div></footer>}
function NotFound(){return <div className="notfound"><img src="/logo.svg"/><h1>Page not found</h1><p>The page you opened does not exist.</p><Link to="/" className="btn hot">Back to Home</Link></div>}
