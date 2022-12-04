import 'dart:convert';
import 'package:flutter/cupertino.dart';
import 'package:gymshare/api/models/api_response.dart';
import 'package:gymshare/api/models/statistic_calories.dart';
import 'package:gymshare/api/models/statistic_exercise.dart';
import 'package:gymshare/api/models/token.dart';
import 'package:gymshare/api/models/user.dart';
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

Future<ApiResponse> getWorkouts(BuildContext context,
    [bool mounted = true, String? next]) async {
  final token = await getJWT();
  final response = await http.get(
    Uri.parse(next ?? buildUrl('workouts/plans/')),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ${token.accessToken}',
    },
  );

  if (response.statusCode == 200) {
    return ApiResponse.fromJson(jsonDecode(response.body));
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

Future<ApiResponse> searchWorkouts(BuildContext context, String query,
    [bool mounted = true, String? next]) async {
  final token = await getJWT();
  final response = await http.get(
    Uri.parse(next ?? buildUrl('workouts/plans/?search=$query')),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ${token.accessToken}',
    },
  );

  if (response.statusCode == 200) {
    return ApiResponse.fromJson(jsonDecode(response.body));
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

Future<ApiResponse> searchCreated(BuildContext context, String query,
    [bool mounted = true, String? next]) async {
  final token = await getJWT();
  final response = await http.get(
    Uri.parse(next ??
        buildUrl(
            'workouts/plans/?search=$query&author__id=${token.decodedAccessToken['user_id']}')),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ${token.accessToken}',
    },
  );

  if (response.statusCode == 200) {
    return ApiResponse.fromJson(jsonDecode(response.body));
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

Future<ApiResponse> getExercises(BuildContext context,
    [bool mounted = true, String? next]) async {
  final token = await getJWT();
  final response = await http.get(
    Uri.parse(next ?? buildUrl('workouts/exercises/')),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ${token.accessToken}',
    },
  );

  if (response.statusCode == 200) {
    return ApiResponse.fromJson(jsonDecode(response.body));
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

Future<ApiResponse> searchExercises(BuildContext context, String query,
    [bool mounted = true, String? next]) async {
  final token = await getJWT();
  final response = await http.get(
    Uri.parse(next ?? buildUrl('workouts/exercises/?search=$query')),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ${token.accessToken}',
    },
  );
  if (response.statusCode == 200) {
    return ApiResponse.fromJson(jsonDecode(response.body));
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

Future<ApiResponse> getFavoriteWorkouts(BuildContext context,
    [bool mounted = true, String? next]) async {
  final token = await getJWT();
  final response = await http.get(
    Uri.parse(next ?? buildUrl('workouts/favorites/')),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ${token.accessToken}',
    },
  );

  if (response.statusCode == 200) {
    return ApiResponse.fromJson(jsonDecode(response.body));
  } else if (response.statusCode == 401) {
    if (await refreshToken(refresh: token.refreshToken)) {
      if (mounted) return getFavoriteWorkouts(context, mounted);
      throw Exception('Widget not mounted.');
    } else {
      if (mounted) logOut(context);
      throw Exception('Authorization failed.');
    }
  } else {
    throw Exception('Favorite workouts could not be fetched.');
  }
}

Future<ApiResponse> getCreatedWorkouts(BuildContext context,
    [bool mounted = true, String? next]) async {
  final token = await getJWT();
  final response = await http.get(
    Uri.parse(next ??
        buildUrl(
            'workouts/plans/?search&author__id=${token.decodedAccessToken['user_id']}')),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ${token.accessToken}',
    },
  );

  if (response.statusCode == 200) {
    return ApiResponse.fromJson(jsonDecode(response.body));
  } else if (response.statusCode == 401) {
    if (await refreshToken(refresh: token.refreshToken)) {
      if (mounted) return getCreatedWorkouts(context, mounted);
      throw Exception('Widget not mounted.');
    } else {
      if (mounted) logOut(context);
      throw Exception('Authorization failed.');
    }
  } else {
    throw Exception('Created workouts could not be fetched.');
  }
}

Future<bool> addToFavorites(BuildContext context,
    {required int workoutId, bool mounted = true}) async {
  final token = await getJWT();
  final response = await http.post(
    Uri.parse(buildUrl('workouts/favorites/')),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ${token.accessToken}',
    },
    body: jsonEncode(<String, int>{
      'workout': workoutId,
    }),
  );

  if (response.statusCode == 201) {
    return true;
  } else if (response.statusCode == 401) {
    if (await refreshToken(refresh: token.refreshToken)) {
      if (mounted) {
        return addToFavorites(context, mounted: mounted, workoutId: workoutId);
      }
      throw Exception('Widget not mounted.');
    } else {
      if (mounted) logOut(context);
      throw Exception('Authorization failed.');
    }
  } else {
    return false;
  }
}

Future<bool> deleteFromFavorites(BuildContext context,
    {required int workoutId, bool mounted = true}) async {
  final token = await getJWT();
  final response = await http.delete(
    Uri.parse(buildUrl('workouts/favorites/delete/')),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ${token.accessToken}',
    },
    body: jsonEncode(<String, int>{
      'workout': workoutId,
    }),
  );

  if (response.statusCode == 204) {
    return true;
  } else if (response.statusCode == 401) {
    if (await refreshToken(refresh: token.refreshToken)) {
      if (mounted) {
        return addToFavorites(context, mounted: mounted, workoutId: workoutId);
      }
      throw Exception('Widget not mounted.');
    } else {
      if (mounted) logOut(context);
      throw Exception('Authorization failed.');
    }
  } else {
    return false;
  }
}

Future<List<StatisticExercise>> getExerciseHistory(
    DateTime dateTime, BuildContext context,
    [bool mounted = true]) async {
  final token = await getJWT();
  final response = await http.get(
    Uri.parse(buildUrl(
        'stats/stats_exercise/${dateTime.day}/${dateTime.month}/${dateTime.year}/')),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ${token.accessToken}',
    },
  );

  if (response.statusCode == 200) {
    return List<StatisticExercise>.from(
        jsonDecode(response.body).map((s) => StatisticExercise.fromJson(s)));
  } else if (response.statusCode == 401) {
    if (await refreshToken(refresh: token.refreshToken)) {
      if (mounted) return getExerciseHistory(dateTime, context, mounted);
      throw Exception('Widget not mounted.');
    } else {
      if (mounted) logOut(context);
      throw Exception('Authorization failed.');
    }
  } else {
    throw Exception('Created workouts could not be fetched.');
  }
}

Future<List<StatisticCalories>> getBurnedCaloriesStats(
    DateTime dateTime, BuildContext context,
    [bool mounted = true]) async {
  final token = await getJWT();
  final response = await http.get(
    Uri.parse(
        buildUrl('stats/stats_calories/${dateTime.month}/${dateTime.year}/')),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ${token.accessToken}',
    },
  );

  if (response.statusCode == 200) {
    return List<StatisticCalories>.from(
        jsonDecode(response.body).map((s) => StatisticCalories.fromJson(s)));
  } else if (response.statusCode == 401) {
    if (await refreshToken(refresh: token.refreshToken)) {
      if (mounted) return getBurnedCaloriesStats(dateTime, context, mounted);
      throw Exception('Widget not mounted.');
    } else {
      if (mounted) logOut(context);
      throw Exception('Authorization failed.');
    }
  } else {
    throw Exception('Created workouts could not be fetched.');
  }
}

Future<bool> createWorkout(Map<String, dynamic> data, BuildContext context,
    [bool mounted = true]) async {
  final token = await getJWT();
  http.MultipartRequest request = http.MultipartRequest(
    'POST',
    Uri.parse(buildUrl('workouts/plans/')),
  );
  request.headers['Authorization'] = 'Bearer ${token.accessToken}';
  request.fields['title'] = data['title'];
  request.fields['description'] = data['description'];
  request.fields['visibility'] = data['visibility'];
  request.fields['cycles'] = data['cycles'].toString();
  request.files
      .add(await http.MultipartFile.fromPath('thumbnail', data['image_path']));

  final response = await request.send();

  if (response.statusCode == 201) {
    return true;
  } else if (response.statusCode == 401) {
    if (await refreshToken(refresh: token.refreshToken)) {
      if (mounted) return createWorkout(data, context, mounted);
      throw Exception('Widget not mounted.');
    } else {
      if (mounted) logOut(context);
      throw Exception('Authorization failed.');
    }
  } else {
    return false;
  }
}

Future<bool> editWorkout(Map<String, dynamic> data, BuildContext context,
    [bool mounted = true]) async {
  final token = await getJWT();
  http.MultipartRequest request = http.MultipartRequest(
    'PATCH',
    Uri.parse(buildUrl('workouts/plans/${data['id']}/')),
  );
  request.headers['Authorization'] = 'Bearer ${token.accessToken}';
  request.fields['title'] = data['title'];
  request.fields['description'] = data['description'];
  request.fields['visibility'] = data['visibility'];
  request.fields['cycles'] = data['cycles'].toString();

  if (data['image_path'] != null) {
    request.files.add(
        await http.MultipartFile.fromPath('thumbnail', data['image_path']));
  }

  final response = await request.send();

  if (response.statusCode == 200) {
    return true;
  } else if (response.statusCode == 401) {
    if (await refreshToken(refresh: token.refreshToken)) {
      if (mounted) return editWorkout(data, context, mounted);
      throw Exception('Widget not mounted.');
    } else {
      if (mounted) logOut(context);
      throw Exception('Authorization failed.');
    }
  } else {
    return false;
  }
}
