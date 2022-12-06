

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:flutter_time_picker_spinner/flutter_time_picker_spinner.dart';
import 'package:gymshare/api/models/exercise_in_workout.dart';
import 'package:gymshare/components/widgets/rounded_rectangle_button.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/components/widgets/seamless_pattern.dart';
import 'package:gymshare/settings/colors.dart';

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
  
  @override
  void initState() {
    super.initState();
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
          body: ScrollConfig(
            child: SingleChildScrollView(
              scrollDirection: Axis.vertical,
              child: Column(
                mainAxisSize: MainAxisSize.max,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  SizedBox(
                    height: 150.0,
                    child: ListView(
                      children: [
                        Container(  
                          constraints: BoxConstraints(minHeight: 150.0),
                          width: double.infinity,
                          decoration: const BoxDecoration(
                            color: surface2
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
                    padding: EdgeInsets.only(top: 10.0, bottom: 10.0),
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
                  widget.exerciseInWorkout.exercise.exerciseType == "With time" ? const TimerWidget()
                  : const SizedBox(),
                  SizedBox(
                    width: 200.0,
                    child: RoundedRectangleButton(
                      padding: const EdgeInsets.only(top: 10.0),
                      backgroundColor: Colors.transparent,
                      borderColor: primary,
                      borderWidth: 2,
                      onPress: () {  },
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
                  const Padding(
                    padding: EdgeInsets.only(top: 10.0, bottom: 10.0),
                    child:Text(
                      "Your records",
                      style: TextStyle(
                        color: primaryTextColor,
                        fontSize: 18.0
                      )
                    )
                  ),
                ]
              )
            )
          )
        )
      )
    );
  }
}

class TimerWidget extends StatefulWidget {
  const TimerWidget({
    super.key
  });

  @override
  State<TimerWidget> createState() => _TimerWidgetState();
}

class _TimerWidgetState extends State<TimerWidget> with SingleTickerProviderStateMixin {
  Duration _elapsed = Duration.zero;
  int timeToCount = 0;
  late Duration _requested;
  late final Ticker _ticker;

  @override
  void initState() {
    super.initState();
    _ticker = createTicker((elapsed) {
      setState(() {
        _elapsed = -elapsed;
      });
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
          time: DateTime(2022, 1, 1, 0, 0, 0),
          isForce2Digits: true,
          isShowSeconds: true,
          normalTextStyle: TextStyle(
            fontSize: 24,
            color: onSurfaceVariant
          ),
          highlightedTextStyle: TextStyle(
            fontSize: 28,
            color: onSurface
          ),
          onTimeChange: (time) {
            _ticker.stop();
            setState(() {
              timeToCount = time.hour * 60 * 60 + time.minute * 60 + time.second;
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
                print(_elapsed);
                _ticker.start();
              },
            ),
            IconButton(
              icon: const Icon(Icons.pause), //Icons.pause
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