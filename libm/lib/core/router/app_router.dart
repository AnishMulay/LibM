import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter/material.dart';
import '../../features/library/library_screen.dart';
import '../../features/auth/login_screen.dart';
import '../../features/library/add_book_screen.dart';
import '../../features/library/book_detail_screen.dart';
import '../../features/library/book_model.dart';
import '../../features/wishlist/wishlist_screen.dart';

// Converts Supabase's auth state stream into a Listenable for GoRouter.
class _GoRouterRefreshStream extends ChangeNotifier {
  _GoRouterRefreshStream() {
    Supabase.instance.client.auth.onAuthStateChange.listen((_) {
      notifyListeners();
    });
  }
}

final GoRouter appRouter = GoRouter(
  initialLocation: '/login',
  refreshListenable: _GoRouterRefreshStream(),
  redirect: (context, state) {
    final session = Supabase.instance.client.auth.currentSession;
    final isLoggedIn = session != null;
    final isOnLogin = state.matchedLocation == '/login';

    if (!isLoggedIn && !isOnLogin) return '/login';
    if (isLoggedIn && isOnLogin) return '/home';
    return null;
  },
  routes: [
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/home',
      builder: (context, state) => const LibraryScreen(),
    ),
    GoRoute(
      path: '/wishlist',
      builder: (context, state) => const WishlistScreen(),
    ),
    GoRoute(
      path: '/add-book',
      builder: (context, state) {
        final extra = state.extra as Map<String, dynamic>?;
        final isWishlist = extra?['isWishlist'] as bool? ?? false;
        return AddBookScreen(isWishlist: isWishlist);
      },
    ),
    GoRoute(
      path: '/book-detail',
      builder: (context, state) {
        final book = state.extra as BookModel;
        return BookDetailScreen(book: book);
      },
    ),
  ],
);
