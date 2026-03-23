import 'package:flutter/material.dart';

/// Canonical color constants for LibM.
/// All screens must import from here — no local color definitions.
abstract class AppColors {
  // Base palette
  static const Color parchment   = Color(0xFFF5F0E8);
  static const Color forestGreen = Color(0xFF2D4A3E);
  static const Color darkRed     = Color(0xFF8B1A1A);

  // Cover swatch palette (8 old-money colors) — used by ColorPickerWidget
  static const List<Color> coverSwatches = [
    Color(0xFFF5F0E8), // Parchment
    Color(0xFF2D4A3E), // Forest Green
    Color(0xFF8B3A3A), // Burgundy
    Color(0xFF1A3A4A), // Navy
    Color(0xFFD4AF6A), // Aged Gold
    Color(0xFF3A3A3A), // Charcoal
    Color(0xFF9B4A4A), // Rust
    Color(0xFFFFFAF0), // Cream
  ];

  // Borders
  static const Color borderDefault = Colors.black87;

  // Shelf wood gradient stops
  static const Color shelfWoodLight = Color(0xFFC8A06E); // warm oak highlight
  static const Color shelfWoodDark  = Color(0xFF8B5E3C); // deep walnut shadow
  static const Color shelfLip       = Color(0xFF4A2E1A); // dark lip at shelf bottom
}
