class Entry {
  final DateTime dateTime;
  final num? time;
  final num? weight;
  final num? repeats;

  Entry({
    required this.dateTime,
    this.time,
    this.weight,
    this.repeats,
  });

  factory Entry.fromJson(Map<String, dynamic> json) {
    return Entry(
      dateTime: DateTime.parse(json['date']),
      time: json['time'],
      weight: json['weight'],
      repeats: json['repeats'],
    );
  }
}

class StatisticExercise {
  final int id;
  final List<Entry> entries;
  final String title;
  final String? description;
  final num difficulty;
  final num caloriesBurnRate;
  final String? thumbnailUrl;
  final String? videoUrl;
  final String exerciseType;

  StatisticExercise(
      {required this.id,
      required this.entries,
      required this.title,
      this.description,
      required this.difficulty,
      required this.caloriesBurnRate,
      this.thumbnailUrl,
      this.videoUrl,
      required this.exerciseType});

  factory StatisticExercise.fromJson(Map<String, dynamic> json) {
    return StatisticExercise(
      id: json['id'],
      entries: List<Entry>.from(json['entries'].map((e) => Entry.fromJson(e))),
      title: json['title'],
      description: json['description'],
      difficulty: json['difficulty'],
      caloriesBurnRate: json['calories_burn_rate'],
      exerciseType: json['exercise_type'],
      thumbnailUrl: json['thumbnail'],
      videoUrl: json['videoUrl'],
    );
  }
}
