import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiClient, OrderResponse } from '@/lib/api';
import { Search, Package, Clock, CheckCircle, XCircle, Phone, MapPin } from 'lucide-react';

const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPhone, setSearchPhone] = useState('');
  const { toast } = useToast();

  const fetchOrders = async (phoneNumber?: string) => {
    setLoading(true);
    try {
      const fetchedOrders = await apiClient.getOrders(phoneNumber);
      setOrders(fetchedOrders);
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: error instanceof Error ? error.message : 'অর্ডার আনতে ব্যর্থ',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(searchPhone || undefined);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'shipped': return <Package className="w-4 h-4 text-blue-600" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-700" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-orange-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-200 text-green-800 border-green-400';
      case 'processing': return 'bg-yellow-200 text-yellow-800 border-yellow-400';
      case 'shipped': return 'bg-blue-200 text-blue-800 border-blue-400';
      case 'delivered': return 'bg-green-300 text-green-900 border-green-500';
      case 'cancelled': return 'bg-red-200 text-red-800 border-red-400';
      default: return 'bg-orange-200 text-orange-800 border-orange-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 bg-white naksha-border bengali-shadow p-6 rounded-lg">
          <h1 className="text-3xl font-bold text-orange-800 mb-4 flex items-center gap-2">
            <Package className="w-8 h-8 text-yellow-600" />
            অর্ডার ব্যবস্থাপনা
          </h1>
          
          <form onSubmit={handleSearch} className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 max-w-md">
              <Label className="text-orange-800 font-semibold flex items-center gap-2">
                <Phone className="w-4 h-4" />
                ফোন নম্বর দিয়ে খুঁজুন
              </Label>
              <Input
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder="ফোন নম্বর লিখুন"
                className="bg-yellow-50 border-2 border-orange-300 text-orange-900 focus:border-orange-500"
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold bengali-shadow"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? 'খোঁজা হচ্ছে...' : 'খুঁজুন'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                setSearchPhone('');
                fetchOrders();
              }}
              className="border-2 border-orange-400 text-orange-800 hover:bg-yellow-100"
            >
              সাফ করুন
            </Button>
          </form>
        </div>

        {loading && orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mx-auto"></div>
            <p className="text-orange-700 mt-4 text-lg">অর্ডার লোড হচ্ছে...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white naksha-border bengali-shadow rounded-lg">
            <Package className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <p className="text-orange-700 text-lg">কোন অর্ডার পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <Card key={order.id} className="bg-white naksha-border bengali-shadow">
                <CardHeader className="bg-gradient-to-r from-yellow-100 to-orange-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-orange-800 text-xl">
                        অর্ডার #{order.id}
                      </CardTitle>
                      <p className="text-orange-600 mt-1">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.order_status)}
                      <Badge className={getStatusColor(order.order_status)}>
                        {order.order_status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="text-orange-800 font-semibold mb-3 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        গ্রাহকের তথ্য
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-orange-600 font-medium">ফোন:</span> {order.phone_number}</p>
                        <p className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-orange-600 mt-0.5" />
                          <span><span className="text-orange-600 font-medium">ঠিকানা:</span> {order.address}</span>
                        </p>
                        <p><span className="text-orange-600 font-medium">পেমেন্ট:</span> {order.payment_method}</p>
                        <p><span className="text-orange-600 font-medium">পেমেন্ট স্ট্যাটাস:</span> 
                          <Badge className="ml-2 bg-green-200 text-green-800">
                            {order.payment_status}
                          </Badge>
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="text-orange-800 font-semibold mb-3">অর্ডারকৃত বই</h4>
                      <div className="space-y-2 text-sm max-h-32 overflow-y-auto">
                        {order.books.map((book, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-orange-700">{book.title}</span>
                            <span className="text-green-700 font-semibold">৳{book.price}</span>
                          </div>
                        ))}
                        <div className="border-t-2 border-orange-300 pt-2 mt-3">
                          <div className="flex justify-between font-bold text-lg">
                            <span className="text-orange-800">মোট টাকা:</span>
                            <span className="text-green-700">৳{order.total_amount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;