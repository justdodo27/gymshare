import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:gymshare/settings/colors.dart';
import 'package:gymshare/api/models/workout.dart';
import 'package:gymshare/api/models/api_response.dart';
import 'package:gymshare/components/utils/requests.dart';
import 'package:shared_preferences/shared_preferences.dart';

class TrainingPage extends StatefulWidget {
  final Function callback;
  const TrainingPage({super.key, required this.callback});

  @override
  State<TrainingPage> createState() => _TrainingPageState();
}

class _TrainingPageState extends State<TrainingPage> {
  Icon customIcon = const Icon(Icons.search);
  Widget customSearchBar = const Text('Test');
  late TextEditingController _controller;
  final ScrollController scrollController = ScrollController();
  ApiResponse _apiResponse = ApiResponse(count: 0, results: []);
  List<Workout> workouts = [];

  void fetchWorkouts({bool next = false, String query = ''}) async {
    if (next && _apiResponse.next != null || !next) {
      _apiResponse =
          await searchWorkouts(context, query, mounted, next ? _apiResponse.next : null);
      workouts.clear();
      setState(() => {
      workouts.addAll(List<Workout>.from(
          _apiResponse.results.map((w) => Workout.fromJson(w))))
      });
    }
  }

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
    _controller.addListener(() {
      if (_controller.text.isEmpty){
        setState(() {
          workouts.clear();
        });
      }
     });
  }

  @override
  void dispose() {
    _controller.dispose();
    scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(8.0), 
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start, 
              children: [
                Container(
                  margin: const EdgeInsets.only(bottom: 10.0),
                  child: const Text(
                    'Workout not started',
                    style: TextStyle(fontSize: 30, color: primaryTextColor),
                  ),
                ),
                Container(
                  margin: const EdgeInsets.only(bottom: 10.0),
                  child: const Text(
                    'Pick your workout',
                    style: TextStyle(fontSize: 24, color: primaryTextColor),
                  ),
                ),
                Container(
                  margin: const EdgeInsets.only(bottom: 1.0),
                  child: TextField(
                    controller: _controller,
                    onChanged: (value) {
                      if (value.isNotEmpty){
                        fetchWorkouts(query: value);
                      } else {
                        setState(() {
                          workouts.clear();
                        });
                      }
                    },
                    decoration: InputDecoration(
                      border: const OutlineInputBorder(),
                      labelText: 'Workout',
                      suffixIcon: IconButton(
                        onPressed: _controller.clear,
                        icon: const Icon(Icons.clear),
                      )
                    ),
                    style: const TextStyle(
                        color: primaryTextColor
                      ),
                  ),
                ),
                Expanded(
                  child: SizedBox(
                    height: 100.0,
                    width: double.infinity,
                    child: ListView.builder(
                      controller: scrollController,
                      itemCount: workouts.length,
                      itemBuilder: (context, index){
                        return SearchTile(workout: workouts[index], callback: widget.callback);
                      },
                    ),
                  )
                )
              ]
            ),
          ),
        ),
      ),
    );
  }
}


class SearchTile extends StatefulWidget {
  final Workout workout;
  final Function callback;

  const SearchTile({
    Key? key,
    required this.workout,
    required this.callback,
  }) : super(key: key);

  @override
  State<SearchTile> createState() => _SearchTileState();
}

class _SearchTileState extends State<SearchTile> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
          onTap: () {
            showMyDialog(context, widget.workout, widget.callback);
          },
          child: Container(
            color: surface2,
            child: Padding(
              padding: const EdgeInsets.only(left: 8.0, right: 8.0, top: 10, bottom: 10),
              child: Text(
                widget.workout.title,
                style: const TextStyle(
                  fontSize: 15.0,
                  color: onSurface
              ),
          )
        )
      )
    );
  }
}

showMyDialog(BuildContext context, Workout workout, Function callback) {
  SimpleDialog dialog = SimpleDialog(
    title: Text('You are about to start ${workout.title}'),
    backgroundColor: surface3,
    titleTextStyle: const TextStyle(color: onSurface, fontSize: 20),
    children: <Widget>[
      SimpleDialogOption(
        onPressed: () { Navigator.pop(context, true); },
        child: const Text('Start', style: TextStyle(color: primary),),
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

  void saveWorkout(Workout workout) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    Map<String, dynamic> workoutJSON = workout.toJson(); 
    String workoutJSONString = jsonEncode(workoutJSON);
    await prefs.setString('active_workout', workoutJSONString);
  }

  dialogValue.then((value) {
    if (value == true){
      saveWorkout(workout);
      callback();
    }
  });
}