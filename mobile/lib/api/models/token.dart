
class JWT
{
  String accessToken;
  String refreshToken;
  final bool isStaff;

  JWT({required this.accessToken, required this.refreshToken, required this.isStaff});

  factory JWT.fromJSON(Map<String, dynamic> json)
  {
    return JWT(accessToken: json['access'], refreshToken: json['refresh'], isStaff: json['is_staff']);
  }
}