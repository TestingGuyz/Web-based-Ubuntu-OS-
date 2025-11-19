import React, { useState, useEffect, useRef } from 'react';
import { generateResponse } from '../../services/geminiService';
import { fsService } from '../../services/fileSystem';

export const TerminalApp: React.FC = () => {
  const [history, setHistory] = useState<string[]>(['Welcome to Ubuntu Web 24.04 LTS', 'Type "help" for commands.']);
  const [input, setInput] = useState('');
  const [currentPathId, setCurrentPathId] = useState('user'); // Start in ~ (user)
  const [currentPathDisplay, setCurrentPathDisplay] = useState('~');
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const updatePathDisplay = (id: string) => {
    const path = fsService.getPathString(id);
    setCurrentPathDisplay(path === '/home/ubuntu' ? '~' : path);
  };

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    setHistory(prev => [...prev, `ubuntu@web:${currentPathDisplay}$ ${trimmed}`]);
    if (!trimmed) return;

    setIsProcessing(true);
    const args = trimmed.split(' ');
    const command = args[0].toLowerCase();

    try {
      switch (command) {
        case 'help':
          setHistory(prev => [...prev, 
            'Available commands:',
            '  ls        - List directory contents',
            '  cd [dir]  - Change directory',
            '  mkdir [name] - Create directory',
            '  touch [name] - Create empty file',
            '  cat [file]   - Display file content',
            '  rm [name]    - Remove file or directory',
            '  pwd       - Print working directory',
            '  clear     - Clear screen',
            '  ai [msg]  - Ask Gemini AI',
            '  neofetch  - System info'
          ]);
          break;
        case 'ls':
          const items = fsService.getItems(currentPathId);
          if (items.length === 0) {
            // empty
          } else {
            const output = items.map(i => i.type === 'folder' ? `\x1b[1;34m${i.name}/\x1b[0m` : i.name).join('  ');
             // Simple mock coloring using html mapping later or just text
            setHistory(prev => [...prev, items.map(i => i.name + (i.type === 'folder' ? '/' : '')).join('  ')]);
          }
          break;
        case 'cd':
          const target = args[1] || '~';
          const newId = fsService.resolvePath(currentPathId, target);
          if (newId) {
            setCurrentPathId(newId);
            updatePathDisplay(newId);
          } else {
            setHistory(prev => [...prev, `bash: cd: ${target}: No such file or directory`]);
          }
          break;
        case 'mkdir':
          if (args[1]) {
            fsService.createItem(args[1], 'folder', currentPathId);
          }
          break;
        case 'touch':
          if (args[1]) {
            fsService.createItem(args[1], 'file', currentPathId);
          }
          break;
        case 'rm':
          if (args[1]) {
             const item = fsService.getItems(currentPathId).find(i => i.name === args[1]);
             if (item) fsService.deleteItem(item.id);
             else setHistory(prev => [...prev, `rm: cannot remove '${args[1]}': No such file`]);
          }
          break;
        case 'cat':
           if (args[1]) {
             const item = fsService.getItems(currentPathId).find(i => i.name === args[1]);
             if (item && item.type === 'file') {
                setHistory(prev => [...prev, item.content || '']);
             } else if (item && item.type === 'folder') {
                setHistory(prev => [...prev, `cat: ${args[1]}: Is a directory`]);
             } else {
                setHistory(prev => [...prev, `cat: ${args[1]}: No such file`]);
             }
           }
           break;
        case 'pwd':
           setHistory(prev => [...prev, fsService.getPathString(currentPathId)]);
           break;
        case 'clear':
          setHistory([]);
          break;
        case 'neofetch':
          setHistory(prev => [...prev, 
            `       _               ubuntu@web-os`,
            `      | |              -------------`,
            `  ___ | |__   ___      OS: Ubuntu Web 24.04 LTS`,
            ` / _ \\| '_ \\ / _ \\     Host: Browser VM`,
            `| (_) | |_) | (_) |    Kernel: 5.15.0-web`,
            ` \\___/|_.__/ \\___/     Packages: ${fsService.getItems(currentPathId).length} (local)`,
            `                       Shell: web-bash 5.0`,
            `                       CPU: Gemini Virtual Core`,
          ]);
          break;
        case 'ai':
          const prompt = args.slice(1).join(' ');
          if (!prompt) {
            setHistory(prev => [...prev, 'Usage: ai <prompt>']);
          } else {
            setHistory(prev => [...prev, 'Thinking...']);
            const response = await generateResponse(prompt);
            setHistory(prev => [...prev, `Gemini: ${response}`]);
          }
          break;
        default:
          setHistory(prev => [...prev, `${command}: command not found`]);
      }
    } catch (e) {
      setHistory(prev => [...prev, `Error: ${e}`]);
    }

    setIsProcessing(false);
  };

  return (
    <div className="h-full bg-[#300a24] text-gray-100 font-mono p-4 text-sm overflow-y-auto flex flex-col" onClick={() => document.getElementById('term-input')?.focus()}>
      <div className="flex-1">
        {history.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap break-words leading-snug mb-0.5">{line}</div>
        ))}
        <div className="flex items-center pt-1">
            <span className="text-[#87ff87] font-bold mr-1">ubuntu@web</span>
            <span className="text-white mr-1">:</span>
            <span className="text-[#87ceeb] font-bold mr-1">{currentPathDisplay}</span>
            <span className="text-white mr-2">$</span>
            <input
            id="term-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !isProcessing) {
                handleCommand(input);
                setInput('');
                }
            }}
            autoFocus
            autoComplete="off"
            className="flex-1 bg-transparent outline-none text-gray-100 border-none p-0 m-0 w-full"
            disabled={isProcessing}
            />
        </div>
      </div>
      <div ref={bottomRef} />
    </div>
  );
};