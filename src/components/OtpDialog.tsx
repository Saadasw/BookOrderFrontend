import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { Shield, Phone, RefreshCw } from 'lucide-react';

interface OtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumber: string;
  sessionToken: string;
  onConfirm: () => void;
}

const OtpDialog: React.FC<OtpDialogProps> = ({ open, onOpenChange, phoneNumber, sessionToken, onConfirm }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      toast({ 
        title: "ভুল OTP", 
        description: "সঠিক OTP লিখুন", 
        variant: "destructive" 
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await apiClient.verifyOrder({
        session_token: sessionToken,
        pin_code: otp
      });
      
      toast({ 
        title: "অর্ডার নিশ্চিত!", 
        description: `অর্ডার #${response.id} সফলভাবে যাচাই ও নিশ্চিত করা হয়েছে।`,
        className: "bg-green-100 border-green-400 text-green-800"
      });
      
      onConfirm();
      onOpenChange(false);
      setOtp('');
      
    } catch (error) {
      toast({
        title: "যাচাইকরণ ব্যর্থ",
        description: error instanceof Error ? error.message : 'OTP যাচাই করতে ব্যর্থ',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await apiClient.resendCode(sessionToken);
      
      toast({ 
        title: "OTP পুনরায় পাঠানো হয়েছে", 
        description: response.message || "আপনার ফোনে নতুন OTP পাঠানো হয়েছে।",
        className: "bg-green-100 border-green-400 text-green-800"
      });
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: error instanceof Error ? error.message : "OTP পুনরায় পাঠাতে ব্যর্থ",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white naksha-border bengali-shadow text-orange-900 max-w-md">
        <DialogHeader className="bg-gradient-to-r from-yellow-100 to-orange-100 -m-6 mb-4 p-6 rounded-t-lg">
          <DialogTitle className="text-orange-800 text-xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-yellow-600" />
            ফোন নম্বর যাচাই করুন
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center bg-gradient-to-r from-yellow-50 to-green-50 p-4 rounded-lg naksha-border">
            <p className="text-orange-700 mb-2 flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              আমরা OTP পাঠিয়েছি:
            </p>
            <p className="text-green-700 font-bold text-lg">
              {phoneNumber}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-orange-800 font-semibold">OTP লিখুন</Label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="OTP লিখুন"
                className="bg-yellow-50 border-2 border-orange-300 text-orange-900 focus:border-orange-500 text-center text-xl tracking-widest font-bold"
                maxLength={8}
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={otp.length < 4 || loading}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 text-lg bengali-shadow"
            >
              {loading ? 'যাচাই করা হচ্ছে...' : 'যাচাই করুন ও অর্ডার নিশ্চিত করুন'}
            </Button>
          </form>
          
          <div className="text-center">
            <Button 
              variant="ghost" 
              className="text-orange-600 hover:text-orange-700 hover:bg-yellow-100 flex items-center gap-2"
              onClick={handleResendOTP}
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4" />
              OTP পুনরায় পাঠান
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpDialog;