import 'package:gymshare/api/models/exercise.dart';

class ExerciseInWorkout {
  final int id;
  final Exercise exercise;
  final num order;
  final num? repeats;
  final num? time;
  final num? series;

  ExerciseInWorkout({
    required this.id,
    required this.exercise,
    required this.order,
    this.repeats,
    this.time,
    this.series,
  });

  factory ExerciseInWorkout.fromJson(Map<String, dynamic> json) {
    return ExerciseInWorkout(
      id: json['id'],
      exercise: Exercise.fromJson(json['exercise']),
      order: json['order'],
      repeats: json['repeats'],
      time: json['time'],
      series: json['series'],
    );
  }

  Map<String, dynamic> toJSON() => {
    'id': id,
    'exercise': exercise.toJSON(),
    'order': order,
    'repeats': repeats,
    'time': time,
    'series': series,
  };
}
