import 'package:gymshare/api/models/exercise_in_workout.dart';

class Author {
  final int id;
  final String username;
  final String? profilePictureUrl;

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

  Map<String, dynamic> toJSON() => {
    'id': id,
    'username': username,
    'profile_picutre': profilePictureUrl
  };
}

class Workout {
  final int id;
  final List<ExerciseInWorkout>? exercises;
  final Author author;
  final bool isFavorite;
  final num avgRating;
  final num ratingsCount;
  final num? avgTime;
  final num difficulty;
  final num sumOfCb;
  final String title;
  final String? description;
  final String visibility;
  final num cycles;
  final String? thumbnailUrl;

  Workout({
    required this.id,
    required this.exercises,
    required this.author,
    required this.isFavorite,
    required this.avgRating,
    required this.ratingsCount,
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
      ratingsCount: json['ratings_count'],
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

  Map<String, dynamic> toJson() => {
    'id': id,
    'exercises': exercises?.map((element) => element.toJSON()).toList(),
    'author': author.toJSON(),
    'is_favorite': isFavorite,
    'avg_rating': avgRating,
    'ratings_count': ratingsCount,
    'avg_time': avgTime,
    'difficulty': difficulty,
    'sum_of_cb': sumOfCb,
    'title': title,
    'description': description,
    'visibility': visibility,
    'cycles': cycles,
    'thumbnail': thumbnailUrl
  };
}
