"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, DollarSign, AlertCircle } from "lucide-react";
import { createTip } from "@/lib/supabase";
import { sendUSDC, getUSDCBalance } from "@/lib/wallet";
import { useToast } from "@/components/ui/use-toast";

interface TipModalProps {
  creator: any;
  fan: any;
  onClose: () => void;
  onTipComplete?: (tipData: any) => void;
}

const PRESET_AMOUNTS = [1, 5, 10, 20, 50];

export default function TipModal({
  creator,
  fan,
  onClose,
  onTipComplete,
}: TipModalProps) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  
  const { toast } = useToast();

  const handlePresetClick = (preset: number) => {
    setSelectedPreset(preset);
    setAmount(preset.toString());
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPreset(null);
    setAmount(e.target.value);
  };

  const checkBalance = async () => {
    if (!fan?.walletAddress) return;
    
    setIsCheckingBalance(true);
    try {
      const balance = await getUSDCBalance(fan.walletAddress);
      setUsdcBalance(balance);
      
      // Check if balance is sufficient
      if (balance < parseFloat(amount)) {
        setError(`Insufficient USDC balance. You have ${balance.toFixed(2)} USDC available.`);
      } else {
        setError(null);
      }
    } catch (err) {
      console.error("Error checking balance:", err);
    } finally {
      setIsCheckingBalance(false);
    }
  };

  const handleSubmit = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Check balance first
      await checkBalance();
      
      if (usdcBalance !== null && usdcBalance < parseFloat(amount)) {
        setError(`Insufficient USDC balance. You have ${usdcBalance.toFixed(2)} USDC available.`);
        setIsSubmitting(false);
        return;
      }
      
      // Create tip record in database
      const tipData = await createTip({
        creator_id: creator.id,
        fan_id: fan.id,
        amount: parseFloat(amount),
        currency: "USDC",
        status: "pending",
        message: message,
      });
      
      if (!tipData) {
        throw new Error("Failed to create tip record");
      }
      
      // Send USDC transaction
      // Note: In a real implementation, you would use the user's wallet to sign the transaction
      // This is a simplified version that assumes we have access to the private key
      const privateKey = "0x1234567890abcdef"; // This would come from a secure source
      
      const transaction = await sendUSDC(
        fan.walletAddress,
        creator.base_wallet_address,
        parseFloat(amount),
        privateKey,
        "tip",
        "tip",
        tipData.id
      );
      
      if (!transaction.success) {
        throw new Error("Failed to send USDC");
      }
      
      // Update tip record with transaction hash
      // This would typically be done by a backend service
      
      toast({
        title: "Tip Sent!",
        description: `You successfully sent $${parseFloat(amount).toFixed(2)} to ${creator.name}`,
      });
      
      if (onTipComplete) {
        onTipComplete(tipData);
      }
      
      onClose();
    } catch (err: any) {
      console.error("Error sending tip:", err);
      setError(err.message || "Failed to send tip. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send a Tip to {creator.name}</DialogTitle>
          <DialogDescription>
            Support {creator.name} with a one-time tip in USDC.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USDC)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="5.00"
                value={amount}
                onChange={handleAmountChange}
                className="pl-7"
                onBlur={checkBalance}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {PRESET_AMOUNTS.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant={selectedPreset === preset ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePresetClick(preset)}
                >
                  ${preset}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a message to your tip..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
          
          {error && (
            <div className="bg-destructive/10 p-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          
          {isCheckingBalance && (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm">Checking balance...</span>
            </div>
          )}
          
          {usdcBalance !== null && !error && (
            <p className="text-sm text-muted-foreground">
              Available balance: {usdcBalance.toFixed(2)} USDC
            </p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !!error}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <DollarSign className="mr-2 h-4 w-4" />
                Send ${amount || "0.00"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

