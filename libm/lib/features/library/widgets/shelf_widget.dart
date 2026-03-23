import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';

class ShelfWidget extends StatelessWidget {
  /// Spine widgets to display on this shelf row.
  final List<Widget> children;

  /// If true, renders the empty-state prompt instead of children.
  final bool isEmpty;

  const ShelfWidget({super.key, required this.children, this.isEmpty = false});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Shelf body — wood gradient
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
          padding: const EdgeInsets.fromLTRB(8, 8, 8, 0),
          child: isEmpty
              ? Center(
                  child: Text(
                    'Add your first book',
                    style: AppTextStyles.labelMuted,
                    textAlign: TextAlign.center,
                  ),
                )
              : Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: children,
                ),
        ),
        // Shelf lip
        Container(
          height: 10,
          color: AppColors.shelfLip,
        ),
      ],
    );
  }
}
