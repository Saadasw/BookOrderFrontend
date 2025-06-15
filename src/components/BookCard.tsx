import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Book, Star } from 'lucide-react';

interface Author {
  id: string;
  name: string;
  selected: boolean;
  price: number;
}

interface BookCardProps {
  subject: string;
  authors: Author[];
  onAuthorToggle: (subjectId: string, authorId: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ subject, authors, onAuthorToggle }) => {
  return (
    <Card className="bg-white naksha-border bengali-shadow hover:shadow-lg transition-all duration-300 fun-bounce">
      <CardHeader className="pb-3 bg-gradient-to-r from-yellow-100 to-orange-100">
        <CardTitle className="text-orange-800 text-xl font-bold flex items-center gap-2">
          <Book className="w-5 h-5 text-yellow-600" />
          {subject}
          <Star className="w-4 h-4 text-yellow-500 animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {authors.map((author) => (
          <div key={author.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-green-50 hover:from-yellow-100 hover:to-green-100 transition-all duration-200 border border-orange-200">
            <Checkbox
              id={author.id}
              checked={author.selected}
              onCheckedChange={() => onAuthorToggle(subject, author.id)}
              className="border-2 border-orange-400 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-500 data-[state=checked]:to-yellow-500 data-[state=checked]:border-orange-500"
            />
            <div className="flex-1">
              <label htmlFor={author.id} className="text-orange-900 cursor-pointer hover:text-orange-700 transition-colors block font-medium">
                {author.name}
              </label>
              <div className="text-green-700 font-bold text-sm mt-1 flex items-center gap-1">
                <span className="text-orange-600">৳</span>
                {author.price}
                <span className="text-xs text-orange-500">টাকা</span>
              </div>
            </div>
            {author.selected && (
              <Badge className="bg-gradient-to-r from-green-200 to-yellow-200 text-green-800 border-2 border-green-400 shimmer-effect">
                নির্বাচিত ✓
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BookCard;