import 'package:flutter/material.dart';
import 'package:gymshare/components/utils/requests.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:gymshare/api/models/workout.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/settings/colors.dart';
import 'package:gymshare/settings/settings.dart';

class WorkoutsPage extends StatefulWidget {
  const WorkoutsPage({
    Key? key,
  }) : super(key: key);

  @override
  State<WorkoutsPage> createState() => _WorkoutsPageState();
}

class _WorkoutsPageState extends State<WorkoutsPage> {
  late Future<List<Workout>> _futureWorkouts;

  @override
  void initState() {
    super.initState();
    _futureWorkouts = getWorkouts();
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

class WorkoutTile extends StatelessWidget {
  final Workout workout;

  const WorkoutTile({
    Key? key,
    required this.workout,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    const widgetHeight = 220.0;

    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Container(
        height: widgetHeight,
        decoration: const BoxDecoration(
          color: quaternaryColor,
          borderRadius: BorderRadius.all(Radius.circular(20)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.max,
          children: [
            buildImage(),
            buildFooter(widgetHeight),
          ],
        ),
      ),
    );
  }

  Widget buildFooter(double widgetHeight) => SizedBox(
        height: widgetHeight * 0.45,
        child: Align(
          alignment: Alignment.topLeft,
          child: Container(
            padding: const EdgeInsets.only(top: 10, left: 10, right: 10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  workout.title,
                  style: const TextStyle(color: primaryTextColor, fontSize: 16),
                ),
                const SizedBox(height: 5),
                Row(
                  children: [
                    Container(
                      width: 12,
                      height: 12,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: tertiaryColor,
                      ),
                      child: const Icon(
                        Icons.person,
                        color: primaryColor,
                        size: 12,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      workout.author.username,
                      style: const TextStyle(
                        color: primaryTextColor,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        RatingBar.builder(
                          ignoreGestures: true,
                          itemSize: 20,
                          initialRating: workout.avgRating,
                          minRating: 1,
                          direction: Axis.horizontal,
                          allowHalfRating: true,
                          itemCount: 5,
                          itemPadding: EdgeInsets.zero,
                          itemBuilder: (context, _) => const Icon(
                            Icons.star,
                            color: Colors.amber,
                          ),
                          onRatingUpdate: (rating) {},
                        ),
                        const SizedBox(width: 5),
                        const Text(
                          '(420)',
                          style:
                              TextStyle(color: primaryTextColor, fontSize: 12),
                        )
                      ],
                    ),
                    Row(
                      children: [
                        IconButton(
                          onPressed: () {},
                          icon: const Icon(Icons.play_arrow_outlined),
                          iconSize: 25,
                          splashRadius: 1,
                        ),
                        IconButton(
                          onPressed: () {},
                          icon: const Icon(Icons.favorite_outline),
                          iconSize: 20,
                          splashRadius: 1,
                        )
                      ],
                    )
                  ],
                )
              ],
            ),
          ),
        ),
      );

  Widget buildImage() => Expanded(
        child: Container(
          decoration: const BoxDecoration(
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
            image: DecorationImage(
              image: NetworkImage(
                  '$serverUrlPrefix/media/thumbnails/admin_workout_0cl7vGl.png'),
              fit: BoxFit.cover,
            ),
          ),
        ),
      );
}
