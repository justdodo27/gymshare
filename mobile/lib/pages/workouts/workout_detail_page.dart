import 'package:flutter/material.dart';
import 'package:gymshare/api/models/exercise_in_workout.dart';
import 'package:gymshare/api/models/workout.dart';
import 'package:gymshare/components/widgets/seamless_pattern.dart';
import 'package:gymshare/settings/colors.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:gymshare/components/utils/routes.dart';
import 'package:gymshare/pages/workouts/exercise_detail_page.dart';

class WorkoutDetailPage extends StatelessWidget {
  final Workout workout;

  const WorkoutDetailPage({super.key, required this.workout});

  @override
  Widget build(BuildContext context) {
    final List<ExerciseInWorkout>? exercises = workout.exercises;
    return SeamlessPattern(
      child: SafeArea(
        child: Scaffold(
          appBar: AppBar(
            title: Text(
              workout.title,
              style: const TextStyle(color: primaryTextColor, fontSize: 20),
            ),
          ),
          backgroundColor: Colors.transparent,
          body: SingleChildScrollView(
            child: Column(
              children: [
                Image.network(workout.thumbnailUrl!),
                Container(
                  padding: const EdgeInsets.all(10.0),
                  color: secondaryColor,
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          workout.author.profilePictureUrl != null
                              ? Row(
                                  children: [
                                    Container(
                                      height: 50,
                                      width: 50,
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        image: DecorationImage(
                                          image: NetworkImage(workout
                                              .author.profilePictureUrl!),
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 6),
                                    Text(
                                      workout.author.username,
                                      style: const TextStyle(
                                        color: primaryTextColor,
                                        fontSize: 20,
                                      ),
                                    ),
                                  ],
                                )
                              : Row(
                                  children: [
                                    Container(
                                      height: 20,
                                      width: 20,
                                      decoration: const BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: tertiaryColor,
                                      ),
                                      child: const Icon(
                                        Icons.person,
                                        color: primaryColor,
                                        size: 20,
                                      ),
                                    ),
                                    const SizedBox(width: 6),
                                    Text(
                                      workout.author.username,
                                      style: const TextStyle(
                                        color: primaryTextColor,
                                        fontSize: 20,
                                      ),
                                    ),
                                  ],
                                ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  IconButton(
                                    onPressed: () {},
                                    icon: const Icon(Icons.play_arrow_outlined),
                                    iconSize: 25,
                                    splashRadius: 1,
                                  ),
                                ],
                              ),
                              Row(
                                children: [
                                  IconButton(
                                    onPressed: () {},
                                    icon: const Icon(Icons.favorite),
                                    iconSize: 25,
                                    splashRadius: 1,
                                  ),
                                ],
                              )
                            ],
                          ),
                        ],
                      ),
                      Container(
                        margin: const EdgeInsets.all(10.0),
                        child: Row(
                          children: [
                            RatingBar.builder(
                              ignoreGestures: true,
                              itemSize: 20,
                              initialRating: workout.avgRating.toDouble(),
                              minRating: 1,
                              direction: Axis.horizontal,
                              allowHalfRating: true,
                              itemCount: 5,
                              itemPadding: EdgeInsets.zero,
                              itemBuilder: (context, _) => const Icon(
                                Icons.star,
                                color: Colors.amber,
                              ),
                              onRatingUpdate: (rating) {},
                            ),
                            const SizedBox(width: 5),
                            Text(
                              '(${workout.ratingsCount})',
                              style: const TextStyle(
                                  color: primaryTextColor, fontSize: 15),
                            )
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
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
                  '${(workout.description)}',
                  style: const TextStyle(color: primaryTextColor, fontSize: 12),
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
                    'Informations',
                    style: TextStyle(
                      color: primaryTextColor,
                      fontSize: 20,
                    ),
                  ),
                ),
                Container(
                  margin: const EdgeInsets.all(10.0),
                  child: Text(
                    'Exercises ${(workout.exercises?.length)}',
                    style:
                        const TextStyle(color: primaryTextColor, fontSize: 15),
                  ),
                ),
                Container(
                  margin: const EdgeInsets.all(10.0),
                  child: Text(
                    'Complete Time ${((workout.avgTime! / 60).round())} min',
                    style:
                        const TextStyle(color: primaryTextColor, fontSize: 15),
                  ),
                ),
                Container(
                  margin: const EdgeInsets.all(10.0),
                  child: Text(
                    'Difficulty ${(workout.difficulty)}',
                    style:
                        const TextStyle(color: primaryTextColor, fontSize: 15),
                  ),
                ),
                Container(
                  margin: const EdgeInsets.all(10.0),
                  child: Text(
                    'Calories Burned ${(workout.sumOfCb)} kcal',
                    style:
                        const TextStyle(color: primaryTextColor, fontSize: 15),
                  ),
                ),
                const Divider(),
                const SizedBox(
                  height: 10,
                ),
                Container(
                  margin: const EdgeInsets.all(10.0),
                  child: const Text(
                    'Exercises',
                    style: TextStyle(
                      color: primaryTextColor,
                      fontSize: 20,
                    ),
                  ),
                ),
                Text(
                  'Cycles ${(workout.cycles)}',
                  style: const TextStyle(color: primaryTextColor, fontSize: 10),
                ),
                const SizedBox(
                  height: 10,
                ),
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: exercises?.length,
                  itemBuilder: (context, index) {
                    return ListTile(
                      title: Text(
                        exercises![index].exercise.title,
                        style: const TextStyle(
                            color: primaryTextColor, fontSize: 20),
                      ),
                      subtitle: Text(
                        (exercises[index].exercise.exerciseType),
                        style: const TextStyle(
                            color: primaryTextColor, fontSize: 10),
                      ),
                      leading: CircleAvatar(
                        backgroundColor: secondaryColor,
                        child: Text('${(exercises[index].order)}'),
                      ),
                      trailing: exercises[index].repeats == null ||
                              exercises[index].repeats == 0
                          ? Text(
                              '${(exercises[index].time! / 60).round()} min',
                              style: const TextStyle(
                                  color: primaryTextColor, fontSize: 15),
                            )
                          : Text(
                              'x${(exercises[index].repeats)}',
                              style: const TextStyle(
                                  color: primaryTextColor, fontSize: 15),
                            ),
                      onTap: () => Navigator.of(context).push(
                        createPageRoute(ExerciseDetailPage(
                            exercise: exercises[index].exercise)),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
