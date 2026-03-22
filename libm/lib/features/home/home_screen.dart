import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('LibM')),
      body: Center(
        child: TextButton(
          onPressed: () async {
            await Supabase.instance.client.auth.signOut();
          },
          child: const Text('Sign out'),
        ),
      ),
    );
  }
}
