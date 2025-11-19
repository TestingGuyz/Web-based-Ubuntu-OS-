import React, { useState, useEffect } from 'react';
import { User, ArrowRight } from 'lucide-react';

export const LoginScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 backdrop-blur-xl flex flex-col items-center justify-center text-white transition-all duration-500">
       {/* Top Bar Clock */}
       <div className="absolute top-0 w-full h-8 bg-black/20 flex items-center justify-center text-sm font-medium text-gray-200">
           {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} &nbsp;
           {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
       </div>

       <div className="flex flex-col items-center space-y-6 w-64">
           {/* User Avatar */}
           <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mb-2 shadow-lg relative overflow-hidden">
                <User size={48} />
                {/* Simple Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20"></div>
           </div>
           
           <h2 className="text-xl font-medium text-gray-100 tracking-wide">Ubuntu User</h2>

           <form onSubmit={handleLogin} className="relative w-full">
               <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#333333] text-white placeholder-gray-500 rounded border border-gray-600 px-3 py-2 focus:outline-none focus:border-ubuntu-orange transition-colors text-sm"
                autoFocus
               />
               {password.length > 0 && (
                 <button 
                    type="submit" 
                    className="absolute right-1 top-1 bottom-1 w-8 flex items-center justify-center bg-ubuntu-orange rounded hover:bg-orange-600 transition-colors"
                 >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <ArrowRight size={16} />
                    )}
                 </button>
               )}
           </form>
           
           <div className="text-xs text-gray-400 hover:text-gray-300 cursor-pointer transition-colors border-b border-transparent hover:border-gray-400">
               Forgot Password?
           </div>
       </div>
       
       {/* Footer Branding */}
       <div className="absolute bottom-8 flex flex-col items-center opacity-60">
           <div className="flex items-center space-x-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <div className="w-4 h-4 bg-black rounded-full"></div>
              </div>
              <span className="text-lg font-light tracking-widest">ubuntu<span className="font-medium">web</span></span>
           </div>
           <span className="text-[10px] tracking-widest uppercase">24.04 LTS</span>
       </div>
    </div>
  );
};