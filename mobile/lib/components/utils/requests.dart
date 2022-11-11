import 'dart:convert';
import 'package:flutter/cupertino.dart';
import 'package:gymshare/api/models/exercise.dart';
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
  final accessToken = jsonDecode(response.body)['access'];

  if (accessToken != null) {
    await prefs.setString('accessToken', accessToken);
    return true;
  }

  return false;
}

Future<Profile> fetchUserData(BuildContext context,
    [bool mounted = true]) async {
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
    if (await refreshToken(refresh: token.refreshToken)) {
      if (mounted) return fetchUserData(context, mounted);
      throw Exception('Widget not mounted.');
    } else {
      if (mounted) logOut(context);
      throw Exception('Authorization failed.');
    }
  } else {
    throw Exception('User data could not be fetched.');
  }
}

Future<List<Workout>> getWorkouts(BuildContext context,
    [bool mounted = true]) async {
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
    if (await refreshToken(refresh: token.refreshToken)) {
      if (mounted) return getWorkouts(context, mounted);
      throw Exception('Widget not mounted.');
    } else {
      if (mounted) logOut(context);
      throw Exception('Authorization failed.');
    }
  } else {
    throw Exception('Workouts could not be fetched.');
  }
}

Future<List<Exercise>> getExercises(BuildContext context,
    [bool mounted = true]) async {
  final token = await getJWT();
  final response = await http.get(
    Uri.parse(buildUrl('workouts/exercises/')),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ${token.accessToken}',
    },
  );

  if (response.statusCode == 200) {
    final results = jsonDecode(response.body);
    return List.from(results.map((e) => Exercise.fromJson(e)));
  } else if (response.statusCode == 401) {
    if (await refreshToken(refresh: token.refreshToken)) {
      if (mounted) return getExercises(context, mounted);
      throw Exception('Widget not mounted.');
    } else {
      if (mounted) logOut(context);
      throw Exception('Authorization failed.');
    }
  } else {
    throw Exception('Exercises could not be fetched.');
  }
}
