import 'package:flutter/material.dart';
import '../../../core/theme/app_text_styles.dart';
import '../book_model.dart';

class BookSpineWidget extends StatelessWidget {
  final BookModel book;
  final VoidCallback? onTap;

  const BookSpineWidget({super.key, required this.book, this.onTap});

  Color _parseHex(String hex) {
    final cleaned = hex.replaceAll('#', '');
    final value = int.tryParse('FF$cleaned', radix: 16) ?? 0xFFF5F0E8;
    return Color(value);
  }

  @override
  Widget build(BuildContext context) {
    final spine = Material(
      color: Colors.transparent,
      child: SizedBox(
        width: 56,
        height: 200,
        child: Container(
          color: _parseHex(book.coverColor),
          child: RotatedBox(
            quarterTurns: 1,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    book.title,
                    style: AppTextStyles.spineTitle,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    book.author,
                    style: AppTextStyles.spineAuthor,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );

    if (onTap == null) return spine;
    return GestureDetector(onTap: onTap, child: spine);
  }
}
