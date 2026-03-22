import 'package:supabase_flutter/supabase_flutter.dart';

class AuthService {
  final _client = Supabase.instance.client;

  /// Signs in with email + password.
  /// Throws [AuthException] on invalid credentials.
  Future<void> signIn({required String email, required String password}) async {
    await _client.auth.signInWithPassword(email: email, password: password);
  }

  /// Signs out the current user and clears the local session.
  Future<void> signOut() async {
    await _client.auth.signOut();
  }

  /// Returns true if a session currently exists.
  bool get isLoggedIn => _client.auth.currentSession != null;
}
