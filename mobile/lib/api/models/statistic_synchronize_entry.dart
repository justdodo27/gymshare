class StatisticEntry {
  final int exerciseId;
  final int? time;
  final int? repeats;
  final double? weight;
  final int series;
  final DateTime date;

  StatisticEntry({
    required this.exerciseId,
    this.time,
    this.repeats,
    this.weight,
    required this.series,
    required this.date
  });

  factory StatisticEntry.fromJson(Map<String, dynamic> json) {
    return StatisticEntry(
      exerciseId: json['exercise_id'],
      time: json['time'],
      repeats: json['repeats'],
      weight: json['weight'],
      series: json['series'],
      date: DateTime.parse(json['date'])
    );
  }

  Map<String, dynamic> toJSON() => {
    'exercise_id': exerciseId,
    'time': time,
    'repeats': repeats,
    'weight': weight,
    'series': series,
    'date': date.toIso8601String(),
  };
}