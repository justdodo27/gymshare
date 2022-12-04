import 'dart:convert';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:gymshare/api/models/exercise.dart';
import 'package:gymshare/api/models/exercise_in_workout.dart';
import 'package:gymshare/components/widgets/rounded_rectangle_button.dart';
import 'package:gymshare/settings/colors.dart';
import 'package:gymshare/api/models/workout.dart';
import 'package:shared_preferences/shared_preferences.dart';


class ActivityPage extends StatefulWidget {
  const ActivityPage({super.key});

  @override
  State<ActivityPage> createState() => _ActivityPageState();
}

class _ActivityPageState extends State<ActivityPage> {
  late Workout activeWorkout;
  final ScrollController scrollController = ScrollController();

  Future<bool> loadWorkout() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? workoutJSONString = prefs.getString('active_workout');
    if (workoutJSONString is String) {
      setState(() {
        activeWorkout = Workout.fromJson(jsonDecode(workoutJSONString));
      });
      return true;
    }
    return false;
  }

  late final workoutLoaded;


  @override
  void initState() {
    super.initState();
    workoutLoaded = loadWorkout();
  }

  @override
  void dispose() {
    scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: workoutLoaded,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.done) {
          return Scaffold(
            backgroundColor: Colors.transparent,
            body: SafeArea(
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
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
                          "Completed 0/0",
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
                              return ExerciseTile(exercise: activeWorkout.exercises![index]);
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
                                onPress: () {  },
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
                                onPress: () {  },
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

  const ExerciseTile({
    Key? key,
    required this.exercise,
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
      onTap: () {
      
      },
      child: Container(
        color: surface,
        child: Padding(
          padding: const EdgeInsets.only(left: 0.0, right: 0.0, top: 10.0, bottom: 10.0),
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
                      "Series: ${widget.exercise.series}",
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
                value: true,
                onChanged: null
              )
            ],
          )
        )
      )
    );
  }
}