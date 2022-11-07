import 'dart:convert';
import 'package:gymshare/api/models/token.dart';
import 'package:gymshare/api/models/user.dart';
import 'package:gymshare/api/models/workout.dart';
import 'package:gymshare/components/utils/helpers.dart';
import 'package:gymshare/settings/settings.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

Future<bool> gatherToken(String username, String password) async {
  final response = await http.post(
    Uri.parse(buildUrl('api/token/')),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(
        <String, String>{'username': username, 'password': password}),
  );

  if (response.statusCode == 200) {
    final token = JWT.fromJSON(jsonDecode(response.body));
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('accessToken', token.accessToken);
    await prefs.setString('refreshToken', token.refreshToken);
    await prefs.setBool('isStaff', token.isStaff);

    return true;
  } else {
    return false;
  }
}

Future<bool> refreshToken({required String refresh}) async {
  final response = await http.post(
    Uri.parse(buildUrl('api/token/refresh/')),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(<String, String>{
      'refresh': refresh,
    }),
  );

  final prefs = await SharedPreferences.getInstance();
  try {
    await prefs.setString('accessToken', jsonDecode(response.body)['access']);
  } on Exception {
    return false;
  }

  return response.statusCode == 200;
}

Future<Profile> fetchUserData() async {
  final token = await getJWT();
  final userId = token.decodedAccessToken['user_id'];

  final response = await http.get(
    Uri.parse(buildUrl('accounts/profiles/$userId')),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ${token.accessToken}',
    },
  );

  if (response.statusCode == 200) {
    return Profile.fromJson(jsonDecode(response.body));
  } else if (response.statusCode == 401) {
    await refreshToken(refresh: token.refreshToken);
    return fetchUserData();
  } else {
    throw Exception('User data could not be fetched.');
  }
}

Future<List<Workout>> getWorkouts() async {
  final token = await getJWT();
  final response = await http.get(
    Uri.parse(buildUrl('workouts/plans/')),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ${token.accessToken}',
    },
  );

  if (response.statusCode == 200) {
    final results = jsonDecode(response.body)['results'];
    return List.from(results.map((w) => Workout.fromJson(w)));
  } else if (response.statusCode == 401) {
    await refreshToken(refresh: token.refreshToken);
    return getWorkouts();
  } else {
    throw Exception('Workouts could not be fetched.');
  }
}
