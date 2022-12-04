import 'package:flutter/material.dart';
import 'package:gymshare/api/models/api_response.dart';
import 'package:gymshare/api/models/workout.dart';
import 'package:gymshare/components/utils/requests.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/pages/workouts/workouts_page.dart';
import 'package:gymshare/settings/colors.dart';

class CreatedWorkoutsPage extends StatefulWidget {
  const CreatedWorkoutsPage({super.key});

  @override
  State<CreatedWorkoutsPage> createState() => _CreatedWorkoutsPageState();
}

class _CreatedWorkoutsPageState extends State<CreatedWorkoutsPage> {
  final _controller = ScrollController();
  ApiResponse _apiResponse = ApiResponse(count: 0, results: []);
  List<Workout> workouts = [];

  void fetchCreatedWorkouts({bool next = false}) async {
    if (next && _apiResponse.next != null || !next) {
      _apiResponse = await getCreatedWorkouts(
          context, mounted, next ? _apiResponse.next : null);
      setState(() => workouts.addAll(List<Workout>.from(
          _apiResponse.results.map((w) => Workout.fromJson(w)))));
    }
  }

  @override
  void initState() {
    super.initState();
    fetchCreatedWorkouts();
    _controller.addListener(() {
      if (_controller.position.maxScrollExtent == _controller.offset) {
        fetchCreatedWorkouts(next: true);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return ScrollConfig(
      child: ListView.builder(
        controller: _controller,
        padding:
            const EdgeInsets.only(top: 20, bottom: 10, left: 20, right: 20),
        itemCount: workouts.length + 1,
        itemBuilder: (context, index) {
          if (index < workouts.length) {
            return WorkoutTile(
              workout: workouts[index],
              createdByCurrentUser: true,
            );
          } else {
            return index == _apiResponse.count
                ? Container()
                : const Padding(
                    padding: EdgeInsets.symmetric(vertical: 16),
                    child: Center(
                        child: CircularProgressIndicator(color: tertiaryColor)),
                  );
          }
        },
      ),
    );
  }
}
