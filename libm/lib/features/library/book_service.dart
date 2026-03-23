import 'package:supabase_flutter/supabase_flutter.dart';
import 'book_model.dart';

/// Encapsulates all Supabase CRUD for the books table.
/// Follows the same direct Supabase.instance.client pattern as AuthService.
class BookService {
  final _client = Supabase.instance.client;

  /// Fetches all shelf books (is_wishlist = false) ordered by position ascending.
  Future<List<BookModel>> fetchBooks() async {
    final data = await _client
        .from('books')
        .select()
        .eq('is_wishlist', false)
        .order('position', ascending: true);
    return (data as List)
        .map((row) => BookModel.fromJson(row as Map<String, dynamic>))
        .toList();
  }

  /// Inserts a new book. Position is set to (current max position + 1).
  Future<BookModel> addBook({
    required String title,
    required String author,
    required String coverColor,
    String? notes,
  }) async {
    final userId = _client.auth.currentUser!.id;

    // Determine next position
    final existing = await fetchBooks();
    final nextPosition = existing.isEmpty ? 0 : existing.last.position + 1;

    final payload = {
      'user_id': userId,
      'title': title.trim(),
      'author': author.trim(),
      'cover_color': coverColor,
      'notes': notes?.trim().isEmpty == true ? null : notes?.trim(),
      'position': nextPosition,
      'is_wishlist': false,
    };

    final inserted = await _client
        .from('books')
        .insert(payload)
        .select()
        .single();

    return BookModel.fromJson(inserted);
  }

  /// Updates the position column for a list of books in a single batch upsert.
  /// [orderedIds] is the full list of book IDs in new display order (index = new position).
  Future<void> updatePositions(List<String> orderedIds) async {
    final updates = orderedIds
        .asMap()
        .entries
        .map((e) => {'id': e.value, 'position': e.key})
        .toList();
    await _client.from('books').upsert(updates);
  }
}
