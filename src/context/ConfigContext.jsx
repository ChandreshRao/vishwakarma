import React, { createContext, useContext, useState, useEffect } from 'react';
import localSiteConfig from '../siteConfig';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(localSiteConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCloudConfig() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}content/config/site-config.json`);
        if (response.ok) {
          const cloudConfig = await response.json();
          // Merge cloud config metadata with local defaults
          setConfig(prev => ({
            ...prev,
            ...cloudConfig.metadata
          }));
          console.log("☁️  Cloud site configuration loaded.");
        } else {
          console.log("ℹ️  Using local site configuration (no cloud config found).");
        }
      } catch (e) {
        console.warn("⚠️  Fallling back to local site configuration:", e.message);
      } finally {
        setLoading(false);
      }
    }
    loadCloudConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, loading }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
