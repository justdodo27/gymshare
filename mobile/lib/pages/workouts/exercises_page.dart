import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:gymshare/api/models/api_response.dart';
import 'package:gymshare/api/models/exercise.dart';
import 'package:gymshare/components/utils/requests.dart';
import 'package:gymshare/components/utils/routes.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/pages/workouts/exercise_detail_page.dart';
import 'package:gymshare/settings/colors.dart';

class ExerciseTile extends StatefulWidget {
  final Exercise exercise;

  const ExerciseTile({
    Key? key,
    required this.exercise,
  }) : super(key: key);

  @override
  State<ExerciseTile> createState() => _ExerciseTileState();
}

class _ExerciseTileState extends State<ExerciseTile> {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.of(context).push(
        createPageRoute(ExerciseDetailPage(exercise: widget.exercise)),
      ),
      child: Padding(
        padding: const EdgeInsets.only(bottom: 20),
        child: Container(
          decoration: const BoxDecoration(
            color: quaternaryColor,
            borderRadius: BorderRadius.all(Radius.circular(20)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.max,
            children: [
              buildImage(),
              buildFooter(),
            ],
          ),
        ),
      ),
    );
  }

  Widget buildFooter() => SizedBox(
        height: 100,
        child: Align(
          alignment: Alignment.topLeft,
          child: Container(
            padding:
                const EdgeInsets.only(top: 15, left: 10, right: 10, bottom: 15),
            child: Scaffold(
              backgroundColor: quaternaryColor,
              body: Column(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.exercise.title,
                    style:
                        const TextStyle(color: primaryTextColor, fontSize: 20),
                  ),
                  Row(
                    children: [
                      const Text(
                        'Difficulty: ',
                        style: TextStyle(color: primaryTextColor, fontSize: 16),
                      ),
                      RatingBar.builder(
                        ignoreGestures: true,
                        itemSize: 20,
                        initialRating: widget.exercise.difficulty.toDouble(),
                        minRating: 1,
                        direction: Axis.horizontal,
                        allowHalfRating: true,
                        itemCount: 5,
                        itemPadding: EdgeInsets.zero,
                        itemBuilder: (context, _) => const Icon(
                          Icons.heart_broken,
                          color: Colors.red,
                        ),
                        onRatingUpdate: (rating) {},
                      ),
                      const SizedBox(width: 5),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      );

  Widget buildImage() => Hero(
        tag: 'exercise ${widget.exercise.id}',
        child: AspectRatio(
          aspectRatio: 16 / 9,
          child: Stack(
            children: [
              Container(
                decoration: BoxDecoration(
                  borderRadius:
                      const BorderRadius.vertical(top: Radius.circular(20)),
                  color: secondaryColor,
                  image: widget.exercise.thumbnailUrl.isNotEmpty
                      ? DecorationImage(
                          image: NetworkImage(widget.exercise.thumbnailUrl),
                          fit: BoxFit.cover,
                        )
                      : null,
                ),
                child: widget.exercise.thumbnailUrl.isEmpty
                    ? const Center(
                        child: Icon(
                          Icons.hide_image,
                          size: 50,
                        ),
                      )
                    : null,
              ),
              Positioned.fill(
                  child: Align(
                alignment: Alignment.topRight,
                child: Padding(
                  padding: const EdgeInsets.all(10.0),
                  child: Container(
                    decoration: const BoxDecoration(
                      borderRadius: BorderRadius.all(Radius.circular(20)),
                      color: quaternaryColor,
                    ),
                    height: 40,
                    width: 40,
                    child: Icon(
                      getActivityIcon(widget.exercise.exerciseType),
                      color: primaryTextColor,
                      size: 25,
                    ),
                  ),
                ),
              )),
            ],
          ),
        ),
      );

  IconData? getActivityIcon(String exerciseType) {
    switch (exerciseType) {
      case 'With own body weight':
        return Icons.sports_gymnastics;

      case 'With a weight':
        return Icons.fitness_center;

      case 'With time':
        return Icons.timer;

      default:
        return Icons.question_mark;
    }
  }
}

class ExercisesPage extends StatefulWidget {
  const ExercisesPage({
    Key? key,
  }) : super(key: key);

  @override
  State<ExercisesPage> createState() => _ExercisesPageState();
}

class _ExercisesPageState extends State<ExercisesPage> {
  final _controller = ScrollController();
  ApiResponse _apiResponse = ApiResponse(count: 0, results: []);
  List<Exercise> exercises = [];

  void fetchExercises({bool next = false}) async {
    if (next && _apiResponse.next != null || !next) {
      _apiResponse =
          await getExercises(context, mounted, next ? _apiResponse.next : null);
      setState(() => exercises.addAll(List<Exercise>.from(
          _apiResponse.results.map((w) => Exercise.fromJson(w)))));
    }
  }

  @override
  void initState() {
    super.initState();
    fetchExercises();
    _controller.addListener(() {
      if (_controller.position.maxScrollExtent == _controller.offset) {
        fetchExercises(next: true);
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScrollConfig(
      child: ListView.builder(
        controller: _controller,
        padding:
            const EdgeInsets.only(top: 20, bottom: 10, left: 20, right: 20),
        itemCount: exercises.length + 1,
        itemBuilder: (context, index) {
          if (index < exercises.length) {
            return ExerciseTile(exercise: exercises[index]);
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
