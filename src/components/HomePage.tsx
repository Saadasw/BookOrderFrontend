import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BookCard from './BookCard';
import OrderDialog from './OrderDialog';
import { booksData, Subject, Author } from '@/data/booksData';
import { ShoppingCart, BookOpen, Sparkles } from 'lucide-react';

const HomePage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(booksData);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);

  const handleAuthorToggle = (subjectName: string, authorId: string) => {
    setSubjects(prev => prev.map(subject => {
      if (subject.name === subjectName) {
        return {
          ...subject,
          authors: subject.authors.map(author => 
            author.id === authorId 
              ? { ...author, selected: !author.selected }
              : author
          )
        };
      }
      return subject;
    }));
  };

  const getSelectedBooks = (): Author[] => {
    const selected: Author[] = [];
    subjects.forEach(subject => {
      subject.authors.forEach(author => {
        if (author.selected) {
          selected.push(author);
        }
      });
    });
    return selected;
  };

  const selectedBooks = getSelectedBooks();
  const selectedCount = selectedBooks.length;
  const totalAmount = selectedBooks.reduce((sum, book) => sum + book.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      {/* Header with Bengali style */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-300 to-green-400 naksha-border shadow-lg bengali-shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-orange-800 flex items-center justify-center gap-2 fun-bounce">
              <BookOpen className="w-8 h-8" />
              বই অর্ডার করুন
              <Sparkles className="w-6 h-6 text-yellow-600" />
            </h1>
            <p className="text-orange-700 mt-2 text-lg">
              ক্লাস ১১ ও ১২ এর জন্য বই নির্বাচন করুন
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {selectedCount > 0 && (
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-200 text-orange-800 border-2 border-orange-400 px-4 py-2 text-lg font-semibold shimmer-effect">
                  {selectedCount} টি নির্বাচিত
                </Badge>
                <Badge className="bg-green-200 text-green-800 border-2 border-green-400 px-4 py-2 text-lg font-semibold">
                  ৳{totalAmount} টাকা
                </Badge>
              </div>
            )}
            <Button
              onClick={() => setOrderDialogOpen(true)}
              disabled={selectedCount === 0}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold px-8 py-3 text-lg bengali-shadow disabled:opacity-50 disabled:cursor-not-allowed fun-bounce"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              অর্ডার করুন
            </Button>
          </div>
        </div>
      </div>

      {/* Books Grid with naksha pattern */}
      <div className="container mx-auto px-4 py-8 naksha-pattern">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.map((subject) => (
            <BookCard
              key={subject.id}
              subject={subject.name}
              authors={subject.authors}
              onAuthorToggle={handleAuthorToggle}
            />
          ))}
        </div>
      </div>

      <OrderDialog
        open={orderDialogOpen}
        onOpenChange={setOrderDialogOpen}
        selectedBooks={selectedBooks}
      />
    </div>
  );
};

export default HomePage;