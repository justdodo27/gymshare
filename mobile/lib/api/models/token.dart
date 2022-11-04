import 'package:jwt_decoder/jwt_decoder.dart';

class JWT {
  String accessToken;
  String refreshToken;
  final bool isStaff;

  JWT({
    required this.accessToken,
    required this.refreshToken,
    required this.isStaff,
  });

  factory JWT.fromJSON(Map<String, dynamic> json) {
    return JWT(
      accessToken: json['access'],
      refreshToken: json['refresh'],
      isStaff: json['is_staff'],
    );
  }

  Map<String, dynamic> get decodedAccessToken {
    return JwtDecoder.decode(accessToken);
  }

  bool get isExpired => JwtDecoder.isExpired(accessToken);
}
