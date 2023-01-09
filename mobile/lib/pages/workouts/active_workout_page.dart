import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:gymshare/api/models/rating.dart';
import 'package:gymshare/api/models/statistic_synchronize_entry.dart';
import 'package:gymshare/api/models/exercise_in_workout.dart';
import 'package:gymshare/components/utils/requests.dart';
import 'package:gymshare/components/utils/routes.dart';
import 'package:gymshare/components/widgets/rounded_rectangle_button.dart';
import 'package:gymshare/pages/workouts/active_exercise_page.dart';
import 'package:gymshare/settings/colors.dart';
import 'package:gymshare/api/models/workout.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';


class ActivityPage extends StatefulWidget {
  final Function callback;
  const ActivityPage({super.key, required this.callback});

  @override
  State<ActivityPage> createState() => _ActivityPageState();
}

class _ActivityPageState extends State<ActivityPage> {
  late Workout activeWorkout;
  final ScrollController scrollController = ScrollController();
  List<StatisticEntry> exerciseStats = [];

  void loadStats() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? exerciseStatsJSONString = prefs.getString('exercise_stats');
    if (exerciseStatsJSONString is String) {
      setState(() {
        exerciseStats.clear();
        exerciseStats.addAll(
          List<StatisticEntry>.from(
            jsonDecode(exerciseStatsJSONString).map((w) => StatisticEntry.fromJson(w))
          )
        );
      });
    }
  }

  Future<bool> loadData() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? workoutJSONString = prefs.getString('active_workout');
    if (workoutJSONString is String) {
      setState(() {
        activeWorkout = Workout.fromJson(jsonDecode(workoutJSONString));
      });
      loadStats();
      
      return true;
    }
    return false;
  }

  int countCompleted() {
    var countCompleted = 0;
    activeWorkout.exercises?.forEach((exercise) {
      var countSeries = exerciseStats.where((statistic) => statistic.exerciseId == exercise.exercise.id).length;
      final exerciseSeries = exercise.series?.toInt() ?? 0;
      if (exercise.series != null && countSeries >= exerciseSeries) {
        countCompleted += 1;
      }
    });
    return countCompleted;
  }

  late final Future<bool> dataLoaded;

  @override
  void initState() {
    super.initState();
    dataLoaded = loadData();
  }

  @override
  void dispose() {
    scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: dataLoaded,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.done) {
          return Scaffold(
            backgroundColor: Colors.transparent,
            body: SafeArea(
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.only(top: 8.0, bottom: 8.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.start, 
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(bottom: 15.0),
                        child: Text(
                          activeWorkout.title,
                          style: const TextStyle(fontSize: 30, color: primaryTextColor)
                        )
                      ),
                      Padding(
                        padding: const EdgeInsets.only(bottom: 15.0),
                        child: Text(
                          "Completed ${activeWorkout.exercises?.length}/${countCompleted()}",
                          style: const TextStyle(fontSize: 20, color: primaryTextColor),
                        )
                      ),
                      Expanded(
                        child: SizedBox(
                          height: 100.0,
                          width: double.infinity,
                          child: ListView.builder(
                            controller: scrollController,
                            itemCount: activeWorkout.exercises!.length,
                            itemBuilder: (context, index){
                              return ExerciseTile(
                                exercise: activeWorkout.exercises![index],
                                updateStats: loadStats,
                                seriesCount: exerciseStats.where(
                                  (element) => element.exerciseId == activeWorkout.exercises![index].exercise.id).length,
                                completed: exerciseStats.where(
                                  (element) => element.exerciseId == activeWorkout.exercises![index].exercise.id).length >= activeWorkout.exercises![index].series!,
                              );
                            },
                          ),
                        )
                      ),
                      Padding(
                        padding: const EdgeInsets.only(bottom: 20.0), 
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            SizedBox(
                              width: 150.0,
                              child: RoundedRectangleButton(
                                backgroundColor: Colors.transparent,
                                borderColor: primary,
                                borderWidth: 2,
                                onPress: () { 
                                  showMyDialog(
                                    context,
                                    'Finish Workout',
                                    'Do you want to finish ${activeWorkout.title}?',
                                    true,
                                    widget.callback
                                  );
                                 },
                                child: Row(
                                  children: const [
                                    SizedBox(width: 20),
                                    Icon(Icons.flag_outlined, color: primary),
                                    SizedBox(width: 20),
                                    Expanded(child: Text("Finish", style: TextStyle(color: primary),)),
                                  ]
                                )
                              )
                            ),
                            SizedBox(
                              width: 150.0,
                              child: RoundedRectangleButton(
                                backgroundColor: Colors.transparent,
                                borderColor: tertiary60,
                                borderWidth: 2,
                                onPress: () { 
                                  showMyDialog(
                                    context,
                                    'Stop Workout',
                                    'Do you want to stop ${activeWorkout.title}? You have ${exerciseStats.length} unsaved records.',
                                    false,
                                    widget.callback
                                  );

                                 },
                                child: Row(
                                  children: const [
                                    SizedBox(width: 20),
                                    Icon(Icons.flag_outlined, color: tertiary60),
                                    SizedBox(width: 20),
                                    Expanded(child: Text("Stop", style: TextStyle(color: tertiary60),)),
                                  ]
                                )
                              )
                            ),
                          ],
                        )
                      )
                    ],
                  ),
                ),
              )
            )
          );
        } else {
          return const CircularProgressIndicator();
        }
      }
    );
  }
}

class ExerciseTile extends StatefulWidget {
  final ExerciseInWorkout exercise;
  final Function() updateStats;
  final bool completed;
  final int seriesCount;

  const ExerciseTile({
    Key? key,
    required this.exercise,
    required this.updateStats,
    required this.completed,
    required this.seriesCount
  }) : super(key: key);

  @override
  State<ExerciseTile> createState() => _ExerciseTileState();
}

class _ExerciseTileState extends State<ExerciseTile> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () async {
        Navigator.of(context).push(
          createPageRoute(
            ActiveExercisePage(exerciseInWorkout: widget.exercise)
          )
        ).then((value) => widget.updateStats());
      },
      child: Container(
        color: surface2,
        child: Padding(
          padding: const EdgeInsets.only(left: 10.0, right: 10.0, top: 10.0, bottom: 10.0),
          child: Row(
            children: [
              Container(
                height: 50,
                width: 50,
                decoration: BoxDecoration(
                  color: tertiaryColor,
                  shape: BoxShape.rectangle,
                  image: DecorationImage(
                    image: NetworkImage(widget.exercise.exercise.thumbnailUrl),
                    fit: BoxFit.cover,
                  ),
                )
              ),
              const SizedBox(width: 15.0),
              Expanded(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.exercise.exercise.title,
                      style: const TextStyle(
                        fontSize: 15.0,
                        color: onSurface
                      ),
                    ),
                    const SizedBox(height: 5.0,),
                    Text(
                      "Series: ${widget.exercise.series}${widget.seriesCount - widget.exercise.series! > 0 ? " + ${widget.seriesCount - widget.exercise.series!}": ""}",
                      style: const TextStyle(
                        fontSize: 12.0,
                        color: onSurfaceVariant
                      ),
                    )
                  ],
                )
              ),
              Checkbox(
                checkColor: onPrimary,
                fillColor: MaterialStateProperty.resolveWith((states) => primary),
                value: widget.completed,
                onChanged: null
              )
            ],
          )
        )
      )
    );
  }
}

showMyDialog(BuildContext context, String title, String msg, bool save, Function callback) async {
  SimpleDialog dialog = SimpleDialog(
    title: Text(title),
    // titlePadding: EdgeInsets.fromLTRB(12, 12, 12, 0),
    contentPadding: const EdgeInsets.fromLTRB(0, 0, 0, 8.0),
    backgroundColor: surface3,
    titleTextStyle: const TextStyle(color: onSurface, fontSize: 20),
    children: <Widget>[
      Padding(
        padding: const EdgeInsets.all(20.0),
        child: Text(
          msg,
          textAlign: TextAlign.start,
          style: const TextStyle(fontSize: 16, color: onSurfaceVariant),
        ),
      ),
      SimpleDialogOption(
        onPressed: () { Navigator.pop(context, true); },
        child: const Text('Ok', style: TextStyle(color: primary),),
      ),
      SimpleDialogOption(
        onPressed: () { Navigator.pop(context, false); },
        child: const Text('Cancel', style: TextStyle(color: primary),),
      ),
    ],
  );

  Future dialogValue = showDialog(
    context: context,
    builder: (BuildContext context) {
      return dialog;
    }
  );

  Future<int> unloadWorkout() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? workoutJSONString = prefs.getString('active_workout');
    Workout? activeWorkout;
    if (workoutJSONString is String) {
      activeWorkout = Workout.fromJson(jsonDecode(workoutJSONString));
    } 
    await prefs.remove('exercise_stats');
    await prefs.remove('active_workout');
    if (activeWorkout != null){
      return activeWorkout.id;
    }
    return 0;
  }

  void saveStatistics(String data) {
    sendStatistics(data, context);
  }

  dialogValue.then((value) async {
    if (value == true){
      
      if (save) {
        SharedPreferences prefs = await SharedPreferences.getInstance();
        String? exerciseStatsJSONString = prefs.getString('exercise_stats');
        if (exerciseStatsJSONString != null) {
          saveStatistics(exerciseStatsJSONString);
        }
      }
      await unloadWorkout().then((value) => showRatingDialog(context, value, callback));
    }
  });
}

showRatingDialog(BuildContext context, int id, Function callback) {
  Future dialogValue = showDialog(
    context: context,
    builder: (BuildContext context) {
      double ratingValue = 3.0;
      return StatefulBuilder(
        builder: (context, setState) {
          return SimpleDialog(
                  title: const Text("Rate workout"),
                  contentPadding: const EdgeInsets.fromLTRB(0, 0, 0, 8.0),
                  backgroundColor: surface3,
                  titleTextStyle: const TextStyle(color: onSurface, fontSize: 20),
                  children: <Widget>[
                    Center(
                      child: Padding(
                        padding: const EdgeInsets.only(top: 20.0),
                        child: Text(
                          "Current rate: $ratingValue",
                          textAlign: TextAlign.start,
                          style: const TextStyle(fontSize: 16, color: onSurfaceVariant),
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Center(
                        child: RatingBar.builder(
                          initialRating: 3,
                          minRating: 1,
                          direction: Axis.horizontal,
                          allowHalfRating: true,
                          itemCount: 5,
                          itemPadding: const EdgeInsets.symmetric(horizontal: 4.0),
                          itemBuilder: (context, _) => const Icon(
                            Icons.star,
                            color: Colors.amber,
                          ),
                          onRatingUpdate: (rating) {
                            setState(() {
                              ratingValue = rating;
                            });
                          },
                        ),
                      ),
                    ),
                    SimpleDialogOption(
                      onPressed: () { Navigator.pop(context, [true, ratingValue]); },
                      child: const Text('Ok', style: TextStyle(color: primary),),
                    ),
                    SimpleDialogOption(
                      onPressed: () { Navigator.pop(context, [false, 0]); },
                      child: const Text('Cancel', style: TextStyle(color: primary),),
                    ),
                  ],
                );
        }
      );
    }
  );

  dialogValue.then((value) async {
    if (value[0] == true && id > 0) {
      Rating data = Rating(rate: value[1], workout: id);
      await sendRating(jsonEncode(data.toJSON()), context);
    }
    await callback();
  });
}