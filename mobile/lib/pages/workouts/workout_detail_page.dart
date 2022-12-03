import 'package:flutter/material.dart';
import 'package:gymshare/api/models/exercise_in_workout.dart';
import 'package:gymshare/api/models/workout.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
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
            backgroundColor: secondaryColor,
            title: Text(
              workout.title,
              style: const TextStyle(color: primaryTextColor, fontSize: 20),
            ),
          ),
          backgroundColor: Colors.transparent,
          body: ScrollConfig(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  if (workout.thumbnailUrl != null)
                    Hero(
                      tag: 'workout image ${workout.id}',
                      child: Image.network(workout.thumbnailUrl!),
                    ),
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
                                      icon:
                                          const Icon(Icons.play_arrow_outlined),
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
                    padding: const EdgeInsets.all(10),
                    margin: const EdgeInsets.all(10.0),
                    child: const Text(
                      'Description',
                      style: TextStyle(
                        color: primaryTextColor,
                        fontSize: 22,
                      ),
                    ),
                  ),
                  Text(
                    '${workout.description}',
                    style:
                        const TextStyle(color: primaryTextColor, fontSize: 16),
                    textAlign: TextAlign.justify,
                  ),
                  const SizedBox(height: 10),
                  const Divider(
                    thickness: 2,
                    color: secondaryColor,
                  ),
                  const SizedBox(height: 10),
                  Container(
                    margin: const EdgeInsets.all(10.0),
                    child: const Text(
                      'Informations',
                      style: TextStyle(
                        color: primaryTextColor,
                        fontSize: 22,
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  SizedBox(
                    height: 130,
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: const [
                              Text(
                                'Exercises',
                                style: TextStyle(
                                  color: primaryTextColor,
                                  fontSize: 16,
                                ),
                              ),
                              Text(
                                'Complete time',
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
                                'Calories',
                                style: TextStyle(
                                  color: primaryTextColor,
                                  fontSize: 16,
                                ),
                              ),
                              Text(
                                'Cycles ',
                                style: TextStyle(
                                    color: primaryTextColor, fontSize: 16),
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
                                '${(workout.exercises?.length)}',
                                style: const TextStyle(
                                    color: primaryTextColor, fontSize: 16),
                              ),
                              Text(
                                '${((workout.avgTime! / 60).round())} min',
                                style: const TextStyle(
                                    color: primaryTextColor, fontSize: 16),
                              ),
                              Text(
                                '${(workout.difficulty)}',
                                style: const TextStyle(
                                    color: primaryTextColor, fontSize: 16),
                              ),
                              Text(
                                '${(workout.sumOfCb)} kcal',
                                style: const TextStyle(
                                    color: primaryTextColor, fontSize: 16),
                              ),
                              Text(
                                '${(workout.cycles)}',
                                style: const TextStyle(
                                    color: primaryTextColor, fontSize: 16),
                              ),
                            ],
                          ),
                        )
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Divider(
                    thickness: 2,
                    color: secondaryColor,
                  ),
                  Container(
                    margin: const EdgeInsets.all(10.0),
                    child: const Text(
                      'Exercises',
                      style: TextStyle(
                        color: primaryTextColor,
                        fontSize: 22,
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
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
                          child: Text('${index + 1}'),
                        ),
                        trailing: exercises[index].repeats == null ||
                                exercises[index].repeats == 0
                            ? Text(
                                '${(exercises[index].time! / 60).round()} min',
                                style: const TextStyle(
                                    color: primaryTextColor, fontSize: 15),
                              )
                            : Text(
                                '${(exercises[index].series)}x${(exercises[index].repeats)}',
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
      ),
    );
  }
}
