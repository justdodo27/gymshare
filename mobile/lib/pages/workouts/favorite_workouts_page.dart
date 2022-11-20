import 'package:flutter/material.dart';
import 'package:gymshare/api/models/workout.dart';
import 'package:gymshare/components/utils/requests.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/pages/workouts/workouts_page.dart';
import 'package:gymshare/settings/colors.dart';

class FavoriteWorkoutsPage extends StatefulWidget {
  const FavoriteWorkoutsPage({super.key});

  @override
  State<FavoriteWorkoutsPage> createState() => _FavoriteWorkoutsPageState();
}

class _FavoriteWorkoutsPageState extends State<FavoriteWorkoutsPage> {
  late Future<List<Workout>> _futureWorkouts;

  @override
  void initState() {
    super.initState();
    _futureWorkouts = getFavoriteWorkouts(context, mounted);
  }

  @override
  Widget build(BuildContext context) {
    return ScrollConfig(
      child: FutureBuilder<List<Workout>>(
        future: _futureWorkouts,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            final workouts = snapshot.data!;
            return ListView.builder(
              padding: const EdgeInsets.only(
                  top: 20, bottom: 10, left: 20, right: 20),
              itemCount: workouts.length,
              itemBuilder: (context, index) {
                return WorkoutTile(workout: workouts[index]);
              },
            );
          }
          return const Center(
            child: CircularProgressIndicator(color: tertiaryColor),
          );
        },
      ),
    );
  }
}
