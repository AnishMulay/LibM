import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';

class ColorPickerWidget extends StatelessWidget {
  final Color selectedColor;
  final ValueChanged<String> onColorChanged;

  const ColorPickerWidget({
    super.key,
    required this.selectedColor,
    required this.onColorChanged,
  });

  String _toHex(Color color) {
    return '#${(color.value & 0xFFFFFF).toRadixString(16).padLeft(6, '0').toUpperCase()}';
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Cover Colour', style: AppTextStyles.label),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: AppColors.coverSwatches.map((color) {
            final isSelected = color.value == selectedColor.value;
            return GestureDetector(
              onTap: () => onColorChanged(_toHex(color)),
              child: Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  color: color,
                  border: isSelected
                      ? Border.all(color: Colors.black87, width: 3)
                      : Border.all(color: Colors.black26, width: 1),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}
