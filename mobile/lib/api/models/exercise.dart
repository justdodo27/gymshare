class Exercise {
  final int id;
  final String thumbnailUrl;
  final String videoUrl;
  final String title;
  final String? description;
  final num difficulty;
  final num caloriesBurnRate;
  final String exerciseType;

  Exercise({
    required this.id,
    required this.thumbnailUrl,
    required this.videoUrl,
    required this.title,
    this.description,
    required this.difficulty,
    required this.caloriesBurnRate,
    required this.exerciseType,
  });

  factory Exercise.fromJson(Map<String, dynamic> json) {
    return Exercise(
      id: json['id'],
      thumbnailUrl: json['thumbnail'],
      videoUrl: json['video'],
      title: json['title'],
      description: json['description'],
      difficulty: json['difficulty'],
      caloriesBurnRate: json['calories_burn_rate'],
      exerciseType: json['exercise_type'],
    );
  }

  Map<String, dynamic> toJSON() => {
    'id': id,
    'thumbnail': thumbnailUrl,
    'video': videoUrl,
    'title': title,
    'description': description,
    'difficulty': difficulty,
    'calories_burn_rate': caloriesBurnRate,
    'exercise_type': exerciseType
  };
}
