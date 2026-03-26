import { Bookshelf } from '@/components/bookshelf/Bookshelf'

// TODO Phase 6: replace demoBooks with Supabase fetch
// const books = await fetchBooksFromSupabase(user.id)
const demoBooks = [
  { id: '1', title: 'The Great Gatsby',      author: 'F. Scott Fitzgerald', coverColor: '#F5F0E8' },
  { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee',           coverColor: '#2D4A3E' },
  { id: '3', title: 'Pride and Prejudice',   author: 'Jane Austen',          coverColor: '#8B1A1A' },
  { id: '4', title: '1984',                  author: 'George Orwell',        coverColor: '#0B3D91' },
  { id: '5', title: 'Jane Eyre',             author: 'Charlotte Bronte',     coverColor: '#D4AF37' },
  { id: '6', title: 'Wuthering Heights',     author: 'Emily Bronte',         coverColor: '#2C2C2C' },
  { id: '7', title: 'The Hobbit',            author: 'J.R.R. Tolkien',       coverColor: '#A0522D' },
  { id: '8', title: 'Persuasion',            author: 'Jane Austen',          coverColor: '#F5E6D3' },
]

export default function LibraryPage() {
  return (
    <main className="min-h-screen bg-parchment">
      <div className="px-md py-lg">
        <h1 className="text-display font-georgia text-text-primary mb-xl tracking-display">
          Library
        </h1>
        <Bookshelf books={demoBooks} />
      </div>
    </main>
  )
}
