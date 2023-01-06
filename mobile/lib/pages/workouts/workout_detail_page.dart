import 'dart:io';

import 'package:flutter/material.dart';
import 'package:gymshare/api/models/exercise_in_workout.dart';
import 'package:gymshare/api/models/workout.dart';
import 'package:gymshare/components/utils/helpers.dart';
import 'package:gymshare/components/utils/requests.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/components/widgets/seamless_pattern.dart';
import 'package:gymshare/pages/workouts/add_exercise.dart';
import 'package:gymshare/pages/workouts/add_workout_page.dart';
import 'package:gymshare/settings/colors.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:gymshare/components/utils/routes.dart';
import 'package:gymshare/pages/workouts/exercise_detail_page.dart';

class WorkoutDetailPage extends StatefulWidget {
  final bool editable;
  final bool isFavorite;
  final Workout workout;

  const WorkoutDetailPage({
    super.key,
    required this.workout,
    required this.editable,
    required this.isFavorite,
  });

  @override
  State<WorkoutDetailPage> createState() => _WorkoutDetailPageState();
}

class _WorkoutDetailPageState extends State<WorkoutDetailPage> {
  final _controller = ScrollController();
  late bool isFavorite;
  late Widget image;
  late String title;
  late String? description;
  late int cycles;

  List<ExerciseInWorkout> exercisesSaved = [];
  List<ExerciseInWorkout> exercisesToSave = [];

  bool edited = false;
  bool editExercises = false;

  Map<String, dynamic> get data => <String, dynamic>{
        'title': title,
        'image': image,
        'isFavorite': isFavorite,
      };

  void _setNewData(data) {
    if (data == null) {
      edited = false;
      return;
    }
    setState(() {
      title = data['title'];
      description = data['description'];
      cycles = data['cycles'];
      edited = true;

      if (data['image_path'] != null) {
        image = Image.file(File(data['image_path']));
      }
    });
  }

  void _saveWorkout() async {
    exercisesSaved.clear();
    exercisesSaved.addAll(exercisesToSave);
    if (await editWorkoutExercises(
      context,
      mounted: mounted,
      workoutId: widget.workout.id,
      exercises: exercisesSaved,
    )) {
      ScaffoldMessenger.of(context).showSnackBar(
        getInfoSnackBar(
          text: 'Workout exercises has been edited.',
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
          getErrorSnackBar(text: 'Could not edit the workout\'s exercises.'));
    }
  }

  @override
  void initState() {
    super.initState();
    exercisesSaved = widget.workout.exercises!;
    exercisesToSave.addAll(widget.workout.exercises ?? []);

    isFavorite = widget.isFavorite;
    title = widget.workout.title;
    description = widget.workout.description;
    cycles = widget.workout.cycles.toInt();
    if (widget.workout.thumbnailUrl != null) {
      image = Image.network(widget.workout.thumbnailUrl!);
    } else {
      image = Container();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SeamlessPattern(
      child: SafeArea(
        child: Scaffold(
          appBar: AppBar(
            backgroundColor: secondaryColor,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () => edited
                  ? Navigator.of(context).pop(data)
                  : Navigator.of(context).pop(),
            ),
            title: Text(
              title,
              style: const TextStyle(color: primaryTextColor, fontSize: 20),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.play_arrow),
                onPressed: () {},
              ),
              if (!widget.editable)
                IconButton(
                  icon: Icon(
                      isFavorite ? Icons.favorite : Icons.favorite_outline),
                  onPressed: () async {
                    if (!isFavorite) {
                      if (await addToFavorites(
                        context,
                        mounted: mounted,
                        workoutId: widget.workout.id,
                      )) {
                        setState(() => isFavorite = true);
                      }
                    } else {
                      if (await deleteFromFavorites(
                        context,
                        mounted: mounted,
                        workoutId: widget.workout.id,
                      )) {
                        setState(() => isFavorite = false);
                      }
                    }
                  },
                ),
              if (widget.editable)
                IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed: () => Navigator.of(context)
                      .push(createPageRoute(
                        AddWorkoutPage(
                          workout: widget.workout,
                        ),
                      ))
                      .then((data) => _setNewData(data)),
                )
            ],
          ),
          backgroundColor: Colors.transparent,
          body: ScrollConfig(
            child: SingleChildScrollView(
              controller: _controller,
              child: Column(
                children: [
                  Hero(
                    tag: 'workout image ${widget.workout.id}',
                    child: image,
                  ),
                  Container(
                    padding: const EdgeInsets.all(10.0),
                    color: secondaryColor,
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            widget.workout.author.profilePictureUrl != null
                                ? Row(
                                    children: [
                                      Container(
                                        height: 35,
                                        width: 35,
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          image: DecorationImage(
                                            image: NetworkImage(widget.workout
                                                .author.profilePictureUrl!),
                                            fit: BoxFit.cover,
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 10),
                                      Text(
                                        widget.workout.author.username,
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
                                        widget.workout.author.username,
                                        style: const TextStyle(
                                          color: primaryTextColor,
                                          fontSize: 20,
                                        ),
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
                                    initialRating:
                                        widget.workout.avgRating.toDouble(),
                                    minRating: 1,
                                    direction: Axis.horizontal,
                                    allowHalfRating: true,
                                    itemCount: 5,
                                    itemPadding:
                                        const EdgeInsets.only(right: 5),
                                    itemBuilder: (context, _) => const Icon(
                                      Icons.star,
                                      color: Colors.amber,
                                    ),
                                    onRatingUpdate: (rating) {},
                                  ),
                                  const SizedBox(width: 5),
                                  Text(
                                    '(${widget.workout.ratingsCount})',
                                    style: const TextStyle(
                                        color: primaryTextColor, fontSize: 15),
                                  )
                                ],
                              ),
                            ),
                          ],
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
                  Padding(
                    padding: const EdgeInsets.all(10),
                    child: Text(
                      description ?? '',
                      style: const TextStyle(
                          color: primaryTextColor, fontSize: 16),
                      textAlign: TextAlign.justify,
                    ),
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
                                '${(widget.workout.exercises?.length)}',
                                style: const TextStyle(
                                    color: primaryTextColor, fontSize: 16),
                              ),
                              Text(
                                '${((widget.workout.avgTime! / 60).round())} min',
                                style: const TextStyle(
                                    color: primaryTextColor, fontSize: 16),
                              ),
                              Text(
                                '${(widget.workout.difficulty)}',
                                style: const TextStyle(
                                    color: primaryTextColor, fontSize: 16),
                              ),
                              Text(
                                '${(widget.workout.sumOfCb)} kcal',
                                style: const TextStyle(
                                    color: primaryTextColor, fontSize: 16),
                              ),
                              Text(
                                '$cycles',
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
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        const Text(
                          'Exercises',
                          style: TextStyle(
                            color: primaryTextColor,
                            fontSize: 22,
                          ),
                        ),
                        if (widget.editable)
                          IconButton(
                            onPressed: () {
                              if (editExercises) {
                                _saveWorkout();
                              } else {
                                scrollToBottom(_controller);
                              }
                              setState(() => editExercises = !editExercises);
                            },
                            icon: Icon(
                              editExercises ? Icons.check : Icons.edit_note,
                            ),
                          ),
                        if (editExercises)
                          IconButton(
                            onPressed: () {
                              setState(() {
                                editExercises = !editExercises;
                                exercisesToSave.clear();
                                exercisesToSave.addAll(exercisesSaved);
                              });
                            },
                            icon: const Icon(Icons.close),
                          )
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),
                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: exercisesToSave.length,
                    itemBuilder: (context, index) {
                      return buildExerciseTile(
                          entry: exercisesToSave[index], order: index + 1);
                    },
                  ),
                  if (editExercises)
                    ListTile(
                      onTap: () => Navigator.of(context)
                          .push(createBottomToTopPageRouteAnimation(
                              AddExercisePage(
                        count: exercisesToSave.length,
                      )))
                          .then((exercise) {
                        if (exercise != null) {
                          setState(() => exercisesToSave.add(exercise));
                          scrollToBottom(_controller);
                        }
                      }),
                      title: const Center(child: Icon(Icons.add)),
                    )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget buildExerciseTile({
    required ExerciseInWorkout entry,
    required int order,
  }) {
    return ListTile(
      title: Text(
        entry.exercise.title,
        style: const TextStyle(color: primaryTextColor, fontSize: 20),
      ),
      leading: CircleAvatar(
        backgroundColor: secondaryColor,
        child: Text('$order'),
      ),
      trailing: SizedBox(
        width: editExercises ? 190 : 100,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            if (entry.exercise.exerciseType == 'With time')
              Text(
                '${(entry.time! / 60).round()} min',
                style: const TextStyle(color: primaryTextColor, fontSize: 15),
              )
            else
              Text(
                '${entry.series}x${entry.repeats}',
                style: const TextStyle(color: primaryTextColor, fontSize: 15),
              ),
            if (editExercises) ...{
              const SizedBox(width: 40),
              IconButton(
                  onPressed: () =>
                      setState(() => exercisesToSave.removeAt(order - 1)),
                  icon: const Icon(Icons.close)),
            },
          ],
        ),
      ),
      onTap: () => Navigator.of(context).push(
        createPageRoute(ExerciseDetailPage(exercise: entry.exercise)),
      ),
    );
  }
}
