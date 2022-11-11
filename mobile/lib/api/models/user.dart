class User {
  final int id;
  final String username;
  final String firstName;
  final String lastName;
  final String email;
  final DateTime dateJoined;

  User({
    required this.id,
    required this.username,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.dateJoined,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
        id: json['id'],
        username: json['username'],
        firstName: json['first_name'],
        lastName: json['last_name'],
        email: json['email'],
        dateJoined: DateTime.parse(json['date_joined']),
      );
}

class Profile {
  final int id;
  final User user;
  final int? height;
  final double? weight;
  final int likes;
  final String? profilePictureUrl;

  Profile({
    required this.id,
    required this.user,
    required this.likes,
    this.height,
    this.weight,
    this.profilePictureUrl,
  });

  factory Profile.fromJson(Map<String, dynamic> json) => Profile(
        id: json['id'],
        user: User.fromJson(json['user']),
        likes: json['likes'],
        height: json['height'],
        weight: json['weight'],
        profilePictureUrl: json['profile_picture'],
      );
}
