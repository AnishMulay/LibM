import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import 'book_model.dart';
import 'book_service.dart';

class BookDetailScreen extends StatefulWidget {
  final BookModel book;

  const BookDetailScreen({super.key, required this.book});

  @override
  State<BookDetailScreen> createState() => _BookDetailScreenState();
}

class _BookDetailScreenState extends State<BookDetailScreen> {
  final _bookService = BookService();
  bool _moving = false;
  String? _moveError;

  Color _parseHex(String hex) {
    final cleaned = hex.replaceAll('#', '');
    final value = int.tryParse('FF$cleaned', radix: 16) ?? 0xFF2D4A3E;
    return Color(value);
  }

  Future<void> _handleMoveToLibrary() async {
    setState(() {
      _moving = true;
      _moveError = null;
    });
    try {
      await _bookService.moveToLibrary(widget.book.id);
      if (mounted) context.pop();
    } catch (e) {
      if (mounted) {
        setState(() {
          _moving = false;
          _moveError = 'Error moving book to library. Please try again.';
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final book = widget.book;

    return Scaffold(
      backgroundColor: AppColors.parchment,
      appBar: AppBar(
        backgroundColor: AppColors.parchment,
        elevation: 0,
        foregroundColor: Colors.black87,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 24),

              // Cover swatch — 120x160px centered color block
              Center(
                child: Container(
                  width: 120,
                  height: 160,
                  decoration: BoxDecoration(
                    color: _parseHex(book.coverColor),
                    border: Border.all(color: Colors.black87, width: 2),
                  ),
                ),
              ),

              // Title
              const SizedBox(height: 16),
              Text(book.title, style: AppTextStyles.heading),

              // Author
              const SizedBox(height: 16),
              Text(book.author, style: AppTextStyles.body),

              // Notes section — hidden entirely if null or empty
              if (book.notes != null && book.notes!.isNotEmpty) ...[
                const SizedBox(height: 16),
                Text('Notes', style: AppTextStyles.label),
                const SizedBox(height: 8),
                Text(book.notes!, style: AppTextStyles.body),
              ],

              // Move to Library button — only for wishlist books
              if (book.isWishlist) ...[
                const SizedBox(height: 24),
                if (_moveError != null)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Text(_moveError!, style: AppTextStyles.error),
                  ),
                SizedBox(
                  height: 52,
                  child: ElevatedButton(
                    onPressed: _moving ? null : _handleMoveToLibrary,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF8B3A3A), // Burgundy
                      foregroundColor: Colors.white,
                      shape: const RoundedRectangleBorder(
                        borderRadius: BorderRadius.zero,
                      ),
                      side: const BorderSide(color: Colors.black, width: 2),
                      textStyle: const TextStyle(
                        fontFamily: 'Georgia',
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1,
                      ),
                    ),
                    child: _moving
                        ? const CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2,
                          )
                        : const Text('Move to Library'),
                  ),
                ),
                const SizedBox(height: 24),
              ] else
                const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
