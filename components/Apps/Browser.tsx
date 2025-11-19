import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Search } from 'lucide-react';

export const BrowserApp: React.FC = () => {
  const [url, setUrl] = useState('https://google.com');
  const [displayUrl, setDisplayUrl] = useState('https://google.com');
  const [iframeSrc, setIframeSrc] = useState('https://www.google.com/webhp?igu=1'); // ig=1 allows some embedding

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = displayUrl;
    if (!target.startsWith('http')) {
      target = 'https://' + target;
    }
    // Basic check to prevent direct embedding of sites that block iframes (most do)
    // In a real app, we'd need a proxy. Here we just set it and let it fail or work.
    // For demo, we fallback to a search if it looks like a query
    if (!target.includes('.')) {
        setIframeSrc(`https://www.bing.com/search?q=${encodeURIComponent(displayUrl)}`);
    } else {
        setIframeSrc(target);
    }
    setUrl(target);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Browser Toolbar */}
      <div className="h-10 bg-gray-100 border-b border-gray-300 flex items-center px-2 space-x-2">
        <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><ArrowLeft size={16} /></button>
        <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><ArrowRight size={16} /></button>
        <button className="p-1 hover:bg-gray-200 rounded text-gray-600" onClick={() => setIframeSrc(url)}><RotateCw size={16} /></button>
        <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><Home size={16} /></button>
        
        <form onSubmit={handleNavigate} className="flex-1 flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 shadow-sm focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
           <Search size={14} className="text-gray-400 mr-2" />
           <input 
            type="text" 
            value={displayUrl}
            onChange={(e) => setDisplayUrl(e.target.value)}
            className="flex-1 outline-none text-sm text-gray-700"
            placeholder="Search Google or type a URL"
           />
        </form>
      </div>
      
      {/* Content */}
      <div className="flex-1 relative bg-white">
         <iframe 
            src={iframeSrc} 
            className="w-full h-full border-none"
            title="browser-frame"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
         />
         {/* Overlay for blocked sites (common issue in iframe OS sims) */}
         <div className="absolute inset-0 pointer-events-none flex items-center justify-center hidden">
             <span className="bg-black/50 text-white p-2 rounded">If content doesn't load, the website blocked embedding.</span>
         </div>
      </div>
    </div>
  );
};