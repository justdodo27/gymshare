class Rating {
  final double rate;
  final int workout;

  Rating({
    required this.rate,
    required this.workout
  });

  factory Rating.fromJson(Map<String, dynamic> json) {
    return Rating(
      rate: json['rate'],
      workout: json['workout']
    );
  }

  Map<String, dynamic> toJSON() => {
    'rate': rate,
    'workout': workout
  };
}