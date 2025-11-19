import React, { useState, useEffect, useRef } from 'react';
import { generateResponse } from '../../services/geminiService';

export const TerminalApp: React.FC = () => {
  const [history, setHistory] = useState<string[]>(['Welcome to Ubuntu Web 24.04 LTS', 'Type "help" for a list of commands.']);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setHistory(prev => [...prev, `ubuntu@web:~$ ${trimmed}`]);
    setIsProcessing(true);

    const args = trimmed.split(' ');
    const command = args[0].toLowerCase();

    switch (command) {
      case 'help':
        setHistory(prev => [...prev, 
          'Available commands:',
          '  help      - Show this help message',
          '  clear     - Clear the terminal screen',
          '  echo      - Display a line of text',
          '  whoami    - Display current user',
          '  ls        - List directory contents',
          '  neofetch  - Display system info',
          '  ai [p]    - Ask Gemini AI a question (p = prompt)',
          '  reboot    - Restart the system (simulation)'
        ]);
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'whoami':
        setHistory(prev => [...prev, 'root']);
        break;
      case 'echo':
        setHistory(prev => [...prev, args.slice(1).join(' ')]);
        break;
      case 'ls':
        setHistory(prev => [...prev, 'Documents  Downloads  Music  Pictures  Videos  gemini_secret_plans.txt']);
        break;
      case 'neofetch':
        setHistory(prev => [...prev, 
          `       _               ubuntu@web-os`,
          `      | |              -------------`,
          `  ___ | |__   ___      OS: Ubuntu Web 24.04 LTS x86_64`,
          ` / _ \\| '_ \\ / _ \\     Host: Browser Virtual Machine`,
          `| (_) | |_) | (_) |    Kernel: 5.15.0-generic`,
          ` \\___/|_.__/ \\___/     Uptime: ${Math.floor(performance.now() / 60000)} mins`,
          `                       Shell: bash 5.1.16`,
          `                       Theme: Yaru-dark [GTK2/3]`,
          `                       CPU: Gemini Virtual Core (1) @ 3.5GHz`,
          `                       Memory: 128MB / 4096MB`
        ]);
        break;
      case 'ai':
        const prompt = args.slice(1).join(' ');
        if (!prompt) {
          setHistory(prev => [...prev, 'Usage: ai <your question>']);
        } else {
          setHistory(prev => [...prev, 'Thinking...']);
          const response = await generateResponse(prompt);
          setHistory(prev => [...prev, `Gemini: ${response}`]);
        }
        break;
      case 'sudo':
        setHistory(prev => [...prev, `[sudo] password for ubuntu: `]);
        // Simple simulation of failed sudo
        setTimeout(() => {
             setHistory(prev => [...prev, `Sorry, try again.`]);
        }, 1000);
        break;
      case 'reboot':
        setHistory(prev => [...prev, 'Rebooting system...']);
        setTimeout(() => {
            window.location.reload();
        }, 1500);
        break;
      default:
        setHistory(prev => [...prev, `Command not found: ${command}`]);
    }

    setIsProcessing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isProcessing) {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div className="h-full bg-[#2c001e] bg-opacity-95 text-gray-100 font-mono p-4 text-sm overflow-y-auto" onClick={() => document.getElementById('term-input')?.focus()}>
      {history.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap mb-1 break-words">{line}</div>
      ))}
      <div className="flex items-center">
        <span className="text-[#87ff87] mr-2">ubuntu@web:~$</span>
        <input
          id="term-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          autoComplete="off"
          className="flex-1 bg-transparent outline-none text-gray-100 border-none p-0 m-0"
          disabled={isProcessing}
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};