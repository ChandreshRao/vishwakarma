import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Link, useParams, useLocation } from 'react-router-dom'
import { Menu, X, Phone, Mail, MapPin, ExternalLink, Calendar, BookOpen, UserCheck, Image as ImageIcon, ChevronRight, Search } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'
import SearchBar from './components/SearchBar'
import VirtualTour from './components/VirtualTour'

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  }
}

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Helper to fetch content
const useFetchContent = (type, slug) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}content/${type}/${slug}.json`);
        const json = await response.json();
        setData(json);
      } catch (e) {
        console.error("Failed to load content", e);
      } finally {
        setLoading(false);
      }
    }
    if (type && slug) load();
  }, [type, slug]);

  return { data, loading };
};

const ContentPage = ({ type }) => {
  const { slug } = useParams();
  const { data, loading } = useFetchContent(type, slug || 'history');

  if (loading) return <div className="min-h-screen pt-32 pb-20 text-center font-serif text-2xl text-primary animate-pulse">Loading content...</div>;
  if (!data) return <div className="min-h-screen pt-32 pb-20 text-center font-serif text-2xl text-red-500">Page not found</div>;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="pt-32 pb-24 bg-white"
    >
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.h2 variants={fadeIn} className="text-5xl md:text-7xl font-serif text-primary mb-12 tracking-tight leading-tight">{data.title}</motion.h2>
        <motion.div variants={fadeIn} className="prose prose-xl md:prose-2xl max-w-none text-gray-700 leading-relaxed font-sans font-light prose-headings:font-serif prose-headings:text-primary prose-headings:font-normal prose-a:text-primary prose-a:font-bold prose-img:rounded-3xl prose-img:shadow-2xl prose-img:mx-auto prose-img:my-12">
          <ReactMarkdown>{data.content}</ReactMarkdown>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Home = () => (
  <div className="bg-white">
    {/* Cinematic Hero Section */}
    <section className="relative h-screen min-h-[700px] w-full bg-primary flex items-center justify-center overflow-hidden">
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
        style={{ backgroundImage: `url('${import.meta.env.BASE_URL}images/about/hero-bg.png')` }}
      ></motion.div>
      
      <div className="organic-frame"></div>

      <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 0.8 }}
        transition={{ delay: 1, duration: 1.5 }}
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-6 z-30" 
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        <div className="w-[1px] h-24 bg-white/50"></div>
        <span className="font-serif text-white tracking-[0.3em] uppercase text-sm">Plus Est En Vous</span>
        <div className="w-[1px] h-24 bg-white/50"></div>
      </motion.div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="container mx-auto px-6 md:px-12 text-center relative z-20 flex flex-col items-center justify-center h-full pt-20"
      >
        <motion.h1 variants={fadeIn} className="text-6xl md:text-8xl lg:text-9xl font-serif text-white mb-6 drop-shadow-2xl tracking-tighter leading-none">
          Cultivating<br />
          <span className="italic font-light text-accent text-glow">Values</span>
        </motion.h1>
        <motion.p variants={fadeIn} className="text-xl md:text-3xl text-white/90 max-w-2xl mx-auto mb-12 font-serif font-light leading-relaxed">
          Empowering the Malnad Frontier — providing world-class, affordable education to 47 Gram Panchayats.
        </motion.p>
        <motion.div variants={fadeIn}>
          <Link to="/admissions/admissions" className="group flex items-center gap-4 bg-white text-primary px-8 py-4 rounded-full font-sans font-bold text-sm tracking-widest uppercase hover:bg-accent transition-all duration-300">
            Discover Admissions
            <span className="bg-primary text-white p-2 rounded-full group-hover:bg-white group-hover:text-primary transition-colors"><ChevronRight size={14} /></span>
          </Link>
        </motion.div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3"
      >
        <span className="text-white text-[10px] uppercase tracking-widest font-sans font-bold opacity-70">Scroll</span>
        <div className="w-[1px] h-12 bg-white/50"></div>
      </motion.div>
    </section>

    {/* Key Statistics Bar */}
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="py-16 bg-primary/5 relative z-20"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '11', label: 'Years of 100% SSLC Pass Rate' },
            { value: '680+', label: 'Students Enrolled' },
            { value: '15%', label: 'Tribal Community Representation' },
            { value: '40+', label: 'Specially-Abled Graduates' },
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeIn} className="group">
              <div className="text-5xl md:text-6xl font-serif text-primary mb-2 group-hover:text-accent transition-colors">{stat.value}</div>
              <div className="text-xs md:text-sm font-sans font-bold uppercase tracking-widest text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>

    {/* Elegant Two-Column Intro */}
    <section className="py-32 bg-white relative z-20 px-6 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="lg:w-5/12"
          >
            <motion.h5 variants={fadeIn} className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-6 flex items-center gap-4">
              <div className="w-8 h-[1px] bg-primary"></div> Since 1998
            </motion.h5>
            <motion.h3 variants={fadeIn} className="text-5xl md:text-6xl font-serif text-primary mb-8 leading-tight">
              A broader <br /><i className="font-light">curriculum</i> for life.
            </motion.h3>
            <motion.p variants={fadeIn} className="text-gray-600 text-2xl md:text-3xl leading-relaxed font-sans font-light mb-10">
              From a single room with 7 students in 1998 to a multi-institution society serving the Malnad region. Our 'Panchamukhi' (five-fold) education system develops the intellect, nurtures the spirit, and builds resilience.
            </motion.p>
            <motion.div variants={fadeIn}>
              <Link to="/about/history" className="inline-flex items-center gap-2 text-primary border-b border-primary pb-1 font-bold text-sm md:text-base tracking-widest uppercase hover:text-accent hover:border-accent transition-colors">
                Our Heritage <ChevronRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
            className="lg:w-7/12 relative group h-[600px] w-full"
          >
             <img src={`${import.meta.env.BASE_URL}images/gallery/Aksharabhyasa Program.png`} alt="Students on campus" className="w-full h-full object-cover rounded-tr-[100px] rounded-bl-[100px] shadow-2xl transition-transform duration-1000 group-hover:scale-[1.02]" />
             <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-secondary rounded-full -z-10 blur-2xl opacity-50"></div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Campus Tour Section */}
    <section className="py-24 bg-[#f8f6f9] relative z-20 px-6 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h5 className="text-secondary font-bold uppercase tracking-[0.3em] text-xs mb-4">Virtual Experience</h5>
          <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6 tracking-tight">Explore the <i className="font-light">Campus</i></h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-sans font-light text-xl leading-relaxed">
            Step inside our world-class facilities and explore our heritage campus from anywhere in the world.
          </p>
        </motion.div>
        
        <VirtualTour 
          imagePath="https://pannellum.org/images/alma.jpg" 
          title="Main Academic Block" 
        />
      </div>
    </section>

    {/* Feature Grid with Hover Cards */}
    <section className="py-32 bg-[#f8f6f9] relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-20"
        >
           <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6">Explore <i className="font-light">Jnanavahini</i></h2>
           <div className="w-24 h-[1px] bg-accent mx-auto"></div>
        </motion.div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            { title: 'Our Schools', icon: <BookOpen size={32} />, link: '/academics/curriculum', desc: 'Four institutions under one ecosystem — from primary to pre-university.' },
            { title: 'The Jnanavahini Way', icon: <Calendar size={32} />, link: '/about/jnanavahini-way', desc: 'Krithamsmara, Samarpana Nidhi, and values that define us.' },
            { title: 'Achievements', icon: <ImageIcon size={32} />, link: '/about/achievements', desc: '11 years of 100% pass rates and state-level champions.' },
            { title: 'Partner With Us', icon: <UserCheck size={32} />, link: '/about/partner', desc: 'CSR, sponsorships, and institutional collaborations.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeIn} className="h-full">
              <Link to={item.link} className="group bg-white p-10 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-secondary/30 relative flex flex-col h-full transform hover:-translate-y-2">
                <div className="text-secondary mb-8 group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                <h3 className="text-3xl md:text-4xl font-serif text-primary mb-4">{item.title}</h3>
                <p className="text-gray-500 text-xl font-sans font-light leading-relaxed mb-8 flex-grow">{item.desc}</p>
                <div className="mt-auto flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-primary/50 group-hover:text-primary transition-colors">
                  Discover <ChevronRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  </div>
);

const Gallery = () => {
  const { data, loading } = useFetchContent('gallery', 'index');

  if (loading) return <div className="min-h-screen pt-32 pb-20 text-center font-serif text-2xl text-primary animate-pulse">Loading gallery...</div>;
  
  const images = data?.images || [];

  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-20"
        >
          <h5 className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-4">Life at Jnanavahini</h5>
          <h2 className="text-5xl md:text-7xl font-serif text-primary mb-8 tracking-tight">Campus <i className="font-light text-secondary">Gallery</i></h2>
          <div className="w-24 h-[1px] bg-accent mx-auto"></div>
        </motion.div>
        
        {images.length === 0 ? (
           <div className="text-center text-gray-400 font-sans italic my-20">No images found. Please upload images to the 04-Gallery folder in Google Drive.</div>
        ) : (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]"
          >
            {images.map((item, i) => {
              const spanClass = i === 0 || i % 5 === 0 ? 'col-span-1 md:col-span-2 row-span-2' : 'col-span-1 row-span-1';
              return (
                <motion.div 
                  key={i} 
                  variants={fadeIn}
                  className={`group relative overflow-hidden bg-gray-100 ${spanClass} min-h-[300px]`}
                >
                  <img src={`${import.meta.env.BASE_URL}${item.src.replace(/^\//, '')}`} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-colors duration-500 flex items-center justify-center">
                    <span className="text-white font-serif text-2xl md:text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0 italic text-center px-4">{item.title}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const Contact = () => (
  <div className="pt-32 pb-24 bg-[#f8f6f9] min-h-screen">
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-20">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="lg:w-5/12 pt-10"
        >
          <motion.h5 variants={fadeIn} className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-4">Connect With Us</motion.h5>
          <motion.h2 variants={fadeIn} className="text-6xl md:text-7xl font-serif text-primary mb-10 tracking-tight">Get in <i className="font-light text-secondary">Touch</i></motion.h2>
          
          <motion.p variants={fadeIn} className="text-gray-600 font-sans font-light text-xl md:text-2xl leading-relaxed mb-12">
            Whether you're a prospective parent arranging a visit, or seeking general information, our registry team is available to assist you.
          </motion.p>
          
          <motion.div variants={fadeIn} className="space-y-10">
            <div className="group">
              <h4 className="font-serif text-xl text-primary mb-2 flex items-center gap-3"><MapPin size={20} className="text-secondary" /> Address</h4>
              <p className="text-gray-500 font-sans font-light pl-8 group-hover:text-primary transition-colors">Kalidasa Road, Koppa – 577 126<br/>Chikkmagaluru District, Karnataka</p>
            </div>
            <div className="group">
              <h4 className="font-serif text-xl text-primary mb-2 flex items-center gap-3"><Phone size={20} className="text-secondary" /> Telephone</h4>
              <p className="text-gray-500 font-sans font-light pl-8 group-hover:text-primary transition-colors">+91 8762564754</p>
            </div>
            <div className="group">
              <h4 className="font-serif text-xl text-primary mb-2 flex items-center gap-3"><Mail size={20} className="text-secondary" /> Email</h4>
              <p className="text-gray-500 font-sans font-light pl-8 group-hover:text-primary transition-colors">jnanavahinihighschool@gmail.com</p>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scaleIn}
          className="lg:w-7/12"
        >
           <div className="w-full h-[600px] bg-gray-200 overflow-hidden shadow-2xl relative">
             <div className="absolute inset-0 border-8 border-white z-10 pointer-events-none"></div>
             <iframe 
                title="School Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15525.7928784236!2d75.3486392!3d13.5244199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbaddd666666665%3A0x6666666666666666!2sKoppa%2C%20Karnataka%20577126!5e0!3m2!1sen!2sin!4v1711749000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                className="grayscale hover:grayscale-0 transition-all duration-1000"
              ></iframe>
           </div>
        </motion.div>
      </div>
    </div>
  </div>
);

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about/history' },
    { name: 'Our Schools', href: '/academics/curriculum' },
    { name: 'The Jnanavahini Way', href: '/about/jnanavahini-way' },
    { name: 'Achievements', href: '/about/achievements' },
    { name: 'Future Vision', href: '/about/infrastructure' },
    { name: 'Partner With Us', href: '/about/partner' },
    { name: 'Admissions', href: '/admissions/admissions' },
    { name: 'Gallery', href: '/life/gallery' },
    { name: 'Contact Us', href: '/contact' },
  ]

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col selection:bg-secondary/40 selection:text-primary bg-white">
        
        <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

        {/* Floating Minimalist Header */}
        <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-8'}`}>
          <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-4 group z-50" onClick={() => setIsMenuOpen(false)}>
              <div className={`w-12 h-12 flex items-center justify-center font-serif italic text-2xl transition-colors duration-500 ${isMenuOpen || scrolled ? 'text-primary' : 'text-white'}`}>
                J<span className="text-accent text-3xl">V</span>
              </div>
              <div className={`transition-colors duration-500 hidden sm:block ${isMenuOpen || scrolled ? 'text-primary' : 'text-white'}`}>
                <h1 className="text-lg font-serif tracking-widest uppercase">Jnanavahini</h1>
                <p className="text-[9px] font-sans font-bold tracking-[0.4em] uppercase opacity-70">Established 1998</p>
              </div>
            </Link>

            {/* Header Actions */}
            <div className="flex items-center gap-4 md:gap-6 z-50">
               <button 
                 onClick={() => setIsSearchOpen(true)}
                 className={`p-3 rounded-full transition-all duration-500 ${
                   isMenuOpen ? 'text-white/50 hover:text-white' :
                   scrolled ? 'text-primary/70 hover:text-primary bg-gray-50' : 
                   'text-white/70 hover:text-white bg-white/10 border border-white/20'
                 }`}
                 aria-label="Search"
               >
                 <Search size={22} strokeWidth={1.5} />
               </button>
               
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isMenuOpen ? 'bg-transparent text-white hover:rotate-90' : 
                  scrolled ? 'bg-primary text-white hover:bg-secondary hover:text-primary' : 
                  'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-primary'
                }`}
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1.5} />}
              </button>
            </div>

          </div>
        </header>

        {/* Full Screen Overlay Menu */}
        <div className={`fixed inset-0 z-40 bg-primary transition-all duration-700 ease-in-out ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/5 skew-x-12 translate-x-32 hidden lg:block"></div>
          
          <div className="container mx-auto px-6 h-full flex flex-col justify-center">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <nav className="flex flex-col gap-6">
                {navLinks.map((link, index) => (
                  <div key={link.name} className="overflow-hidden">
                    <Link 
                      to={link.href} 
                      className={`block font-serif text-4xl md:text-5xl lg:text-6xl text-white/50 hover:text-white transition-all duration-500 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
                      style={{ transitionDelay: `${index * 50}ms` }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </div>
                ))}
              </nav>
              <div className={`hidden lg:flex flex-col gap-8 pl-16 border-l w-max border-white/10 text-white/70 font-sans font-light transition-all duration-700 delay-500 ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
                <div>
                  <h5 className="font-bold uppercase tracking-widest text-xs text-secondary mb-3">Location</h5>
                  <p>Kalidasa Road, Koppa – 577 126<br/>Chikkmagaluru, Karnataka</p>
                </div>
                <div>
                  <h5 className="font-bold uppercase tracking-widest text-xs text-secondary mb-3">Enquiries</h5>
                  <p>+91 8762564754<br/>jnanavahinihighschool@gmail.com</p>
                </div>
                <div>
                  <h5 className="font-bold uppercase tracking-widest text-xs text-secondary mb-3">Portal</h5>
                  <a href="#" className="hover:text-white transition-colors border-b border-white/30 pb-1 inline-block">Staff & Parent Dashboard</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about/:slug" element={<ContentPage type="about" />} />
            <Route path="/academics/:slug" element={<ContentPage type="academics" />} />
            <Route path="/admissions/:slug" element={<ContentPage type="admissions" />} />
            <Route path="/blog/:slug" element={<ContentPage type="blog" />} />
            <Route path="/disclosure/:slug" element={<ContentPage type="disclosures" />} />
            <Route path="/life/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <footer className="bg-primary text-white pt-24 pb-12 border-t border-white/10">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid lg:grid-cols-12 gap-16 mb-20">
              <div className="lg:col-span-5">
                <Link to="/" className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 flex items-center justify-center font-serif italic text-2xl text-secondary">
                    J<span className="text-white text-3xl">V</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-serif tracking-widest uppercase">Jnanavahini</h4>
                    <p className="text-[10px] font-sans font-bold tracking-[0.4em] uppercase text-white/50 mt-1">Seva Vahini Trust®</p>
                  </div>
                </Link>
                <p className="text-white/60 font-sans font-light leading-relaxed mb-8 max-w-sm">
                  A registered educational trust with 80G Tax Exemption status. Cultivating values and empowering the Malnad frontier since 1998.
                </p>
              </div>
              <div className="lg:col-span-3">
                <h5 className="font-serif text-xl italic mb-6">Explore</h5>
                <ul className="space-y-4 font-sans text-sm font-light text-white/70">
                  {navLinks.slice(1, 5).map(link => (
                    <li key={link.name}><Link to={link.href} className="hover:text-secondary transition-colors">{link.name}</Link></li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-4">
                <h5 className="font-serif text-xl italic mb-6">Contact</h5>
                <ul className="space-y-4 font-sans text-sm font-light text-white/70">
                  <li className="flex items-start gap-3"><MapPin size={18} className="text-secondary shrink-0 mt-1" /> Kalidasa Road, Koppa – 577 126, KA</li>
                  <li className="flex items-center gap-3"><Phone size={18} className="text-secondary" /> +91 8762564754</li>
                  <li className="flex items-center gap-3"><Mail size={18} className="text-secondary" /> jnanavahinihighschool@gmail.com</li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 font-sans text-xs uppercase tracking-widest">
              <p>&copy; {new Date().getFullYear()} Jnanavahini Education Society · Seva Vahini Trust®</p>
              <div className="flex gap-6">
                <Link to="/disclosure/affiliation" className="hover:text-white transition-colors">Disclosures</Link>
                <Link to="/about/partner" className="hover:text-white transition-colors">Donate</Link>
                <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
