import 'package:flutter/material.dart';
import 'app_colors.dart';

/// Shared text style helpers for LibM.
/// Uses Georgia serif throughout — no system fonts.
abstract class AppTextStyles {
  static const String _font = 'Georgia';

  static const TextStyle display = TextStyle(
    fontFamily: _font,
    fontSize: 48,
    fontWeight: FontWeight.bold,
    color: Colors.black87,
    letterSpacing: 2,
  );

  static const TextStyle heading = TextStyle(
    fontFamily: _font,
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: Colors.black87,
  );

  static const TextStyle body = TextStyle(
    fontFamily: _font,
    fontSize: 16,
    fontWeight: FontWeight.w400,
    color: Colors.black87,
  );

  static const TextStyle label = TextStyle(
    fontFamily: _font,
    fontSize: 14,
    fontWeight: FontWeight.w400,
    color: Colors.black87,
  );

  static const TextStyle labelMuted = TextStyle(
    fontFamily: _font,
    fontSize: 14,
    fontWeight: FontWeight.w400,
    fontStyle: FontStyle.italic,
    color: Colors.black54,
  );

  static const TextStyle error = TextStyle(
    fontFamily: _font,
    fontSize: 14,
    fontWeight: FontWeight.w400,
    color: AppColors.darkRed,
  );

  static const TextStyle spineTitle = TextStyle(
    fontFamily: _font,
    fontSize: 14,
    fontWeight: FontWeight.w400,
    color: Colors.black87,
  );

  static const TextStyle spineAuthor = TextStyle(
    fontFamily: _font,
    fontSize: 14,        // was 11 — consolidated to 4-size system per UI-SPEC
    fontWeight: FontWeight.w400,
    color: Colors.black54,
  );
}
