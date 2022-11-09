import 'package:flutter/material.dart';
import 'package:gymshare/settings/colors.dart';

class ExercisesPage extends StatelessWidget {
  const ExercisesPage({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text('Exercises', style: TextStyle(color: primaryTextColor)),
    );
  }
}
