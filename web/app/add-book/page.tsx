import AddBookScreen from '@/components/libm/screens/AddBookScreen'

export default function AddBookPage({
  searchParams,
}: {
  searchParams?: { wishlist?: string }
}) {
  return <AddBookScreen isWishlist={searchParams?.wishlist === '1'} />
}
