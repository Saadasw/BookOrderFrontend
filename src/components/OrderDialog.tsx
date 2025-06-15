import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import OtpDialog from './OtpDialog';
import { ShoppingBag, Phone, MapPin, CreditCard } from 'lucide-react';

interface Author {
  id: string;
  name: string;
  selected: boolean;
  price: number;
}

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBooks: Author[];
}

const OrderDialog: React.FC<OrderDialogProps> = ({ open, onOpenChange, selectedBooks }) => {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('cash_on_delivery');
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [sessionToken, setSessionToken] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const totalAmount = selectedBooks.reduce((sum, book) => sum + book.price, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !address) {
      toast({ title: "ত্রুটি", description: "সব তথ্য পূরণ করুন", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    
    try {
      const books = selectedBooks.map(book => ({
        id: book.id,
        title: book.name,
        price: book.price,
        quantity: 1
      }));
      
      const response = await apiClient.initiateOrder({
        phone_number: phone,
        address: address,
        payment_method: payment,
        books: books
      });
      
      setSessionToken(response.session_token);
      setShowOtpDialog(true);
      
      toast({
        title: "যাচাইকরণ কোড পাঠানো হয়েছে",
        description: response.message || "আপনার ফোনে যাচাইকরণ কোড দেখুন।",
        className: "bg-green-100 border-green-400 text-green-800"
      });
      
    } catch (error) {
      console.error('Order submission error:', error);
      toast({
        title: "ত্রুটি",
        description: error instanceof Error ? error.message : 'অর্ডার প্রক্রিয়া করতে ব্যর্থ',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrderConfirm = () => {
    toast({ 
      title: "অর্ডার নিশ্চিত!", 
      description: "আপনার অর্ডার সফলভাবে জমা দেওয়া হয়েছে।",
      className: "bg-green-100 border-green-400 text-green-800"
    });
    
    onOpenChange(false);
    setPhone('');
    setAddress('');
    setPayment('cash_on_delivery');
    setShowOtpDialog(false);
    setSessionToken('');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white naksha-border bengali-shadow text-orange-900 max-w-md">
          <DialogHeader className="bg-gradient-to-r from-yellow-100 to-orange-100 -m-6 mb-4 p-6 rounded-t-lg">
            <DialogTitle className="text-orange-800 text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-yellow-600" />
              আপনার অর্ডার সম্পূর্ণ করুন
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-yellow-50 to-green-50 p-4 rounded-lg naksha-border">
              <h3 className="text-orange-800 font-semibold mb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                অর্ডার সারাংশ
              </h3>
              <div className="space-y-2 text-sm">
                {selectedBooks.map((book) => (
                  <div key={book.id} className="flex justify-between text-orange-700">
                    <span>{book.name}</span>
                    <span className="text-green-700 font-semibold">৳{book.price}</span>
                  </div>
                ))}
                <div className="border-t-2 border-orange-300 pt-2 mt-3">
                  <div className="flex justify-between font-bold text-lg text-orange-800">
                    <span>মোট টাকা:</span>
                    <span className="text-green-700">৳{totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-orange-800 flex items-center gap-2 font-semibold">
                  <Phone className="w-4 h-4" />
                  ফোন নম্বর
                </Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="আপনার ফোন নম্বর লিখুন"
                  className="bg-yellow-50 border-2 border-orange-300 text-orange-900 focus:border-orange-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-orange-800 flex items-center gap-2 font-semibold">
                  <MapPin className="w-4 h-4" />
                  বাড়ির ঠিকানা
                </Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="আপনার ঠিকানা লিখুন"
                  className="bg-yellow-50 border-2 border-orange-300 text-orange-900 focus:border-orange-500"
                />
              </div>
              
              <div className="space-y-3">
                <Label className="text-orange-800 flex items-center gap-2 font-semibold">
                  <CreditCard className="w-4 h-4" />
                  পেমেন্ট পদ্ধতি
                </Label>
                <RadioGroup value={payment} onValueChange={setPayment}>
                  <div className="flex items-center space-x-2 p-2 rounded bg-yellow-50">
                    <RadioGroupItem value="cash_on_delivery" id="cod" className="border-orange-400 text-orange-600" />
                    <Label htmlFor="cod" className="text-orange-800">ক্যাশ অন ডেলিভারি</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded bg-yellow-50">
                    <RadioGroupItem value="bkash" id="bkash" className="border-orange-400 text-orange-600" />
                    <Label htmlFor="bkash" className="text-orange-800">বিকাশ</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded bg-yellow-50">
                    <RadioGroupItem value="nagad" id="nagad" className="border-orange-400 text-orange-600" />
                    <Label htmlFor="nagad" className="text-orange-800">নগদ</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 text-lg bengali-shadow"
              >
                {loading ? 'প্রক্রিয়াকরণ...' : 'অর্ডার জমা দিন'}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      
      <OtpDialog 
        open={showOtpDialog}
        onOpenChange={setShowOtpDialog}
        phoneNumber={phone}
        sessionToken={sessionToken}
        onConfirm={handleOrderConfirm}
      />
    </>
  );
};

export default OrderDialog;