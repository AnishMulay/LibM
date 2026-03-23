import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:reorderables/reorderables.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import 'book_model.dart';
import 'book_service.dart';
import 'widgets/book_spine_widget.dart';
import 'widgets/shelf_widget.dart';

class LibraryScreen extends StatefulWidget {
  const LibraryScreen({super.key});

  @override
  State<LibraryScreen> createState() => _LibraryScreenState();
}

class _LibraryScreenState extends State<LibraryScreen> {
  final _bookService = BookService();
  List<BookModel> _books = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadBooks();
  }

  Future<void> _loadBooks() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final books = await _bookService.fetchBooks();
      if (mounted) {
        setState(() {
          _books = books;
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Error loading books. Please try again.';
          _loading = false;
        });
      }
    }
  }

  void _handleReorder(int oldIndex, int newIndex) {
    setState(() {
      final book = _books.removeAt(oldIndex);
      _books.insert(newIndex, book);
    });
    // Persist to Supabase asynchronously (don't await — optimistic UI)
    _bookService.updatePositions(_books.map((b) => b.id).toList());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.parchment,
      appBar: AppBar(
        backgroundColor: AppColors.parchment,
        elevation: 0,
        foregroundColor: Colors.black87,
        title: Text('Library', style: AppTextStyles.heading),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            tooltip: 'Add Book',
            onPressed: () async {
              await context.push('/add-book');
              _loadBooks(); // refresh after returning from add-book
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
      return Center(child: Text(_error!, style: AppTextStyles.error));
    }
    if (_books.isEmpty) {
      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        child: ShelfWidget(isEmpty: true, children: const []),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: ReorderableWrap(
        spacing: 4,
        runSpacing: 32, // visual gap between shelf rows
        onReorder: _handleReorder,
        children: _books
            .map((b) => BookSpineWidget(key: ValueKey(b.id), book: b))
            .toList(),
      ),
    );
  }
}
