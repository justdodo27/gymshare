import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:flutter_time_picker_spinner/flutter_time_picker_spinner.dart';
import 'package:gymshare/api/models/exercise_in_workout.dart';
import 'package:gymshare/api/models/statistic_synchronize_entry.dart';
import 'package:gymshare/components/widgets/rounded_rectangle_button.dart';
import 'package:gymshare/components/widgets/seamless_pattern.dart';
import 'package:gymshare/settings/colors.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ActiveExercisePage extends StatefulWidget{
  final ExerciseInWorkout exerciseInWorkout;
  const ActiveExercisePage({
    super.key,
    required this.exerciseInWorkout
  });

  @override
  State<ActiveExercisePage> createState() => _ActiveExercisePageState();
}

class _ActiveExercisePageState extends State<ActiveExercisePage> {
  List<StatisticEntry> exerciseStats = [];
  late TextEditingController _repeatsController;
  late TextEditingController _weightController;
  final ScrollController scrollController = ScrollController();
  int time = 0;

  Future loadStats() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? exerciseStatsJSONString = prefs.getString('exercise_stats');
    if (exerciseStatsJSONString is String) {
      setState(() {
        exerciseStats.addAll(
          List<StatisticEntry>.from(
            jsonDecode(exerciseStatsJSONString).map((w) => StatisticEntry.fromJson(w))
          )
        );
      });
    }
  }

  void addRecord() async {
    switch (widget.exerciseInWorkout.exercise.exerciseType) {
      case "With a weight":
        if(_repeatsController.text.isNotEmpty && _weightController.text.isNotEmpty) {
          int repeats = int.parse(_repeatsController.text);
          double weight = double.parse(_weightController.text);
          if (repeats > 0 && weight > 0.0) {
            exerciseStats.add(StatisticEntry(
              exerciseId: widget.exerciseInWorkout.exercise.id, 
              series: 1, 
              repeats: repeats,
              weight: weight,
              date: DateTime.now()
            ));
          }
        } else {
          // alert error
        }

        break;
      case "With own body weight":
        if(_repeatsController.text.isNotEmpty) {
          int repeats = int.parse(_repeatsController.text);
          if (repeats > 0) {
            exerciseStats.add(StatisticEntry(
              exerciseId: widget.exerciseInWorkout.exercise.id, 
              series: 1, 
              repeats: repeats,
              date: DateTime.now()
            ));
          }
        } else {
          // allert error
        }
        break;
      case "With time":
        if (time > 0) {
          exerciseStats.add(StatisticEntry(
            exerciseId: widget.exerciseInWorkout.exercise.id, 
            series: 1, 
            time: time,
            date: DateTime.now()
          ));
          setState(() {
            time = 0;
          });
        }
        break;
      default:
    }

    SharedPreferences prefs = await SharedPreferences.getInstance();
    var dataToSave =  jsonEncode(exerciseStats.map((e) => e.toJSON()).toList());
    prefs.setString('exercise_stats', dataToSave);
    _repeatsController.clear();
    _weightController.clear();
    setState(() {
      exerciseStats = [];
    });
    loadStats();
  }

  void updateTime(int newTime) {
    setState(() {
      time = newTime;
    });
  }

  @override
  void initState() {
    super.initState();
    loadStats();
    _repeatsController = TextEditingController();
    _weightController = TextEditingController();
  }

  @override
  void dispose() {
    _repeatsController.dispose();
    _weightController.dispose();
    scrollController.dispose();
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
              onPressed: () => {
                Navigator.of(context).pop()
              },
            ),
            title: Text(
              widget.exerciseInWorkout.exercise.title,
              style: const TextStyle(color: primaryTextColor, fontSize: 20),
            )
          ),
          backgroundColor: Colors.transparent,
          body: Column(
            mainAxisSize: MainAxisSize.max,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              SizedBox(
                height: 150.0,
                child: ListView(
                  children: [
                    Container(  
                      constraints: const BoxConstraints(minHeight: 150.0),
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: surface2.withOpacity(0.5)
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0), 
                        child: Text(
                          widget.exerciseInWorkout.exercise.description!,
                          textAlign: TextAlign.justify,
                          style: const TextStyle(
                            color: primaryTextColor,
                            fontSize: 15.0,
                          )
                        )
                      )
                    )
                  ]
                )
              ),
              const Padding(
                padding: EdgeInsets.only(top: 30.0, bottom: 10.0),
                child: Text(
                  "Your progress",
                  style: TextStyle(
                    color: primaryTextColor,
                    fontSize: 18.0
                  )
                )
              ),
              (widget.exerciseInWorkout.exercise.exerciseType == "With a weight" || widget.exerciseInWorkout.exercise.exerciseType == "With own body weight") ? Padding(
                padding: const EdgeInsets.all(8.0), 
                child: TextField(
                  style: const TextStyle(color: primaryTextColor),
                  controller: _repeatsController,
                  decoration: const InputDecoration(
                    labelText: "Enter repeats number",
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.number,
                  inputFormatters: <TextInputFormatter>[
                    FilteringTextInputFormatter.digitsOnly
                  ],
                )
              ) : const SizedBox(),
              widget.exerciseInWorkout.exercise.exerciseType == "With a weight" ? Padding(
                padding: const EdgeInsets.all(8.0), 
                child: TextField(
                  style: const TextStyle(color: primaryTextColor),
                  controller: _weightController,
                  decoration: const InputDecoration(
                    labelText: "Enter weight",
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.number,
                  inputFormatters: <TextInputFormatter>[
                    FilteringTextInputFormatter.allow(RegExp(r'^(\d+)?\.?\d{0,2}'))
                  ],
                )
              ) : const SizedBox(),
              widget.exerciseInWorkout.exercise.exerciseType == "With time" ? TimerWidget(timeCallback: updateTime, initialValue: time)
              : const SizedBox(),
              SizedBox(
                width: 200.0,
                child: RoundedRectangleButton(
                  padding: const EdgeInsets.only(top: 10.0),
                  backgroundColor: Colors.transparent,
                  borderColor: primary,
                  borderWidth: 2,
                  onPress: () { 
                    addRecord();
                  },
                  child: Row(
                    children: const [
                      SizedBox(width: 20),
                      Icon(Icons.add, color: primary),
                      SizedBox(width: 20),
                      Expanded(child: Text("Add Record", style: TextStyle(color: primary),)),
                    ]
                  )
                )
              ),
              Padding(
                padding: const EdgeInsets.only(top: 30.0, bottom: 10.0),
                child: Text(
                  "Your records (${exerciseStats.where((element) => element.exerciseId == widget.exerciseInWorkout.exercise.id).length})",
                  style: const TextStyle(
                    color: primaryTextColor,
                    fontSize: 18.0
                  )
                )
              ),
              Expanded(
                child: ListView.builder(
                  controller: scrollController,
                  itemCount: exerciseStats.where((element) => element.exerciseId == widget.exerciseInWorkout.exercise.id).length,
                  itemBuilder: (context, index){
                    return RecordTile(recordData: exerciseStats.where((element) => element.exerciseId == widget.exerciseInWorkout.exercise.id).toList()[index], idx: index);
                  },
                ),
              )
            ]
          )
        )
      )
    );
  }
}

class TimerWidget extends StatefulWidget {
  final void Function(int) timeCallback;
  final int initialValue;
  const TimerWidget({
    super.key,
    required this.timeCallback,
    required this.initialValue
  });

  @override
  State<TimerWidget> createState() => _TimerWidgetState();
}

class _TimerWidgetState extends State<TimerWidget> with SingleTickerProviderStateMixin {
  Duration _elapsed = Duration.zero;
  late int timeToCount;
  late Duration _requested;
  late final Ticker _ticker;

  @override
  void initState() {
    super.initState();
    timeToCount = widget.initialValue;
    _ticker = createTicker((elapsed) {
      if (elapsed.inSeconds >= _requested.inSeconds){
        _ticker.stop();
        setState(() {
          _elapsed = -Duration(seconds: _requested.inSeconds);
        });
      } else {
        setState(() {
          _elapsed = -elapsed;
        });
      }
    });
    _requested = Duration(seconds: timeToCount);
  }

  @override
  void dispose() {
    _ticker.dispose();
    super.dispose();
  }

  Duration _getActualFromTickRawDuration(Duration rawDuration) => rawDuration + _elapsed;
  Duration get requested => _getActualFromTickRawDuration(_elapsed);

  void pause() {
    _ticker.stop();
    _requested = _requested + _elapsed;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TimePickerSpinner(
          time: DateTime(2022, 1, 1, 0, 0, widget.initialValue),
          isForce2Digits: true,
          isShowSeconds: true,
          normalTextStyle: const TextStyle(
            fontSize: 24,
            color: onSurfaceVariant
          ),
          highlightedTextStyle: const TextStyle(
            fontSize: 28,
            color: onSurface
          ),
          onTimeChange: (time) {
            _ticker.stop();
            setState(() {
              timeToCount = time.hour * 60 * 60 + time.minute * 60 + time.second;
              widget.timeCallback(timeToCount);
              _requested = Duration(seconds: timeToCount);
              _elapsed = Duration.zero;
            });
          },
        ),
        Text(
          "${_requested + _elapsed}".substring(0, 10),
          style: const TextStyle(
            color: primaryTextColor,
            fontSize: 16.0
          )
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            IconButton(
              icon: const Icon(Icons.play_arrow),
              tooltip: 'Start timer',
              onPressed: () {
                _ticker.start();
              },
            ),
            IconButton(
              icon: const Icon(Icons.pause),
              tooltip: 'Pause timer',
              onPressed: () {
                pause();
              },
            ),
            IconButton(
              icon: const Icon(Icons.restart_alt),
              tooltip: 'Reset timer',
              onPressed: () {
                _ticker.stop();
                setState(() {
                  _requested = Duration(seconds: timeToCount);
                  _elapsed   = Duration.zero;
                });
              },
            ),
          ],
        )
      ]
    );
  }
}

class RecordTile extends StatefulWidget {
  final StatisticEntry recordData;
  final int idx;
  const RecordTile({super.key, required this.recordData, required this.idx});

  @override
  State<RecordTile> createState() => _RecordTileState();
}

class _RecordTileState extends State<RecordTile> {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 60,
      width: double.infinity,
      color: widget.idx % 2 == 0 ? surface2.withOpacity(0.5) : surface3.withOpacity(0.5),
      child: Padding(
        padding: const EdgeInsets.only(left: 10.0, right: 10.0, top: 10.0, bottom: 10.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                (widget.recordData.repeats != null) ? Text(
                  "Repeats: ${widget.recordData.repeats}",
                  style: const TextStyle(color: onSurface),
                ) : const SizedBox(),
                const SizedBox(width: 20),
                (widget.recordData.weight != null) ? Text(
                  "Weight: ${widget.recordData.weight}",
                  style: const TextStyle(color: onSurface),
                ) : const SizedBox(),
                (widget.recordData.time != null) ? Text(
                  "Time: ${widget.recordData.time}",
                  style: const TextStyle(color: onSurface),
                ) : const SizedBox(),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  widget.recordData.date.toString().split('.')[0],
                  style: const TextStyle(color: onSurfaceVariant),
                ),
              ],
            )
          ],
        )
      )
    );
  }
}