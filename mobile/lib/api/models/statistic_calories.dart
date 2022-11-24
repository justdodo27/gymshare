class StatisticCalories {
  final int id;
  final String date;
  final num calories;
  final int userId;

  StatisticCalories({
    required this.id,
    required this.date,
    required this.calories,
    required this.userId,
  });

  factory StatisticCalories.fromJson(Map<String, dynamic> json) {
    return StatisticCalories(
      id: json['id'],
      date: json['date'],
      calories: json['calories'],
      userId: json['user'],
    );
  }
}
