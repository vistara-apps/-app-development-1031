import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { US_STATES, type StateCode } from '@/types';
import { ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StateSelectorProps {
  value: string;
  onChange: (state: string) => void;
  variant?: 'dropdown' | 'search';
  placeholder?: string;
  className?: string;
}

export function StateSelector({ 
  value, 
  onChange, 
  variant = 'dropdown', 
  placeholder = 'Select your state',
  className 
}: StateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const states = Object.entries(US_STATES).filter(([code, name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedState = value ? US_STATES[value as StateCode] : null;

  const handleSelect = (stateCode: string) => {
    onChange(stateCode);
    setIsOpen(false);
    setSearchTerm('');
  };

  if (variant === 'search') {
    return (
      <div className={cn('relative', className)}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search states..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-elevated"
          >
            {states.length > 0 ? (
              states.map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => handleSelect(code)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-surface focus:bg-surface focus:outline-none"
                >
                  <span className="font-medium">{name}</span>
                  <span className="ml-2 text-gray-500">({code})</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No states found</div>
            )}
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <span className={selectedState ? 'text-gray-900' : 'text-gray-500'}>
          {selectedState || placeholder}
        </span>
        <ChevronDown 
          className={cn(
            'h-4 w-4 text-gray-400 transition-transform',
            isOpen && 'rotate-180'
          )} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-elevated"
          >
            <div className="sticky top-0 bg-white p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search states..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded border border-gray-200 pl-10 pr-4 py-1 text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            
            {states.length > 0 ? (
              states.map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => handleSelect(code)}
                  className={cn(
                    'w-full px-4 py-2 text-left text-sm hover:bg-surface focus:bg-surface focus:outline-none',
                    value === code && 'bg-primary/10 text-primary'
                  )}
                >
                  <span className="font-medium">{name}</span>
                  <span className="ml-2 text-gray-500">({code})</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No states found</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
