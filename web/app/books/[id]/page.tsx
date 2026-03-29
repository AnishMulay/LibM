import { redirect } from 'next/navigation'

export default function LegacyBookDetailPage({
  params,
}: {
  params: { id: string }
}) {
  redirect(`/book-detail?id=${params.id}`)
}
