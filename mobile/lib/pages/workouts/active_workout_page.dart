import 'package:flutter/material.dart';
import 'package:gymshare/api/models/workout.dart';


class ActivityPage extends StatefulWidget {
  final Workout workout;
  const ActivityPage({super.key, required this.workout});

  @override
  State<ActivityPage> createState() => _ActivityPageState();
}

class _ActivityPageState extends State<ActivityPage> {
  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

   @override
  Widget build(BuildContext context) {
    return Text(widget.workout.title);
  }
}