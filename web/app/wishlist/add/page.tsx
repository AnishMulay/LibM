import { redirect } from 'next/navigation'

export default function WishlistAddAliasPage() {
  redirect('/add-book?wishlist=1')
}
