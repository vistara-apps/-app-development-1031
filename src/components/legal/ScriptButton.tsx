import React from 'react';
import { cn, copyToClipboard } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { MessageSquare, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { Script } from '@/types';

interface ScriptButtonProps {
  script: Script;
  variant?: 'primary' | 'secondary' | 'emergency';
  onUse?: (script: Script) => void;
  className?: string;
}

export function ScriptButton({
  script,
  variant = 'primary',
  onUse,
  className
}: ScriptButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(script.text);
    if (success) {
      setCopied(true);
      toast.success('Script copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy script');
    }
  };

  const variants = {
    primary: 'border-primary/20 hover:border-primary/40 bg-primary/5',
    secondary: 'border-gray-200 hover:border-gray-300 bg-white',
    emergency: 'border-error/20 hover:border-error/40 bg-error/5',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Card 
        className={cn(
          'cursor-pointer transition-all duration-200 border-2',
          variants[variant]
        )}
        onClick={() => onUse?.(script)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between space-x-3">
            <div className="flex items-start space-x-3 flex-1">
              <MessageSquare className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {script.dialogue_type === 'user_response' ? 'What to say:' : 'What they might say:'}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  "{script.text}"
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  {script.situation} • {script.language === 'es' ? 'Español' : 'English'}
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="flex-shrink-0 p-2"
            >
              {copied ? (
                <Check className="h-4 w-4 text-accent" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface ScriptListProps {
  scripts: Script[];
  variant?: 'primary' | 'secondary' | 'emergency';
  onUse?: (script: Script) => void;
  groupBySituation?: boolean;
  className?: string;
}

export function ScriptList({
  scripts,
  variant = 'primary',
  onUse,
  groupBySituation = true,
  className
}: ScriptListProps) {
  if (scripts.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No scripts available</h3>
        <p className="text-gray-600">
          Legal scripts for your selected state will appear here.
        </p>
      </div>
    );
  }

  if (!groupBySituation) {
    return (
      <div className={cn('space-y-3', className)}>
        {scripts.map((script, index) => (
          <motion.div
            key={script.script_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ScriptButton
              script={script}
              variant={variant}
              onUse={onUse}
            />
          </motion.div>
        ))}
      </div>
    );
  }

  // Group scripts by situation
  const groupedScripts = scripts.reduce((acc, script) => {
    if (!acc[script.situation]) {
      acc[script.situation] = [];
    }
    acc[script.situation].push(script);
    return acc;
  }, {} as Record<string, Script[]>);

  return (
    <div className={cn('space-y-6', className)}>
      {Object.entries(groupedScripts).map(([situation, situationScripts], groupIndex) => (
        <motion.div
          key={situation}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
            {situation.replace(/_/g, ' ')}
          </h3>
          <div className="space-y-3">
            {situationScripts
              .sort((a, b) => a.order_in_sequence - b.order_in_sequence)
              .map((script, index) => (
                <motion.div
                  key={script.script_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (groupIndex * 0.2) + (index * 0.1) }}
                >
                  <ScriptButton
                    script={script}
                    variant={variant}
                    onUse={onUse}
                  />
                </motion.div>
              ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
