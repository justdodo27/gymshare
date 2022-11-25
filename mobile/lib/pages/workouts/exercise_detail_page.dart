import 'package:flutter/material.dart';
import 'package:gymshare/api/models/exercise.dart';
import 'package:gymshare/components/widgets/seamless_pattern.dart';
import 'package:gymshare/settings/colors.dart';

class ExerciseDetailPage extends StatelessWidget {
  final Exercise exercise;

  const ExerciseDetailPage({super.key, required this.exercise});

  @override
  Widget build(BuildContext context) {
    return SeamlessPattern(
      child: SafeArea(
        child: Scaffold(
          appBar: AppBar(
            title: Text(
              exercise.title,
              style: const TextStyle(color: primaryTextColor, fontSize: 20),
            ),
          ),
          backgroundColor: Colors.transparent,
          body: SingleChildScrollView(
            child: Column(
              children: [
                Image.network(exercise.thumbnailUrl),
                Container(
                  margin: const EdgeInsets.all(10.0),
                  child: const Text(
                    'Description',
                    style: TextStyle(
                      color: primaryTextColor,
                      fontSize: 20,
                    ),
                  ),
                ),
                Text(
                  '${(exercise.description)}',
                  style: const TextStyle(color: primaryTextColor, fontSize: 15),
                ),
                const SizedBox(
                  height: 10,
                ),
                const Divider(),
                const SizedBox(
                  height: 10,
                ),
                Container(
                  margin: const EdgeInsets.all(10.0),
                  child: const Text(
                    'Information',
                    style: TextStyle(
                      color: primaryTextColor,
                      fontSize: 20,
                    ),
                  ),
                ),
                Container(
                  margin: const EdgeInsets.all(10.0),
                  child: Text(
                    'Exercise Type ${(exercise.exerciseType)}',
                    style:
                        const TextStyle(color: primaryTextColor, fontSize: 15),
                  ),
                ),
                Container(
                  margin: const EdgeInsets.all(10.0),
                  child: Text(
                    'Difficulty ${(exercise.difficulty)}',
                    style:
                        const TextStyle(color: primaryTextColor, fontSize: 15),
                  ),
                ),
                Container(
                  margin: const EdgeInsets.all(10.0),
                  child: Text(
                    'Calories Burn Rate ${(exercise.caloriesBurnRate)} kcal',
                    style:
                        const TextStyle(color: primaryTextColor, fontSize: 15),
                  ),
                ),
                const SizedBox(
                  height: 10,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
