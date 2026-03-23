/// Data model for a book row in the Supabase books table.
class BookModel {
  final String id;
  final String userId;
  final String title;
  final String author;
  final String coverColor; // hex string e.g. '#2D4A3E'
  final String? notes;
  final int position;
  final bool isWishlist;
  final DateTime createdAt;

  const BookModel({
    required this.id,
    required this.userId,
    required this.title,
    required this.author,
    required this.coverColor,
    this.notes,
    required this.position,
    required this.isWishlist,
    required this.createdAt,
  });

  factory BookModel.fromJson(Map<String, dynamic> json) => BookModel(
        id: json['id'] as String,
        userId: json['user_id'] as String,
        title: json['title'] as String,
        author: json['author'] as String,
        coverColor: json['cover_color'] as String,
        notes: json['notes'] as String?,
        position: json['position'] as int,
        isWishlist: json['is_wishlist'] as bool,
        createdAt: DateTime.parse(json['created_at'] as String),
      );

  Map<String, dynamic> toInsertJson({required String userId}) => {
        'user_id': userId,
        'title': title,
        'author': author,
        'cover_color': coverColor,
        'notes': notes,
        'position': position,
        'is_wishlist': isWishlist,
      };
}
