import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import siteConfig from '../siteConfig';

const VirtualTour = ({ imagePath, title = "Campus Tour" }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    let viewer = null;
    const initViewer = () => {
      if (window.pannellum) {
        viewer = window.pannellum.viewer('panorama', {
          type: 'equirectangular',
          panorama: imagePath || 'https://pannellum.org/images/alma.jpg',
          autoLoad: true,
          title: title,
          author: siteConfig.name,
          showFullscreenCtrl: true,
          showZoomCtrl: true,
        });
      }
    };

    // Check immediately and then with an interval if not loaded yet
    if (window.pannellum) {
      initViewer();
    } else {
      const interval = setInterval(() => {
        if (window.pannellum) {
          initViewer();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [imagePath, title]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="relative w-full h-[600px] bg-gray-100 rounded-3xl overflow-hidden shadow-2xl"
    >
      <div id="panorama" className="w-full h-full"></div>
      
      <div className="absolute top-8 left-8 z-10">
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20">
          <h5 className="text-[10px] uppercase font-bold tracking-widest text-secondary mb-1">Immersive Exploration</h5>
          <h3 className="font-serif text-xl tracking-tight text-primary uppercase">{title}</h3>
        </div>
      </div>
    </motion.div>
  );
};

export default VirtualTour;
