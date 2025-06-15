export interface Author {
  id: string;
  name: string;
  selected: boolean;
  price: number;
}

export interface Subject {
  id: string;
  name: string;
  authors: Author[];
}

export const booksData: Subject[] = [
  {
    id: 'physics1',
    name: 'Physics First Paper',
    authors: [
      { id: 'p1a1', name: 'Dr. Shahjahan Tapan', selected: false, price: 450 },
      { id: 'p1a2', name: 'Hajari & Nag', selected: false, price: 420 },
      { id: 'p1a3', name: 'Dr. Mohammad Ali', selected: false, price: 380 }
    ]
  },
  {
    id: 'physics2',
    name: 'Physics Second Paper',
    authors: [
      { id: 'p2a1', name: 'Dr. Shahjahan Tapan', selected: false, price: 460 },
      { id: 'p2a2', name: 'Hajari & Nag', selected: false, price: 430 },
      { id: 'p2a3', name: 'Dr. Mohammad Ali', selected: false, price: 390 }
    ]
  },
  {
    id: 'biology1',
    name: 'Biology First Paper',
    authors: [
      { id: 'b1a1', name: 'Dr. Gazi Azmal', selected: false, price: 400 },
      { id: 'b1a2', name: 'Dr. Mahbubur Rahman', selected: false, price: 370 },
      { id: 'b1a3', name: 'Touhidul Alam', selected: false, price: 350 }
    ]
  },
  {
    id: 'biology2',
    name: 'Biology Second Paper',
    authors: [
      { id: 'b2a1', name: 'Dr. Gazi Azmal', selected: false, price: 410 },
      { id: 'b2a2', name: 'Dr. Mahbubur Rahman', selected: false, price: 380 },
      { id: 'b2a3', name: 'Touhidul Alam', selected: false, price: 360 }
    ]
  },
  {
    id: 'math1',
    name: 'Math First Paper',
    authors: [
      { id: 'm1a1', name: 'Dr. Ketab Uddin', selected: false, price: 480 },
      { id: 'm1a2', name: 'S.U Ahmed', selected: false, price: 440 },
      { id: 'm1a3', name: 'Dr. Sarwar Jahan', selected: false, price: 400 }
    ]
  },
  {
    id: 'math2',
    name: 'Math Second Paper',
    authors: [
      { id: 'm2a1', name: 'Dr. Ketab Uddin', selected: false, price: 490 },
      { id: 'm2a2', name: 'S.U Ahmed', selected: false, price: 450 },
      { id: 'm2a3', name: 'Dr. Sarwar Jahan', selected: false, price: 410 }
    ]
  },
  {
    id: 'chemistry1',
    name: 'Chemistry First Paper',
    authors: [
      { id: 'c1a1', name: 'Dr. Hajari', selected: false, price: 420 },
      { id: 'c1a2', name: 'Pradip Kumar Das', selected: false, price: 390 },
      { id: 'c1a3', name: 'Dr. Saifur Rahman', selected: false, price: 370 }
    ]
  },
  {
    id: 'chemistry2',
    name: 'Chemistry Second Paper',
    authors: [
      { id: 'c2a1', name: 'Dr. Hajari', selected: false, price: 430 },
      { id: 'c2a2', name: 'Pradip Kumar Das', selected: false, price: 400 },
      { id: 'c2a3', name: 'Dr. Saifur Rahman', selected: false, price: 380 }
    ]
  },
  {
    id: 'accounting',
    name: 'Accounting',
    authors: [
      { id: 'aa1', name: 'Dr. Abdul Halim', selected: false, price: 520 },
      { id: 'aa2', name: 'Mian Ahmed Ali', selected: false, price: 480 },
      { id: 'aa3', name: 'Prof. Hanif', selected: false, price: 450 }
    ]
  },
  {
    id: 'economics',
    name: 'Economics',
    authors: [
      { id: 'ea1', name: 'Dr. Akhtaruzzaman', selected: false, price: 500 },
      { id: 'ea2', name: 'Prof. Nurul Islam', selected: false, price: 460 },
      { id: 'ea3', name: 'Dr. Bazlul Haque', selected: false, price: 430 }
    ]
  },
  {
    id: 'finance',
    name: 'Finance',
    authors: [
      { id: 'fa1', name: 'Dr. Khan Sarwar Murshid', selected: false, price: 550 },
      { id: 'fa2', name: 'Prof. Abdul Awwal', selected: false, price: 510 },
      { id: 'fa3', name: 'Dr. Shamsul Alam', selected: false, price: 480 }
    ]
  }
];