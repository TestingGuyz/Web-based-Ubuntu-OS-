import React, { useState } from 'react';
import { Delete, History } from 'lucide-react';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<string>('');
  const [shouldReset, setShouldReset] = useState(false);

  const handleNumber = (num: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(num);
      setShouldReset(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    setShouldReset(true);
    setHistory(`${display} ${op}`);
  };

  const calculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval((history + display).replace('x', '*').replace('÷', '/'));
      setHistory('');
      setDisplay(String(result));
      setShouldReset(true);
    } catch (e) {
      setDisplay('Error');
      setShouldReset(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setHistory('');
    setShouldReset(false);
  };

  const btnClass = "flex items-center justify-center rounded-full text-xl font-medium transition-all active:scale-95 hover:brightness-110";
  const numBtnClass = `${btnClass} bg-[#333] text-white hover:bg-[#444]`;
  const opBtnClass = `${btnClass} bg-[#E95420] text-white`;
  const funcBtnClass = `${btnClass} bg-[#A5A5A5] text-black`;

  return (
    <div className="h-full flex flex-col bg-[#2c2c2c] p-4 select-none">
      <div className="flex-1 flex flex-col items-end justify-end mb-4 space-y-1 px-2">
        <div className="text-gray-400 text-sm h-6">{history}</div>
        <div className="text-5xl font-light text-white tracking-tight overflow-hidden">{display}</div>
      </div>

      <div className="grid grid-cols-4 gap-3 h-3/4">
        <button onClick={clear} className={funcBtnClass}>AC</button>
        <button onClick={() => setDisplay(String(Number(display) * -1))} className={funcBtnClass}>+/-</button>
        <button onClick={() => setDisplay(String(Number(display) / 100))} className={funcBtnClass}>%</button>
        <button onClick={() => handleOperator('/')} className={opBtnClass}>÷</button>

        <button onClick={() => handleNumber('7')} className={numBtnClass}>7</button>
        <button onClick={() => handleNumber('8')} className={numBtnClass}>8</button>
        <button onClick={() => handleNumber('9')} className={numBtnClass}>9</button>
        <button onClick={() => handleOperator('*')} className={opBtnClass}>x</button>

        <button onClick={() => handleNumber('4')} className={numBtnClass}>4</button>
        <button onClick={() => handleNumber('5')} className={numBtnClass}>5</button>
        <button onClick={() => handleNumber('6')} className={numBtnClass}>6</button>
        <button onClick={() => handleOperator('-')} className={opBtnClass}>-</button>

        <button onClick={() => handleNumber('1')} className={numBtnClass}>1</button>
        <button onClick={() => handleNumber('2')} className={numBtnClass}>2</button>
        <button onClick={() => handleNumber('3')} className={numBtnClass}>3</button>
        <button onClick={() => handleOperator('+')} className={opBtnClass}>+</button>

        <button onClick={() => handleNumber('0')} className={`${numBtnClass} col-span-2 rounded-[2rem]`}>0</button>
        <button onClick={() => !display.includes('.') && setDisplay(display + '.')} className={numBtnClass}>.</button>
        <button onClick={calculate} className={opBtnClass}>=</button>
      </div>
    </div>
  );
};