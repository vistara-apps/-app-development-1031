import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileText, Eye, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import type { LegalGuide } from '@/types';

interface LegalGuideCardProps {
  guide: LegalGuide;
  variant?: 'default' | 'compact';
  onView?: (guide: LegalGuide) => void;
  onDownload?: (guide: LegalGuide) => void;
  className?: string;
}

export function LegalGuideCard({
  guide,
  variant = 'default',
  onView,
  onDownload,
  className
}: LegalGuideCardProps) {
  const isCompact = variant === 'compact';

  return (
    <Card 
      variant={variant} 
      className={cn('cursor-pointer hover:shadow-elevated transition-shadow', className)}
      onClick={() => onView?.(guide)}
    >
      <CardHeader className={isCompact ? 'pb-2' : undefined}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className={isCompact ? 'text-lg' : undefined}>
                {guide.title}
              </CardTitle>
              {!isCompact && (
                <CardDescription>
                  {guide.state} • {guide.language === 'es' ? 'Español' : 'English'}
                </CardDescription>
              )}
            </div>
          </div>
          
          {isCompact && (
            <div className="text-xs text-gray-500">
              {guide.state}
            </div>
          )}
        </div>
      </CardHeader>

      {!isCompact && (
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 line-clamp-3">
              {guide.content.substring(0, 150)}...
            </p>
            
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onView?.(guide);
                }}
                className="flex items-center space-x-1"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </Button>
              
              {onDownload && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(guide);
                  }}
                  className="flex items-center space-x-1"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

interface LegalGuideListProps {
  guides: LegalGuide[];
  variant?: 'default' | 'compact';
  onView?: (guide: LegalGuide) => void;
  onDownload?: (guide: LegalGuide) => void;
  className?: string;
}

export function LegalGuideList({
  guides,
  variant = 'default',
  onView,
  onDownload,
  className
}: LegalGuideListProps) {
  if (guides.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No guides available</h3>
        <p className="text-gray-600">
          Legal guides for your selected state will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {guides.map((guide, index) => (
        <motion.div
          key={guide.guide_id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <LegalGuideCard
            guide={guide}
            variant={variant}
            onView={onView}
            onDownload={onDownload}
          />
        </motion.div>
      ))}
    </div>
  );
}
