import 'package:gymshare/api/models/exercise_in_workout.dart';

class Author {
  final int id;
  final String username;
  final String profilePictureUrl;

  Author({
    required this.id,
    required this.username,
    required this.profilePictureUrl,
  });

  factory Author.fromJson(Map<String, dynamic> json) {
    return Author(
      id: json['id'],
      username: json['username'],
      profilePictureUrl: json['profile_picture'],
    );
  }
}

class Workout {
  final int id;
  final List<ExerciseInWorkout>? exercises;
  final Author author;
  final bool isFavorite;
  final double avgRating;
  final double avgTime;
  final double difficulty;
  final double sumOfCb;
  final String title;
  final String? description;
  final String visibility;
  final int cycles;
  final String? thumbnailUrl;

  Workout({
    required this.id,
    required this.exercises,
    required this.author,
    required this.isFavorite,
    required this.avgRating,
    required this.avgTime,
    required this.difficulty,
    required this.sumOfCb,
    required this.title,
    this.description,
    required this.visibility,
    required this.cycles,
    this.thumbnailUrl,
  });

  factory Workout.fromJson(Map<String, dynamic> json) {
    return Workout(
      id: json['id'],
      exercises: List<ExerciseInWorkout>.from(
          json['exercises'].map((e) => ExerciseInWorkout.fromJson(e))),
      author: Author.fromJson(json['author']),
      isFavorite: json['is_favorite'],
      avgRating: json['avg_rating'] ?? 0,
      avgTime: json['avg_time'],
      difficulty: json['difficulty'],
      sumOfCb: json['sum_of_cb'],
      title: json['title'],
      description: json['description'],
      visibility: json['visibility'],
      cycles: json['cycles'],
      thumbnailUrl: json['thumbnail'],
    );
  }
}
