import 'package:gymshare/api/models/exercise.dart';

class StatisticExercise {
  final int id;
  final DateTime dateTime;
  final Exercise exercise;
  final int userId;
  final num? repeats;
  final num? time;
  final num? weight;

  StatisticExercise({
    required this.id,
    required this.dateTime,
    required this.exercise,
    required this.userId,
    this.repeats,
    this.time,
    this.weight,
  });

  factory StatisticExercise.fromJson(Map<String, dynamic> json) {
    return StatisticExercise(
      id: json['id'],
      dateTime: DateTime.parse(json['date']),
      exercise: Exercise.fromJson(json['exercise']),
      userId: json['user'],
      repeats: json['repeats'],
      time: json['time'],
      weight: json['weight'],
    );
  }
}
