const { useState, useEffect, useRef, useCallback } = React;

/* ─── DATA ─────────────────────────────────────────── */
const RIDES = [
  { id:'economy', name:'Economy', icon:'🚗', eta:'3 min', base:8, per:1.2, seats:4, desc:'Affordable everyday rides' },
  { id:'comfort', name:'Comfort', icon:'🚙', eta:'5 min', base:12, per:1.8, seats:4, desc:'Newer cars, extra legroom' },
  { id:'xl',      name:'XL',      icon:'🚐', eta:'7 min', base:16, per:2.4, seats:6, desc:'Up to 6 passengers' },
  { id:'black',   name:'Black',   icon:'🏎', eta:'10 min',base:24, per:3.2, seats:4, desc:'Premium black car service' },
];

const SERVICES = [
  { icon:'🚗', title:'Ride', desc:'Get a ride in minutes. Safe, affordable, reliable — wherever you need to go.', tag:'Most popular' },
  { icon:'📦', title:'Delivery', desc:'Send packages across the city. Fast and trackable door-to-door delivery.', tag:null },
  { icon:'💼', title:'Business', desc:'Streamlined travel for teams. Centralized billing, reporting, and controls.', tag:'New' },
  { icon:'🛵', title:'Flash', desc:'Ultra-fast deliveries under 30 minutes for urgent errands.', tag:'Beta' },
];

const TESTIMONIALS = [
  { name:'Sarah M.', role:'Marketing Manager', text:'RideFlow has completely changed how I commute. Clean cars, punctual drivers, and always transparent pricing. I use it daily.', rating:5, avatar:'SM' },
  { name:'James K.', role:'Software Engineer', text:'The app is incredibly smooth. Booking takes 10 seconds and the driver always arrives on time. Best ride service in the city.', rating:5, avatar:'JK' },
  { name:'Amira L.', role:'Freelance Designer', text:"I love the Business tier — expense reports are auto-generated and my company loves the centralized billing. Couldn't ask for more.", rating:5, avatar:'AL' },
];

const FAKE_RIDES = [
  { from:'Times Square', to:'JFK Airport', date:'Today, 9:14 AM', price:'$38', status:'completed', type:'Black' },
  { from:'Brooklyn Bridge', to:'Midtown', date:'Yesterday, 6:30 PM', price:'$22', status:'completed', type:'Comfort' },
  { from:'SoHo', to:'Upper East Side', date:'Apr 7, 3:45 PM', price:'$16', status:'completed', type:'Economy' },
  { from:'Penn Station', to:'Flushing', date:'Apr 3, 8:20 AM', price:'$28', status:'cancelled', type:'XL' },
];

/* ─── UTILITIES ─────────────────────────────────────── */
function calcPrice(ride, distance) {
  if (!distance) return null;
  const price = ride.base + ride.per * distance;
  return price.toFixed(2);
}

function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── ICONS ─────────────────────────────────────────── */
const Icon = {
  Logo: () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#C8F135"/>
      <path d="M14 6C10.13 6 7 9.13 7 13c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S12.62 8 14 8s2.5 1.12 2.5 2.5S15.38 15.5 14 15.5z" fill="#000"/>
    </svg>
  ),
  Sun: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  Moon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Menu: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Close: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Arrow: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Pin: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Star: ({filled}) => <svg width="14" height="14" viewBox="0 0 24 24" fill={filled?"#C8F135":"none"} stroke="#C8F135" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  User: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Car: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-3"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
  Mail: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Phone: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 11c-1.06-2.57-1.72-5.36-1.07-8.63A2 2 0 0 1 5.22 0h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9.91 8.1a16 16 0 0 0 6 6l1.46-1.46a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 24 14.92z"/></svg>,
  Shield: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Zap: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Dollar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  ChevDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
};

/* ─── NAVBAR ─────────────────────────────────────────── */
function Navbar({ page, setPage, dark, setDark }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  const navBg = scrolled
    ? (dark ? 'bg-dark-800/95 backdrop-blur-md border-b border-white/5' : 'bg-white/95 backdrop-blur-md border-b border-black/5 shadow-sm')
    : 'bg-transparent';
  const links = ['Home','Ride','Drive','About'];
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => setPage('home')} className="flex items-center gap-2.5 font-display font-700">
          <Icon.Logo/>
          <span className={`text-lg font-bold tracking-tight ${dark ? 'text-white' : 'text-black'}`}>RideFlow</span>
        </button>
        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <button key={l}
              onClick={() => setPage(l === 'Home' ? 'home' : l === 'Ride' ? 'ride' : l === 'Drive' ? 'drive' : 'about')}
              className={`nav-link text-sm font-medium transition-colors ${
                dark ? 'text-white/70 hover:text-white' : 'text-black/60 hover:text-black'
              } ${(page === (l==='Home'?'home':l.toLowerCase())) ? (dark?'text-white':'text-black') : ''}`}
            >{l}</button>
          ))}
        </div>
        {/* Right controls */}
        <div className="flex items-center gap-3">
          <button onClick={() => setDark(!dark)}
            className={`p-2 rounded-full transition-colors ${dark ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-black/50 hover:text-black hover:bg-black/5'}`}>
            {dark ? <Icon.Sun/> : <Icon.Moon/>}
          </button>
          <button onClick={() => setPage('login')}
            className={`hidden md:block text-sm font-medium px-4 py-2 rounded-full transition-colors ${
              dark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-black/60 hover:text-black hover:bg-black/5'
            }`}>Log in</button>
          <button onClick={() => setPage('signup')}
            className="hidden md:block text-sm font-bold px-5 py-2 rounded-full bg-accent text-black hover:bg-accent/90 transition-all hover:scale-105 active:scale-95">
            Sign up
          </button>
          <button className={`md:hidden p-2 ${dark?'text-white':'text-black'}`} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <Icon.Close/> : <Icon.Menu/>}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className={`md:hidden px-6 pb-6 pt-2 flex flex-col gap-4 border-t ${dark ? 'border-white/5 bg-dark-800' : 'border-black/5 bg-white'}`}>
          {links.map(l => (
            <button key={l} onClick={() => { setPage(l==='Home'?'home':l.toLowerCase()); setMenuOpen(false); }}
              className={`text-left text-base font-medium py-1 ${dark?'text-white/80':'text-black/80'}`}>{l}</button>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={() => { setPage('login'); setMenuOpen(false); }}
              className={`flex-1 py-2.5 rounded-full border text-sm font-medium ${dark?'border-white/20 text-white':'border-black/20 text-black'}`}>Log in</button>
            <button onClick={() => { setPage('signup'); setMenuOpen(false); }}
              className="flex-1 py-2.5 rounded-full bg-accent text-black text-sm font-bold">Sign up</button>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── MAP COMPONENT ─────────────────────────────────── */
function MapComponent({ dark, pickup, destination }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [driverPos, setDriverPos] = useState({ x: 0.4, y: 0.5 });
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    const roads = [
      { x1:0,y1:.3,x2:1,y2:.3 }, { x1:0,y1:.5,x2:1,y2:.5 }, { x1:0,y1:.7,x2:1,y2:.7 },
      { x1:.2,y1:0,x2:.2,y2:1 }, { x1:.5,y1:0,x2:.5,y2:1 }, { x1:.8,y1:0,x2:.8,y2:1 },
      { x1:0,y1:.15,x2:1,y2:.15 }, { x1:0,y1:.85,x2:1,y2:.85 },
      { x1:.35,y1:0,x2:.35,y2:1 }, { x1:.65,y1:0,x2:.65,y2:1 },
      { x1:0.1,y1:0,x2:.5,y2:.5 }, { x1:.5,y1:.5,x2:.9,y2:1 },
    ];
    const blocks = [];
    for(let i=0; i<12; i++) blocks.push({x:.05+Math.random()*.9,y:.05+Math.random()*.9,w:.06+Math.random()*.08,h:.04+Math.random()*.06});

    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0,0,W,H);
      const bg = dark ? '#0d0d0d' : '#f0f0f0';
      ctx.fillStyle = bg;
      ctx.fillRect(0,0,W,H);

      // Grid blocks (buildings)
      blocks.forEach(b => {
        ctx.fillStyle = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';
        ctx.fillRect(b.x*W, b.y*H, b.w*W, b.h*H);
      });

      // Roads
      roads.forEach(r => {
        ctx.strokeStyle = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(r.x1*W, r.y1*H);
        ctx.lineTo(r.x2*W, r.y2*H);
        ctx.stroke();
      });

      // Route line (if pickup + destination)
      if(pickup && destination) {
        const sx=.2*W, sy=.7*H, ex=.75*W, ey=.3*H;
        ctx.strokeStyle = 'rgba(200,241,53,0.7)';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6,4]);
        ctx.beginPath();
        ctx.moveTo(sx,sy);
        ctx.quadraticCurveTo(.5*W,.2*H,ex,ey);
        ctx.stroke();
        ctx.setLineDash([]);

        // Pickup pin
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(sx,sy,7,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.arc(sx,sy,4,0,Math.PI*2); ctx.fill();

        // Dest pin
        ctx.fillStyle = '#C8F135';
        ctx.beginPath(); ctx.arc(ex,ey,8,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.arc(ex,ey,4,0,Math.PI*2); ctx.fill();
      }

      // Animated driver dots
      const t = frame * 0.01;
      const drivers = [
        { bx:.4, by:.5, rx:.05, ry:.04 },
        { bx:.6, by:.3, rx:.04, ry:.05 },
        { bx:.3, by:.65, rx:.03, ry:.04 },
        { bx:.7, by:.6, rx:.05, ry:.03 },
      ];
      drivers.forEach((d,i) => {
        const x = (d.bx + Math.sin(t+i*1.5)*d.rx) * W;
        const y = (d.by + Math.cos(t+i*1.2)*d.ry) * H;
        ctx.fillStyle = dark ? 'rgba(200,241,53,0.9)' : 'rgba(0,0,0,0.8)';
        ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle = dark ? 'rgba(200,241,53,0.3)' : 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(x,y,10+Math.sin(t*2+i)*3,0,Math.PI*2); ctx.stroke();
      });

      frame++;
      animRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [dark, pickup, destination]);

  return <canvas ref={canvasRef} width={800} height={480} className="w-full h-full" style={{display:'block'}}/>;
}

/* ─── HOME PAGE ──────────────────────────────────────── */
function HomePage({ setPage, dark }) {
  useScrollReveal();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const suggestions = ['JFK Airport', 'Times Square', 'Brooklyn Bridge', 'Central Park', 'Penn Station', 'Grand Central', 'LaGuardia Airport', 'Wall Street'];
  const [showSuggestions, setShowSuggestions] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p+1)%TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const inputClass = `w-full px-4 py-3.5 rounded-xl text-sm font-medium outline-none rf-input transition-all ${
    dark ? 'bg-dark-700 border border-white/10 text-white placeholder-white/30' : 'bg-white border border-black/10 text-black placeholder-black/30 shadow-sm'
  }`;

  return (
    <div className={dark ? 'bg-dark-900 text-white' : 'bg-light-50 text-black'}>
      {/* HERO */}
      <section className={`relative min-h-screen flex items-center overflow-hidden ${dark ? 'hero-bg' : 'hero-bg-light'}`}>
        {/* Floating elements */}
        <div className="absolute top-24 right-12 float-badge hidden lg:block">
          <div className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border ${dark?'bg-dark-700 border-white/10 text-white':'bg-white border-black/10 text-black shadow-lg'}`}>
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot"></span>
            342 drivers nearby
          </div>
        </div>
        <div className="absolute bottom-32 right-16 float-badge hidden lg:block" style={{animationDelay:'.8s'}}>
          <div className={`px-4 py-3 rounded-2xl text-xs border ${dark?'bg-dark-700 border-white/10':'bg-white border-black/10 shadow-lg'}`}>
            <div className="text-xs font-bold mb-1">Your driver</div>
            <div className={`text-xs ${dark?'text-white/50':'text-black/50'}`}>Arriving in 3 min · XYZ-4829</div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="animate-fade-up">
            <div className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-6 ${dark?'bg-accent/10 text-accent':'bg-black/5 text-black'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              Available 24/7 in 50+ cities
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-800 leading-tight tracking-tight mb-6">
              Go anywhere<br/>
              <span className="text-accent">with ease.</span>
            </h1>
            <p className={`text-lg mb-10 max-w-md leading-relaxed ${dark?'text-white/50':'text-black/50'}`}>
              Request a ride in seconds. Get picked up by a top-rated driver. Arrive in style — every time.
            </p>

            {/* Booking form */}
            <div className={`p-5 rounded-2xl max-w-md border ${dark?'bg-dark-800 border-white/5':'bg-light-100 border-black/5 shadow-xl'}`}>
              <div className="flex flex-col gap-3 mb-4 relative">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/50 block"></span>
                  </span>
                  <input value={pickup} onChange={e=>setPickup(e.target.value)}
                    onFocus={() => setShowSuggestions('pickup')} onBlur={() => setTimeout(()=>setShowSuggestions(null),150)}
                    placeholder="Pickup location" className={`${inputClass} pl-9`}/>
                  {showSuggestions === 'pickup' && (
                    <div className={`absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-20 border ${dark?'bg-dark-700 border-white/10':'bg-white border-black/10 shadow-xl'}`}>
                      {suggestions.filter(s=>!pickup||s.toLowerCase().includes(pickup.toLowerCase())).slice(0,4).map(s => (
                        <button key={s} onMouseDown={() => setPickup(s)}
                          className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${dark?'hover:bg-white/5 text-white/70':'hover:bg-black/3 text-black/70'}`}>
                          <Icon.Pin/>{s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className={`absolute left-[1.2rem] top-[3.2rem] w-px h-3 ${dark?'bg-white/20':'bg-black/20'}`}></div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-accent block"></span>
                  </span>
                  <input value={destination} onChange={e=>setDestination(e.target.value)}
                    onFocus={() => setShowSuggestions('dest')} onBlur={() => setTimeout(()=>setShowSuggestions(null),150)}
                    placeholder="Where to?" className={`${inputClass} pl-9`}/>
                  {showSuggestions === 'dest' && (
                    <div className={`absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-20 border ${dark?'bg-dark-700 border-white/10':'bg-white border-black/10 shadow-xl'}`}>
                      {suggestions.filter(s=>!destination||s.toLowerCase().includes(destination.toLowerCase())).slice(0,4).map(s => (
                        <button key={s} onMouseDown={() => setDestination(s)}
                          className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${dark?'hover:bg-white/5 text-white/70':'hover:bg-black/3 text-black/70'}`}>
                          <Icon.Pin/>{s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => setPage('ride')}
                className="w-full py-3.5 rounded-xl bg-accent text-black font-bold text-sm hover:bg-accent/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                Request ride <Icon.Arrow/>
              </button>
            </div>
          </div>

          {/* Right — animated map */}
          <div className="relative hidden lg:block animate-fade-in" style={{animationDelay:'.3s'}}>
            <div className={`rounded-3xl overflow-hidden border h-96 ${dark?'border-white/5':'border-black/5 shadow-2xl'}`}>
              <MapComponent dark={dark} pickup={pickup} destination={destination}/>
            </div>
            {/* Stats overlay */}
            <div className={`absolute -bottom-5 -left-5 px-5 py-3.5 rounded-2xl border ${dark?'bg-dark-800 border-white/5':'bg-white border-black/5 shadow-xl'}`}>
              <div className={`text-xs mb-0.5 ${dark?'text-white/40':'text-black/40'}`}>Avg. wait time</div>
              <div className="font-display text-2xl font-bold">2.4 <span className="text-sm font-normal text-accent">min</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className={`py-24 ${dark?'bg-dark-800':'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal text-center mb-14">
            <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${dark?'text-accent':'text-black/40'}`}>Our services</div>
            <h2 className="font-display text-4xl md:text-5xl font-800 tracking-tight">Everything you need,<br/><span className={dark?'text-white/50':'text-black/40'}>one app.</span></h2>
          </div>
          <div className="reveal stagger grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map(s => (
              <div key={s.title} className={`card-hover group p-6 rounded-2xl border cursor-pointer relative overflow-hidden ${dark?'bg-dark-700 border-white/5 hover:border-white/15':'bg-light-50 border-black/5 hover:border-black/10 hover:shadow-lg'}`}>
                {s.tag && <span className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.tag==='New'?'bg-accent text-black':s.tag==='Beta'?'bg-blue-500/20 text-blue-400':dark?'bg-white/10 text-white/50':'bg-black/5 text-black/40'}`}>{s.tag}</span>}
                <div className="text-3xl mb-4">{s.icon}</div>
                <div className="font-display text-lg font-700 mb-2">{s.title}</div>
                <p className={`text-sm leading-relaxed ${dark?'text-white/40':'text-black/50'}`}>{s.desc}</p>
                <div className={`mt-4 text-xs font-bold flex items-center gap-1.5 transition-colors group-hover:text-accent ${dark?'text-white/30':'text-black/40'}`}>
                  Learn more <Icon.Arrow/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={`py-24 ${dark?'bg-dark-900':'bg-light-100'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal text-center mb-16">
            <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${dark?'text-accent':'text-black/40'}`}>How it works</div>
            <h2 className="font-display text-4xl md:text-5xl font-800 tracking-tight">Ride in 3 simple steps</h2>
          </div>
          <div className="reveal stagger grid md:grid-cols-3 gap-8 relative">
            {[
              { n:'01', icon:'📍', title:'Enter your location', desc:'Type your pickup address and destination. Get instant route and price estimates.' },
              { n:'02', icon:'🚗', title:'Choose your ride', desc:'Pick from Economy, Comfort, XL, or Black. See driver ratings before you confirm.' },
              { n:'03', icon:'✨', title:'Enjoy your trip', desc:"Your driver arrives in minutes. Track them live and pay automatically — no cash needed." },
            ].map((s, i) => (
              <div key={s.n} className={`relative p-8 rounded-2xl border ${dark?'bg-dark-800 border-white/5':'bg-white border-black/5 shadow-sm'}`}>
                <div className={`text-4xl font-display font-800 mb-5 opacity-20`}>{s.n}</div>
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-display text-xl font-700 mb-3">{s.title}</h3>
                <p className={`text-sm leading-relaxed ${dark?'text-white/40':'text-black/50'}`}>{s.desc}</p>
                {i < 2 && <div className={`absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-px hidden md:block ${dark?'bg-white/10':'bg-black/10'}`}></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DRIVER SECTION */}
      <section className={`py-24 ${dark?'bg-dark-800':'bg-black'}`}>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <div className="text-xs font-bold uppercase tracking-widest mb-4 text-accent">For drivers</div>
            <h2 className="font-display text-4xl md:text-5xl font-800 tracking-tight text-white mb-6">
              Earn money<br/>on your terms.
            </h2>
            <p className="text-white/50 text-lg mb-8 max-w-md leading-relaxed">
              Drive when you want, earn what you deserve. Thousands of drivers are making great income with RideFlow every day.
            </p>
            <div className="grid grid-cols-3 gap-5 mb-10">
              {[{val:'$1,200', label:'Avg. weekly earnings'},{val:'4.9★', label:'Driver satisfaction'},{val:'50+', label:'Cities covered'}].map(s => (
                <div key={s.label}>
                  <div className="font-display text-2xl font-800 text-accent">{s.val}</div>
                  <div className="text-xs text-white/40 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setPage('drive')}
              className="inline-flex items-center gap-2 bg-accent text-black font-bold px-7 py-3.5 rounded-full hover:bg-accent/90 transition-all hover:scale-105 active:scale-95">
              Become a driver <Icon.Arrow/>
            </button>
          </div>
          <div className="reveal hidden lg:grid grid-cols-2 gap-4">
            {['Set your schedule','Weekly payouts','Top driver bonuses','Insurance included'].map((f,i) => (
              <div key={f} className="p-5 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                  <span className="text-accent"><Icon.Check/></span>
                </div>
                <div className="font-medium text-white text-sm">{f}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={`py-24 ${dark?'bg-dark-900':'bg-light-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal text-center mb-14">
            <h2 className="font-display text-4xl md:text-5xl font-800 tracking-tight mb-4">Why RideFlow?</h2>
            <p className={`text-base ${dark?'text-white/40':'text-black/50'}`}>Built around your safety, time, and budget.</p>
          </div>
          <div className="reveal stagger grid md:grid-cols-3 gap-6">
            {[
              { icon: <Icon.Shield/>, title:'Safety first', desc:'Every driver is background-checked, insured, and rated. Share your trip with trusted contacts.' },
              { icon: <Icon.Zap/>, title:'Lightning pickup', desc:'Our smart dispatch connects you to the nearest driver in under 2 minutes on average.' },
              { icon: <Icon.Dollar/>, title:'Transparent pricing', desc:'See your full fare before you book. No surge surprises — just honest, upfront pricing.' },
            ].map(f => (
              <div key={f.title} className={`p-8 rounded-2xl border text-center ${dark?'bg-dark-800 border-white/5':'bg-white border-black/5 shadow-sm'}`}>
                <div className={`w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center ${dark?'bg-accent/10 text-accent':'bg-black/5 text-black'}`}>
                  {f.icon}
                </div>
                <h3 className="font-display text-xl font-700 mb-3">{f.title}</h3>
                <p className={`text-sm leading-relaxed ${dark?'text-white/40':'text-black/50'}`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={`py-24 ${dark?'bg-dark-800':'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal text-center mb-14">
            <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${dark?'text-accent':'text-black/40'}`}>Reviews</div>
            <h2 className="font-display text-4xl md:text-5xl font-800 tracking-tight">Loved by riders</h2>
          </div>
          <div className="reveal grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t,i) => (
              <div key={t.name} className={`p-7 rounded-2xl border transition-all duration-300 ${i===activeTestimonial?(dark?'border-accent/30 bg-dark-700':'border-black/15 bg-light-100 shadow-lg'):(dark?'bg-dark-700/50 border-white/5':'bg-light-50 border-black/5')}`}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_,j) => <Icon.Star key={j} filled/>)}
                </div>
                <p className={`text-sm leading-relaxed mb-5 ${dark?'text-white/60':'text-black/60'}`}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">{t.avatar}</div>
                  <div>
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className={`text-xs ${dark?'text-white/30':'text-black/40'}`}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_,i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                className={`h-1.5 rounded-full transition-all ${i===activeTestimonial?'w-8 bg-accent':'w-1.5 '+(dark?'bg-white/20':'bg-black/20')}`}/>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-16 border-t ${dark?'bg-dark-900 border-white/5':'bg-light-50 border-black/5'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <Icon.Logo/>
                <span className="font-display text-lg font-700">RideFlow</span>
              </div>
              <p className={`text-sm leading-relaxed max-w-xs mb-5 ${dark?'text-white/40':'text-black/40'}`}>
                The modern way to get around. Available 24/7 in 50+ cities worldwide.
              </p>
              <div className="flex gap-3">
                {['𝕏','in','f'].map(s => (
                  <button key={s} className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold transition-colors ${dark?'border-white/10 text-white/40 hover:border-white/25 hover:text-white':'border-black/10 text-black/40 hover:border-black/25 hover:text-black'}`}>{s}</button>
                ))}
              </div>
            </div>
            {[
              { title:'Company', links:['About','Careers','Press','Blog'] },
              { title:'Products', links:['Ride','Delivery','Business','Flash'] },
              { title:'Support', links:['Help center','Safety','Accessibility','Contact'] },
            ].map(col => (
              <div key={col.title}>
                <div className={`text-xs font-bold uppercase tracking-widest mb-4 ${dark?'text-white/30':'text-black/30'}`}>{col.title}</div>
                <div className="flex flex-col gap-2.5">
                  {col.links.map(l => (
                    <button key={l} className={`text-left text-sm transition-colors ${dark?'text-white/50 hover:text-white':'text-black/50 hover:text-black'}`}>{l}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={`pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${dark?'border-white/5':'border-black/5'}`}>
            <p className={`text-xs ${dark?'text-white/20':'text-black/30'}`}>© 2025 RideFlow Inc. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <select className={`text-xs bg-transparent border rounded-lg px-3 py-1.5 outline-none ${dark?'border-white/10 text-white/40':'border-black/10 text-black/40'}`}>
                <option>🌍 English</option><option>🇫🇷 Français</option><option>🇦🇷 Español</option><option>🇩🇪 Deutsch</option>
              </select>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── RIDE BOOKING PAGE ─────────────────────────────── */
function RidePage({ dark, setPage }) {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selected, setSelected] = useState('economy');
  const [distance] = useState(12.4);
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState(null);

  const ride = RIDES.find(r => r.id === selected);
  const price = calcPrice(ride, distance);

  const confirmRide = () => {
    if(!pickup || !destination) { alert('Please enter pickup and destination'); return; }
    setStep(2);
    setTimeout(() => { setStatus('matching'); }, 500);
    setTimeout(() => { setStatus('found'); }, 3000);
  };

  const inputCls = `w-full px-4 py-3 rounded-xl text-sm rf-input outline-none transition-all ${dark?'bg-dark-700 border border-white/10 text-white placeholder-white/30':'bg-white border border-black/10 text-black placeholder-black/30'}`;

  return (
    <div className={`min-h-screen pt-16 ${dark?'bg-dark-900 text-white':'bg-light-50 text-black'}`}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${dark?'text-accent':'text-black/40'}`}>Booking</div>
          <h1 className="font-display text-4xl font-800">Book your ride</h1>
        </div>

        {step === 1 ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="flex flex-col gap-6">
              <div className={`p-6 rounded-2xl border ${dark?'bg-dark-800 border-white/5':'bg-white border-black/5 shadow-sm'}`}>
                <h2 className="font-display text-lg font-700 mb-4">Where are you going?</h2>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className={`text-xs font-medium mb-1.5 block ${dark?'text-white/40':'text-black/50'}`}>Pickup location</label>
                    <input value={pickup} onChange={e=>setPickup(e.target.value)} placeholder="e.g. Times Square, NYC" className={inputCls}/>
                  </div>
                  <div>
                    <label className={`text-xs font-medium mb-1.5 block ${dark?'text-white/40':'text-black/50'}`}>Destination</label>
                    <input value={destination} onChange={e=>setDestination(e.target.value)} placeholder="e.g. JFK Airport" className={inputCls}/>
                  </div>
                </div>
              </div>

              {/* Ride types */}
              <div className={`p-6 rounded-2xl border ${dark?'bg-dark-800 border-white/5':'bg-white border-black/5 shadow-sm'}`}>
                <h2 className="font-display text-lg font-700 mb-4">Choose ride type</h2>
                <div className="flex flex-col gap-2">
                  {RIDES.map(r => (
                    <button key={r.id} onClick={() => setSelected(r.id)}
                      className={`ride-card flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${selected===r.id?'selected':''}  ${dark?'border-white/5 hover:border-white/15 bg-dark-700':'border-black/5 hover:border-black/10 bg-light-50'}`}>
                      <span className="text-2xl">{r.icon}</span>
                      <div className="flex-1">
                        <div className="font-display font-700 text-sm">{r.name}</div>
                        <div className={`text-xs ${dark?'text-white/40':'text-black/40'}`}>{r.desc} · up to {r.seats} seats</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${calcPrice(r, distance)}</div>
                        <div className={`text-xs ${dark?'text-white/30':'text-black/40'}`}>{r.eta}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className={`p-5 rounded-2xl border ${dark?'bg-dark-800 border-white/5':'bg-white border-black/5 shadow-sm'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${dark?'text-white/40':'text-black/50'}`}>Est. distance</span>
                  <span className="font-medium text-sm">{distance} km</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-sm ${dark?'text-white/40':'text-black/50'}`}>Ride type</span>
                  <span className="font-medium text-sm">{ride.name}</span>
                </div>
                <div className={`flex justify-between items-center pt-4 border-t ${dark?'border-white/5':'border-black/5'}`}>
                  <span className="font-display font-700">Total estimate</span>
                  <span className="font-display font-800 text-2xl text-accent">${price}</span>
                </div>
              </div>

              <button onClick={confirmRide}
                className="w-full py-4 rounded-xl bg-accent text-black font-bold hover:bg-accent/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                Confirm ride <Icon.Arrow/>
              </button>
            </div>

            {/* Map */}
            <div className={`rounded-2xl overflow-hidden border h-[600px] ${dark?'border-white/5':'border-black/5 shadow-xl'}`}>
              <MapComponent dark={dark} pickup={pickup} destination={destination}/>
            </div>
          </div>
        ) : (
          /* Status view */
          <div className="max-w-md mx-auto">
            <div className={`p-8 rounded-2xl border text-center ${dark?'bg-dark-800 border-white/5':'bg-white border-black/5 shadow-xl'}`}>
              {status === 'matching' ? (
                <>
                  <div className="w-16 h-16 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-5"></div>
                  <h2 className="font-display text-xl font-700 mb-2">Finding your driver…</h2>
                  <p className={`text-sm ${dark?'text-white/40':'text-black/50'}`}>Matching you with a top-rated driver nearby</p>
                  <div className={`mt-5 h-1 rounded-full overflow-hidden ${dark?'bg-white/5':'bg-black/5'}`}>
                    <div className="progress-bar h-full bg-accent rounded-full"></div>
                  </div>
                </>
              ) : status === 'found' ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5 text-2xl animate-car-move">🚗</div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-accent/10 text-accent px-3 py-1 rounded-full mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot"></span> Driver found
                  </div>
                  <h2 className="font-display text-xl font-700 mb-1">Mohammed K.</h2>
                  <p className={`text-sm mb-5 ${dark?'text-white/40':'text-black/40'}`}>Toyota Camry · XYZ-4829 · ⭐ 4.92</p>
                  <div className={`p-4 rounded-xl mb-5 ${dark?'bg-dark-700':'bg-light-100'}`}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className={dark?'text-white/40':'text-black/50'}>From</span>
                      <span className="font-medium">{pickup || 'Your location'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={dark?'text-white/40':'text-black/50'}>To</span>
                      <span className="font-medium">{destination || 'Destination'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center">
                      <div className="font-display text-2xl font-800 text-accent">3</div>
                      <div className={`text-xs ${dark?'text-white/30':'text-black/40'}`}>min away</div>
                    </div>
                    <div className={`w-px h-10 ${dark?'bg-white/10':'bg-black/10'}`}></div>
                    <div className="text-center">
                      <div className="font-display text-2xl font-800">${price}</div>
                      <div className={`text-xs ${dark?'text-white/30':'text-black/40'}`}>est. fare</div>
                    </div>
                    <div className={`w-px h-10 ${dark?'bg-white/10':'bg-black/10'}`}></div>
                    <div className="text-center">
                      <div className="font-display text-2xl font-800">4.92</div>
                      <div className={`text-xs ${dark?'text-white/30':'text-black/40'}`}>driver rating</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className={`flex-1 py-3 rounded-xl border text-sm font-medium ${dark?'border-white/10 hover:bg-white/5':'border-black/10 hover:bg-black/3'}`}>📞 Call</button>
                    <button className={`flex-1 py-3 rounded-xl border text-sm font-medium ${dark?'border-white/10 hover:bg-white/5':'border-black/10 hover:bg-black/3'}`}>💬 Message</button>
                    <button onClick={() => {setStep(1);setStatus(null);}} className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-medium">Cancel</button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── DRIVER SIGNUP PAGE ────────────────────────────── */
function DrivePage({ dark }) {
  const [form, setForm] = useState({ name:'', email:'', phone:'', city:'', carMake:'', carModel:'', carYear:'', license:'' });
  const [submitted, setSubmitted] = useState(false);
  const set = k => e => setForm(f => ({...f,[k]:e.target.value}));
  const inputCls = `w-full px-4 py-3 rounded-xl text-sm rf-input outline-none transition-all ${dark?'bg-dark-700 border border-white/10 text-white placeholder-white/30':'bg-white border border-black/10 text-black placeholder-black/30'}`;
  const labelCls = `text-xs font-medium mb-1.5 block ${dark?'text-white/40':'text-black/50'}`;

  if(submitted) return (
    <div className={`min-h-screen pt-16 flex items-center justify-center ${dark?'bg-dark-900 text-white':'bg-light-50 text-black'}`}>
      <div className={`text-center p-12 rounded-3xl border max-w-md ${dark?'bg-dark-800 border-white/5':'bg-white border-black/5 shadow-xl'}`}>
        <div className="text-5xl mb-5">🎉</div>
        <h2 className="font-display text-3xl font-800 mb-3">Application received!</h2>
        <p className={`text-sm leading-relaxed mb-7 ${dark?'text-white/40':'text-black/50'}`}>Thanks {form.name}! Our team will review your application and get back to you within 48 hours.</p>
        <button onClick={() => setSubmitted(false)} className="px-7 py-3 rounded-full bg-accent text-black font-bold text-sm">Back to form</button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen pt-16 ${dark?'bg-dark-900 text-white':'bg-light-50 text-black'}`}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left info */}
          <div className="lg:col-span-2">
            <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${dark?'text-accent':'text-black/40'}`}>Driver portal</div>
            <h1 className="font-display text-4xl font-800 mb-5">Start earning today.</h1>
            <p className={`text-sm leading-relaxed mb-8 ${dark?'text-white/50':'text-black/50'}`}>Join thousands of drivers who are earning great income with flexible schedules. Requirements are simple.</p>
            <div className="flex flex-col gap-4">
              {['Be 21 or older','Valid driver\'s license','Pass background check','Vehicle 2015 or newer','Smartphone required'].map(r => (
                <div key={r} className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${dark?'bg-accent/10 text-accent':'bg-black/5 text-black'}`}><Icon.Check/></span>
                  <span className={`text-sm ${dark?'text-white/60':'text-black/60'}`}>{r}</span>
                </div>
              ))}
            </div>
            <div className={`mt-8 p-5 rounded-2xl border ${dark?'bg-dark-800 border-white/5':'bg-white border-black/5 shadow-sm'}`}>
              <div className="font-display text-2xl font-800 text-accent mb-1">$1,200+</div>
              <div className={`text-xs ${dark?'text-white/40':'text-black/50'}`}>Average weekly earnings for full-time drivers</div>
            </div>
          </div>

          {/* Form */}
          <div className={`lg:col-span-3 p-7 rounded-2xl border ${dark?'bg-dark-800 border-white/5':'bg-white border-black/5 shadow-xl'}`}>
            <h2 className="font-display text-xl font-700 mb-6">Your details</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div><label className={labelCls}>Full name</label><input value={form.name} onChange={set('name')} placeholder="John Smith" className={inputCls}/></div>
              <div><label className={labelCls}>Email</label><input value={form.email} onChange={set('email')} type="email" placeholder="you@email.com" className={inputCls}/></div>
              <div><label className={labelCls}>Phone number</label><input value={form.phone} onChange={set('phone')} placeholder="+1 555 000 0000" className={inputCls}/></div>
              <div><label className={labelCls}>City</label>
                <select value={form.city} onChange={set('city')} className={inputCls}>
                  <option value="">Select city</option>
                  {['New York','Los Angeles','Chicago','Houston','Miami','San Francisco'].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className={`pt-5 mt-1 border-t mb-4 ${dark?'border-white/5':'border-black/5'}`}>
              <h3 className="font-display font-700 mb-4 text-sm">Vehicle details</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div><label className={labelCls}>Car make</label><input value={form.carMake} onChange={set('carMake')} placeholder="Toyota" className={inputCls}/></div>
                <div><label className={labelCls}>Car model</label><input value={form.carModel} onChange={set('carModel')} placeholder="Camry" className={inputCls}/></div>
                <div><label className={labelCls}>Year</label><input value={form.carYear} onChange={set('carYear')} placeholder="2021" className={inputCls}/></div>
              </div>
            </div>
            <div className="mb-6"><label className={labelCls}>Driver's license number</label><input value={form.license} onChange={set('license')} placeholder="DL-XXXXXXXXX" className={inputCls}/></div>
            <div className={`flex items-start gap-3 mb-6 p-4 rounded-xl ${dark?'bg-dark-700':'bg-light-100'}`}>
              <input type="checkbox" id="agree" className="mt-0.5"/>
              <label htmlFor="agree" className={`text-xs leading-relaxed ${dark?'text-white/50':'text-black/50'}`}>
                I agree to RideFlow's <span className="text-accent cursor-pointer">Terms of Service</span> and <span className="text-accent cursor-pointer">Driver Agreement</span>. I confirm all provided information is accurate.
              </label>
            </div>
            <button onClick={() => {if(form.name&&form.email) setSubmitted(true);}}
              className="w-full py-4 rounded-xl bg-accent text-black font-bold hover:bg-accent/90 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
              Apply now <Icon.Arrow/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ABOUT PAGE ─────────────────────────────────────── */
function AboutPage({ dark, setPage }) {
  useScrollReveal();
  return (
    <div className={`min-h-screen pt-16 ${dark?'bg-dark-900 text-white':'bg-light-50 text-black'}`}>
      {/* Hero */}
      <div className={`py-24 text-center ${dark?'bg-dark-800':'bg-black'}`}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-xs font-bold uppercase tracking-widest text-accent mb-4">Our story</div>
          <h1 className="font-display text-5xl md:text-6xl font-800 text-white mb-6 leading-tight">Moving the world,<br/><span className="text-accent">one ride at a time.</span></h1>
          <p className="text-white/50 text-lg leading-relaxed">Founded in 2021, RideFlow was built with a single mission: make reliable, affordable transportation available to everyone, everywhere.</p>
        </div>
      </div>

      {/* Stats */}
      <div className={`py-16 ${dark?'bg-dark-900':'bg-light-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal stagger grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { val:'50+', label:'Cities worldwide' },
              { val:'2M+', label:'Trips completed' },
              { val:'12K+', label:'Active drivers' },
              { val:'4.9★', label:'Average rating' },
            ].map(s => (
              <div key={s.label} className={`p-6 rounded-2xl border text-center ${dark?'bg-dark-800 border-white/5':'bg-white border-black/5 shadow-sm'}`}>
                <div className="font-display text-3xl font-800 text-accent mb-1">{s.val}</div>
                <div className={`text-xs ${dark?'text-white/40':'text-black/50'}`}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className={`py-20 ${dark?'bg-dark-800':'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${dark?'text-accent':'text-black/40'}`}>Our mission</div>
            <h2 className="font-display text-4xl font-800 mb-5">Safe, affordable rides for everyone.</h2>
            <p className={`text-base leading-relaxed mb-5 ${dark?'text-white/50':'text-black/50'}`}>
              We believe transportation is a right, not a luxury. Our technology connects riders with trusted drivers in their community, creating economic opportunity while making cities more connected.
            </p>
            <p className={`text-base leading-relaxed ${dark?'text-white/50':'text-black/50'}`}>
              Every feature we build is designed with safety first — from background checks to real-time trip tracking to 24/7 support.
            </p>
          </div>
          <div className="reveal grid grid-cols-2 gap-4">
            {['Rider safety','Driver support','Community impact','Innovation'].map((v,i) => (
              <div key={v} className={`p-5 rounded-2xl border ${dark?'bg-dark-700 border-white/5':'bg-light-50 border-black/5'}`}>
                <div className="text-xl mb-2">{['🛡','🤝','🌍','⚡'][i]}</div>
                <div className="font-display font-700 text-sm">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className={`py-20 ${dark?'bg-dark-900':'bg-light-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal text-center mb-12">
            <h2 className="font-display text-4xl font-800">Meet the team</h2>
          </div>
          <div className="reveal stagger grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name:'Alex Rivera', role:'CEO & Co-founder', init:'AR' },
              { name:'Priya Nair', role:'CTO & Co-founder', init:'PN' },
              { name:'James Okafor', role:'Head of Design', init:'JO' },
              { name:'Sofia Chen', role:'Head of Operations', init:'SC' },
            ].map(m => (
              <div key={m.name} className={`p-6 rounded-2xl border text-center ${dark?'bg-dark-800 border-white/5':'bg-white border-black/5 shadow-sm'}`}>
                <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center text-accent font-display font-700 text-lg mx-auto mb-4">{m.init}</div>
                <div className="font-display font-700 mb-1">{m.name}</div>
                <div className={`text-xs ${dark?'text-white/40':'text-black/50'}`}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className={`py-20 text-center ${dark?'bg-dark-800':'bg-black'}`}>
        <div className="max-w-xl mx-auto px-6">
          <h2 className="font-display text-4xl font-800 text-white mb-5">Ready to ride?</h2>
          <p className="text-white/50 mb-8">Join millions of people who trust RideFlow for their daily commute.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => setPage('ride')}
              className="px-7 py-3.5 rounded-full bg-accent text-black font-bold hover:bg-accent/90 transition-all hover:scale-105">
              Book a ride
            </button>
            <button onClick={() => setPage('drive')}
              className="px-7 py-3.5 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all font-medium">
              Become a driver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── AUTH PAGES ─────────────────────────────────────── */
function AuthPage({ dark, mode, setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [done, setDone] = useState(false);
  const isLogin = mode === 'login';
  const inputCls = `w-full px-4 py-3 rounded-xl text-sm rf-input outline-none transition-all ${dark?'bg-dark-700 border border-white/10 text-white placeholder-white/30':'bg-white border border-black/10 text-black placeholder-black/30'}`;
  const labelCls = `text-xs font-medium mb-1.5 block ${dark?'text-white/40':'text-black/50'}`;

  if(done) return (
    <div className={`min-h-screen pt-16 flex items-center justify-center ${dark?'bg-dark-900 text-white':'bg-light-50 text-black'}`}>
      <div className={`text-center p-12 rounded-3xl border max-w-sm ${dark?'bg-dark-800 border-white/5':'bg-white border-black/5 shadow-xl'}`}>
        <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mx-auto mb-5"><span className="text-black"><Icon.Check/></span></div>
        <h2 className="font-display text-2xl font-800 mb-2">{isLogin ? 'Welcome back!' : 'Account created!'}</h2>
        <p className={`text-sm mb-6 ${dark?'text-white/40':'text-black/50'}`}>{isLogin ? 'You\'re now logged in.' : 'Your account is ready.'}</p>
        <button onClick={() => setPage('home')} className="px-6 py-2.5 rounded-full bg-accent text-black font-bold text-sm">Go to home</button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen pt-16 flex items-center justify-center ${dark?'bg-dark-900 text-white':'bg-light-50 text-black'}`}>
      <div className={`w-full max-w-md mx-6 p-8 rounded-3xl border ${dark?'bg-dark-800 border-white/5':'bg-white border-black/5 shadow-2xl'}`}>
        <div className="flex justify-center mb-7"><Icon.Logo/></div>
        <h1 className="font-display text-2xl font-800 text-center mb-1">{isLogin ? 'Welcome back' : 'Create account'}</h1>
        <p className={`text-center text-sm mb-8 ${dark?'text-white/40':'text-black/50'}`}>{isLogin ? 'Sign in to continue' : 'Start riding in seconds'}</p>

        <div className="flex flex-col gap-4">
          {!isLogin && <div><label className={labelCls}>Full name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="John Smith" className={inputCls}/></div>}
          <div><label className={labelCls}>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@email.com" className={inputCls}/></div>
          <div><label className={labelCls}>Password</label><input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••" className={inputCls}/></div>
        </div>

        {isLogin && <div className="text-right mt-2"><button className="text-xs text-accent">Forgot password?</button></div>}

        <button onClick={() => { if(email&&password) setDone(true); }}
          className="w-full mt-6 py-3.5 rounded-xl bg-accent text-black font-bold hover:bg-accent/90 transition-all hover:scale-[1.02] active:scale-95">
          {isLogin ? 'Sign in' : 'Create account'}
        </button>

        <div className={`flex items-center gap-3 my-5 ${dark?'text-white/20':'text-black/20'}`}>
          <div className={`flex-1 h-px ${dark?'bg-white/10':'bg-black/10'}`}></div>
          <span className="text-xs">or</span>
          <div className={`flex-1 h-px ${dark?'bg-white/10':'bg-black/10'}`}></div>
        </div>

        <button className={`w-full py-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-colors ${dark?'border-white/10 hover:bg-white/5':'border-black/10 hover:bg-black/3'}`}>
          <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <p className={`text-center text-xs mt-6 ${dark?'text-white/30':'text-black/40'}`}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setPage(isLogin?'signup':'login')} className="text-accent font-medium">
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}

/* ─── DASHBOARD ──────────────────────────────────────── */
function DashboardPage({ dark, setPage }) {
  const [activeTab, setActiveTab] = useState('overview');
  const tabCls = (t) => `px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab===t?(dark?'bg-dark-700 text-white':'bg-white text-black shadow-sm'):(dark?'text-white/40 hover:text-white':'text-black/40 hover:text-black')}`;

  return (
    <div className={`min-h-screen pt-16 ${dark?'bg-dark-900 text-white':'bg-light-50 text-black'}`}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-800 mb-0.5">Good morning, Amine 👋</h1>
            <p className={`text-sm ${dark?'text-white/40':'text-black/50'}`}>Here's your ride activity</p>
          </div>
          <button onClick={() => setPage('ride')} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-black font-bold text-sm hover:bg-accent/90 transition-all">
            Book ride <Icon.Arrow/>
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex gap-1 p-1 rounded-xl w-fit mb-8 ${dark?'bg-dark-800':'bg-light-200'}`}>
          {['overview','trips','settings'].map(t => <button key={t} onClick={() => setActiveTab(t)} className={tabCls(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[{val:'142',label:'Total trips'},{val:'$1,284',label:'Total spent'},{val:'4.9',label:'Avg rating'},{val:'$96',label:'Promo saved'}].map(s=>(
                <div key={s.label} className={`p-5 rounded-2xl border ${dark?'bg-dark-800 border-white/5':'bg-white border-black/5 shadow-sm'}`}>
                  <div className={`text-xs mb-1 ${dark?'text-white/40':'text-black/50'}`}>{s.label}</div>
                  <div className="font-display text-2xl font-800">{s.val}</div>
                </div>
              ))}
            </div>
            <div className={`p-6 rounded-2xl border ${dark?'bg-dark-800 border-white/5':'bg-white border-black/5 shadow-sm'}`}>
              <h3 className="font-display font-700 mb-4">Recent activity</h3>
              <div className="flex flex-col gap-3">
                {FAKE_RIDES.map((r,i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 rounded-xl ${dark?'bg-dark-700':'bg-light-50'}`}>
                    <div className="text-xl">🚗</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{r.from} → {r.to}</div>
                      <div className={`text-xs ${dark?'text-white/30':'text-black/40'}`}>{r.date} · {r.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{r.price}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${r.status==='completed'?(dark?'bg-green-500/10 text-green-400':'bg-green-50 text-green-600'):'bg-red-500/10 text-red-400'}`}>{r.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'trips' && (
          <div className={`p-6 rounded-2xl border ${dark?'bg-dark-800 border-white/5':'bg-white border-black/5 shadow-sm'}`}>
            <h3 className="font-display font-700 mb-5">All trips</h3>
            <div className="flex flex-col gap-3">
              {FAKE_RIDES.map((r,i) => (
                <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${dark?'bg-dark-700 border-white/5':'bg-light-50 border-black/5'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${dark?'bg-dark-600':'bg-light-200'}`}>🚗</div>
                  <div className="flex-1">
                    <div className="font-medium">{r.from} → {r.to}</div>
                    <div className={`text-xs mt-0.5 ${dark?'text-white/30':'text-black/40'}`}>{r.date} · {r.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{r.price}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.status==='completed'?'bg-green-500/10 text-green-400':'bg-red-500/10 text-red-400'}`}>{r.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className={`p-6 rounded-2xl border ${dark?'bg-dark-800 border-white/5':'bg-white border-black/5 shadow-sm'}`}>
            <h3 className="font-display font-700 mb-5">Account settings</h3>
            {['Push notifications','Email receipts','Trip sharing','Promotional offers'].map((s,i) => (
              <div key={s} className={`flex items-center justify-between py-4 border-b last:border-0 ${dark?'border-white/5':'border-black/5'}`}>
                <div>
                  <div className="font-medium text-sm">{s}</div>
                  <div className={`text-xs mt-0.5 ${dark?'text-white/30':'text-black/40'}`}>Manage your {s.toLowerCase()} preferences</div>
                </div>
                <div className={`toggle-track ${[true,true,false,false][i]?'bg-accent':'bg-gray-600'}`}
                  onClick={e => { const t=e.currentTarget; t.classList.toggle('bg-accent'); t.classList.toggle('bg-gray-600'); t.querySelector('.toggle-thumb').style.transform = t.classList.contains('bg-accent')?'translateX(20px)':'translateX(0)'; }}>
                  <div className="toggle-thumb bg-white" style={{transform:[true,true,false,false][i]?'translateX(20px)':'translateX(0)'}}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── APP ROOT ───────────────────────────────────────── */
function App() {
  const [dark, setDark] = useState(true);
  const [page, setPage] = useState('home');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    document.body.style.background = dark ? '#0A0A0A' : '#FAFAFA';
    document.body.style.color = dark ? '#fff' : '#000';
  }, [dark]);

  useEffect(() => { window.scrollTo({top:0,behavior:'smooth'}); }, [page]);

  const renderPage = () => {
    switch(page) {
      case 'home':    return <HomePage setPage={setPage} dark={dark}/>;
      case 'ride':    return <RidePage dark={dark} setPage={setPage}/>;
      case 'drive':   return <DrivePage dark={dark}/>;
      case 'about':   return <AboutPage dark={dark} setPage={setPage}/>;
      case 'login':   return <AuthPage dark={dark} mode="login" setPage={setPage}/>;
      case 'signup':  return <AuthPage dark={dark} mode="signup" setPage={setPage}/>;
      case 'dashboard':return <DashboardPage dark={dark} setPage={setPage}/>;
      default:        return <HomePage setPage={setPage} dark={dark}/>;
    }
  };

  return (
    <>
      <Navbar page={page} setPage={setPage} dark={dark} setDark={setDark}/>
      {/* Dashboard shortcut */}
      {page !== 'dashboard' && (
        <button onClick={() => setPage('dashboard')}
          className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full border flex items-center justify-center transition-all hover:scale-110 shadow-lg ${dark?'bg-dark-700 border-white/10 text-white':'bg-white border-black/10 text-black shadow-xl'}`}
          title="Dashboard">
          <Icon.User/>
          <span className="notif-dot2 absolute -top-1 -right-1 bg-accent w-3 h-3 rounded-full"></span>
        </button>
      )}
      {renderPage()}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
