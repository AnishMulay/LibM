import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';
import 'book_service.dart';
import 'widgets/color_picker_widget.dart';

class AddBookScreen extends StatefulWidget {
  const AddBookScreen({super.key});

  @override
  State<AddBookScreen> createState() => _AddBookScreenState();
}

class _AddBookScreenState extends State<AddBookScreen> {
  final _titleController = TextEditingController();
  final _authorController = TextEditingController();
  final _notesController = TextEditingController();
  final _bookService = BookService();

  Color _selectedColor = AppColors.coverSwatches[1]; // Forest Green
  bool _loading = false;
  String? _titleError;
  String? _authorError;
  String? _saveError;

  @override
  void dispose() {
    _titleController.dispose();
    _authorController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  String _toHex(Color color) {
    return '#${(color.toARGB32() & 0xFFFFFF).toRadixString(16).padLeft(6, '0').toUpperCase()}';
  }

  Color _hexToColor(String hex) {
    final cleaned = hex.replaceAll('#', '');
    final value = int.tryParse('FF$cleaned', radix: 16) ?? 0xFF2D4A3E;
    return Color(value);
  }

  Future<void> _handleSave() async {
    setState(() {
      _titleError = null;
      _authorError = null;
      _saveError = null;
    });

    if (_titleController.text.trim().isEmpty) {
      setState(() => _titleError = 'Title is required');
    }
    if (_authorController.text.trim().isEmpty) {
      setState(() => _authorError = 'Author is required');
    }

    if (_titleError != null || _authorError != null) {
      return;
    }

    setState(() => _loading = true);

    try {
      await _bookService.addBook(
        title: _titleController.text.trim(),
        author: _authorController.text.trim(),
        coverColor: _toHex(_selectedColor),
        notes: _notesController.text.trim().isEmpty
            ? null
            : _notesController.text.trim(),
      );
      if (mounted) context.pop();
    } catch (_) {
      setState(() {
        _saveError = 'Error saving book. Please try again.';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    const inputBorder = OutlineInputBorder(
      borderRadius: BorderRadius.zero,
      borderSide: BorderSide(color: Colors.black87, width: 2),
    );
    const focusedBorder = OutlineInputBorder(
      borderRadius: BorderRadius.zero,
      borderSide: BorderSide(color: AppColors.forestGreen, width: 2),
    );

    return Scaffold(
      backgroundColor: AppColors.parchment,
      appBar: AppBar(
        title: Text('Add Book', style: AppTextStyles.heading),
        backgroundColor: AppColors.parchment,
        elevation: 0,
        foregroundColor: Colors.black87,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 16),
            TextField(
              controller: _titleController,
              decoration: InputDecoration(
                labelText: 'Title',
                labelStyle: AppTextStyles.label,
                border: inputBorder,
                enabledBorder: inputBorder,
                focusedBorder: focusedBorder,
                filled: true,
                fillColor: Colors.white,
              ),
            ),
            if (_titleError != null)
              Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Text(_titleError!, style: AppTextStyles.error),
              ),
            const SizedBox(height: 16),
            TextField(
              controller: _authorController,
              decoration: InputDecoration(
                labelText: 'Author',
                labelStyle: AppTextStyles.label,
                border: inputBorder,
                enabledBorder: inputBorder,
                focusedBorder: focusedBorder,
                filled: true,
                fillColor: Colors.white,
              ),
            ),
            if (_authorError != null)
              Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Text(_authorError!, style: AppTextStyles.error),
              ),
            const SizedBox(height: 24),
            ColorPickerWidget(
              selectedColor: _selectedColor,
              onColorChanged: (hex) {
                setState(() {
                  _selectedColor = _hexToColor(hex);
                });
              },
            ),
            const SizedBox(height: 24),
            TextField(
              controller: _notesController,
              maxLines: 4,
              decoration: InputDecoration(
                labelText: 'Notes (optional)',
                labelStyle: AppTextStyles.label,
                border: inputBorder,
                enabledBorder: inputBorder,
                focusedBorder: focusedBorder,
                filled: true,
                fillColor: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            if (_saveError != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Text(_saveError!, style: AppTextStyles.error),
              ),
            const SizedBox(height: 24),
            SizedBox(
              height: 52,
              child: ElevatedButton(
                onPressed: _loading ? null : _handleSave,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.forestGreen,
                  foregroundColor: Colors.white,
                  shape: const RoundedRectangleBorder(
                    borderRadius: BorderRadius.zero,
                  ),
                  side: const BorderSide(color: Colors.black87, width: 2),
                  textStyle: const TextStyle(
                    fontFamily: 'Georgia',
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1,
                  ),
                ),
                child: _loading
                    ? const CircularProgressIndicator(
                        color: Colors.white,
                        strokeWidth: 2,
                      )
                    : const Text('Save Book'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
