import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Command, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [index, setIndex] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}content/search-index.json`)
      .then(res => res.json())
      .then(data => setIndex(data))
      .catch(err => console.error('Search index load failed', err));
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const filtered = index.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5);
      setResults(filtered);
    } else {
      setResults([]);
    }
    setSelectedIndex(0);
  }, [query, index]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelect = (item) => {
    const path = item.category === 'blog' ? `/blog/${item.slug}` : 
                 item.category === 'about' ? `/about/${item.slug}` :
                 item.category === 'academics' ? `/academics/${item.slug}` :
                 item.category === 'admissions' ? `/admissions/${item.slug}` :
                 item.category === 'disclosures' ? `/disclosure/${item.slug}` : `/${item.slug}`;
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/40 backdrop-blur-md"
          />

          {/* Search Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
          >
            <div className="p-6 flex items-center gap-4 border-b border-gray-100">
              <Search className="text-secondary" size={24} />
              <input 
                ref={inputRef}
                type="text"
                placeholder="Search history, academics, admissions..."
                className="flex-grow bg-transparent border-none outline-none text-xl font-serif text-primary"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg text-gray-400 font-sans text-xs font-bold uppercase tracking-widest border border-gray-100">
                <Command size={12} /> K
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {results.length > 0 ? (
                <div className="p-4 space-y-2">
                  {results.map((item, i) => (
                    <motion.div
                      key={item.slug}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`p-5 rounded-2xl cursor-pointer transition-all flex items-center justify-between group ${selectedIndex === i ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`text-[10px] uppercase tracking-[0.2em] font-bold px-2 py-0.5 rounded border ${selectedIndex === i ? 'border-white/30 text-white/70' : 'border-secondary/20 text-secondary'}`}>
                            {item.category}
                          </span>
                          <h4 className="font-serif text-lg leading-tight">{item.title}</h4>
                        </div>
                        <p className={`text-sm font-sans line-clamp-1 ${selectedIndex === i ? 'text-white/70' : 'text-gray-400'}`}>
                          {item.excerpt}
                        </p>
                      </div>
                      <ArrowRight size={20} className={`transition-transform duration-300 ${selectedIndex === i ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`} />
                    </motion.div>
                  ))}
                </div>
              ) : query.trim().length > 1 ? (
                <div className="p-12 text-center text-gray-400 font-sans italic">
                  No results found for "{query}"
                </div>
              ) : (
                <div className="p-12 text-center text-gray-300 font-sans italic">
                  Type to start searching...
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-gray-400 px-8">
              <div className="flex gap-4">
                 <span className="flex items-center gap-1"><ArrowRight size={10} className="rotate-90" /> Select</span>
                 <span className="flex items-center gap-1"><ArrowRight size={10} className="-rotate-90" /> Navigate</span>
              </div>
              <span>Press ESC to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchBar;
