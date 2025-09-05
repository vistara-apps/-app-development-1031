import React from 'react';
import { cn, formatTimestamp, copyToClipboard } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Share2, Copy, Download, ExternalLink, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { ShareableCard } from '@/types';

interface ShareableCardPreviewProps {
  card: ShareableCard;
  variant?: 'normal' | 'mobile';
  onShare?: (card: ShareableCard) => void;
  onDownload?: (card: ShareableCard) => void;
  className?: string;
}

export function ShareableCardPreview({
  card,
  variant = 'normal',
  onShare,
  onDownload,
  className
}: ShareableCardPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    if (!card.ipfsUrl) {
      toast.error('Card not yet uploaded to IPFS');
      return;
    }

    const success = await copyToClipboard(card.ipfsUrl);
    if (success) {
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy link');
    }
  };

  const handleOpenLink = () => {
    if (card.ipfsUrl) {
      window.open(card.ipfsUrl, '_blank');
    }
  };

  const isMobile = variant === 'mobile';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={className}
    >
      <Card className={cn('border-2 border-primary/20', isMobile && 'max-w-sm')}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className={cn('text-lg', isMobile && 'text-base')}>
              {card.title}
            </CardTitle>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs text-gray-500">Live</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Location and Time */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>
                {card.location.address || `${card.location.lat.toFixed(4)}, ${card.location.lon.toFixed(4)}`}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{formatTimestamp(card.timestamp)}</span>
            </div>
          </div>

          {/* Content */}
          <div className="bg-surface rounded-md p-3">
            <p className={cn('text-sm text-gray-700 leading-relaxed', isMobile && 'text-xs')}>
              {card.content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={handleCopyLink}
              disabled={!card.ipfsUrl}
              className="flex items-center space-x-1"
            >
              <Copy className="h-4 w-4" />
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </Button>

            {card.ipfsUrl && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleOpenLink}
                className="flex items-center space-x-1"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open</span>
              </Button>
            )}

            {onShare && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onShare(card)}
                className="flex items-center space-x-1"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            )}

            {onDownload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDownload(card)}
                className="flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            )}
          </div>

          {/* IPFS Status */}
          {card.ipfsUrl && (
            <div className="text-xs text-gray-500 border-t pt-2">
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <span>Stored on IPFS - Permanently accessible</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface ShareableCardListProps {
  cards: ShareableCard[];
  variant?: 'normal' | 'mobile';
  onShare?: (card: ShareableCard) => void;
  onDownload?: (card: ShareableCard) => void;
  className?: string;
}

export function ShareableCardList({
  cards,
  variant = 'normal',
  onShare,
  onDownload,
  className
}: ShareableCardListProps) {
  if (cards.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No cards created</h3>
        <p className="text-gray-600">
          Shareable incident cards will appear here after you create them.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ShareableCardPreview
            card={card}
            variant={variant}
            onShare={onShare}
            onDownload={onDownload}
          />
        </motion.div>
      ))}
    </div>
  );
}
