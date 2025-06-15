import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Book, List, Home, Sparkles } from 'lucide-react';

const AppLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Navigation with Bengali style */}
      <nav className="bg-gradient-to-r from-yellow-400 via-orange-300 to-green-400 naksha-border shadow-lg bengali-shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 fun-bounce">
              <Book className="w-8 h-8 text-orange-800" />
              <h1 className="text-2xl font-bold text-orange-800 tracking-wider">
                বই<span className="text-green-800">ঘর</span>
                <Sparkles className="w-5 h-5 text-yellow-600 inline ml-1" />
              </h1>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button 
                  variant={location.pathname === '/' ? 'default' : 'ghost'}
                  className={location.pathname === '/' 
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold bengali-shadow' 
                    : 'text-orange-800 hover:text-orange-700 hover:bg-yellow-100'
                  }
                >
                  <Home className="w-4 h-4 mr-2" />
                  হোম
                </Button>
              </Link>
              
              <Link to="/orders">
                <Button 
                  variant={location.pathname === '/orders' ? 'default' : 'ghost'}
                  className={location.pathname === '/orders' 
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold bengali-shadow' 
                    : 'text-orange-800 hover:text-orange-700 hover:bg-yellow-100'
                  }
                >
                  <List className="w-4 h-4 mr-2" />
                  অর্ডার
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;