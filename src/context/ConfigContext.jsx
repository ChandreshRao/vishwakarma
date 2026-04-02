import React, { createContext, useContext, useState, useEffect } from 'react';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCloudConfig() {
      const configPath = `${import.meta.env.BASE_URL}content/config/site-config.json`.replace('//', '/');
      console.log("🔍 Attempting to load site config from:", configPath);
      
      try {
        const response = await fetch(configPath);
        if (response.ok) {
          const cloudConfig = await response.json();
          console.log("✅ Cloud Config Fetched:", cloudConfig);
          
          if (cloudConfig.metadata && Object.keys(cloudConfig.metadata).length > 0) {
            setConfig(cloudConfig.metadata);
            console.log("✨ Site Identity Applied:", cloudConfig.metadata.name);
          } else {
            console.warn("⚠️ Site-config.json found but metadata was empty.");
          }
        } else {
          console.error("❌ Failed to fetch site-config.json. Status:", response.status);
          console.log("ℹ️ Check if the 'sync' step ran correctly during build.");
        }
      } catch (e) {
        console.error("⚠️ Config Fetch Error:", e.message);
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
