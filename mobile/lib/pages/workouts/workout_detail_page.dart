import 'package:flutter/material.dart';
import 'package:gymshare/api/models/workout.dart';
import 'package:gymshare/components/widgets/seamless_pattern.dart';
import 'package:gymshare/settings/colors.dart';

class WorkoutDetailPage extends StatelessWidget {
  final Workout workout;

  const WorkoutDetailPage({super.key, required this.workout});

  @override
  Widget build(BuildContext context) {
    return SeamlessPattern(
      child: SafeArea(
        child: Scaffold(
          backgroundColor: Colors.transparent,
          body: Center(
            child: Text(
              workout.title,
              style: const TextStyle(color: primaryTextColor, fontSize: 30),
            ),
          ),
        ),
      ),
    );
  }
}
