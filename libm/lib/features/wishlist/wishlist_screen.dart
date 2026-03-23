import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import '../library/book_model.dart';
import '../library/book_service.dart';
import '../library/widgets/book_spine_widget.dart';

// Her account UID — only she sees the '+' add button (per D-04)
const _herUid = '67981be5-832f-44d4-bd45-a8a331565891';

class WishlistScreen extends StatefulWidget {
  const WishlistScreen({super.key});

  @override
  State<WishlistScreen> createState() => _WishlistScreenState();
}

class _WishlistScreenState extends State<WishlistScreen> {
  final _bookService = BookService();
  List<BookModel> _books = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadWishlist();
  }

  Future<void> _loadWishlist() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final books = await _bookService.fetchWishlist();
      if (mounted) {
        setState(() {
          _books = books;
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Error loading wishlist. Please try again.';
          _loading = false;
        });
      }
    }
  }

  bool get _isHer =>
      Supabase.instance.client.auth.currentUser?.id == _herUid;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.parchment,
      appBar: AppBar(
        backgroundColor: AppColors.parchment,
        elevation: 0,
        foregroundColor: Colors.black87,
        title: Text('Wishlist', style: AppTextStyles.heading),
        actions: [
          if (_isHer)
            IconButton(
              icon: const Icon(Icons.add),
              tooltip: 'Add to Wishlist',
              onPressed: () async {
                await context.push('/add-book', extra: {'isWishlist': true});
                _loadWishlist();
              },
            ),
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Sign out',
            onPressed: () async {
              await Supabase.instance.client.auth.signOut();
            },
          ),
        ],
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_loading) {
      return const Center(
        child: CircularProgressIndicator(color: AppColors.forestGreen),
      );
    }
    if (_error != null) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(_error!, style: AppTextStyles.error),
            const SizedBox(height: 8),
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: _loadWishlist,
              tooltip: 'Retry',
            ),
          ],
        ),
      );
    }
    if (_books.isEmpty) {
      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              height: 200,
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [AppColors.shelfWoodLight, AppColors.shelfWoodDark],
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black26,
                    blurRadius: 4,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: const Center(
                child: Text(
                  'Her wishlist is empty',
                  style: AppTextStyles.labelMuted,
                  textAlign: TextAlign.center,
                ),
              ),
            ),
            Container(height: 10, color: AppColors.shelfLip),
          ],
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: Wrap(
        spacing: 4,
        runSpacing: 32,
        children: _books
            .map((b) => BookSpineWidget(
                  key: ValueKey(b.id),
                  book: b,
                  onTap: () => context.push('/book-detail', extra: b),
                ))
            .toList(),
      ),
    );
  }
}
