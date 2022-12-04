import 'package:flutter/material.dart';
import 'package:gymshare/api/models/exercise.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
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
          body: ScrollConfig(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  Hero(
                    tag: 'exercise ${exercise.id}',
                    child: Image.network(exercise.thumbnailUrl),
                  ),
                  Container(
                    margin: const EdgeInsets.all(20.0),
                    child: const Text(
                      'Description',
                      style: TextStyle(
                        color: primaryTextColor,
                        fontSize: 22,
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(10.0),
                    child: Text(
                      '${exercise.description}',
                      style: const TextStyle(
                          color: primaryTextColor, fontSize: 16),
                      textAlign: TextAlign.justify,
                    ),
                  ),
                  const SizedBox(
                    height: 10,
                  ),
                  const Divider(thickness: 2, color: secondaryColor),
                  const SizedBox(height: 10),
                  Container(
                    margin: const EdgeInsets.all(10.0),
                    child: const Text(
                      'Information',
                      style: TextStyle(
                        color: primaryTextColor,
                        fontSize: 22,
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  SizedBox(
                    height: 100,
                    child: Row(children: [
                      Expanded(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: const [
                            Text(
                              'Exercise type',
                              style: TextStyle(
                                color: primaryTextColor,
                                fontSize: 16,
                              ),
                            ),
                            Text(
                              'Difficulty',
                              style: TextStyle(
                                color: primaryTextColor,
                                fontSize: 16,
                              ),
                            ),
                            Text(
                              'Calories Burn Rate',
                              style: TextStyle(
                                color: primaryTextColor,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              (exercise.exerciseType),
                              style: const TextStyle(
                                color: primaryTextColor,
                                fontSize: 16,
                              ),
                            ),
                            Text(
                              '${(exercise.difficulty)}',
                              style: const TextStyle(
                                color: primaryTextColor,
                                fontSize: 16,
                              ),
                            ),
                            Text(
                              '${(exercise.caloriesBurnRate)}',
                              style: const TextStyle(
                                color: primaryTextColor,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ]),
                  ),
                  const SizedBox(
                    height: 40,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
