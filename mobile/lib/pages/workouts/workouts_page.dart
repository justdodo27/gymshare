import 'package:flutter/material.dart';
import 'package:gymshare/api/models/api_response.dart';
import 'package:gymshare/components/utils/requests.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:gymshare/api/models/workout.dart';
import 'package:gymshare/components/utils/routes.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/pages/workouts/workout_detail_page.dart';
import 'package:gymshare/settings/colors.dart';

class WorkoutsPage extends StatefulWidget {
  const WorkoutsPage({
    Key? key,
  }) : super(key: key);

  @override
  State<WorkoutsPage> createState() => _WorkoutsPageState();
}

class _WorkoutsPageState extends State<WorkoutsPage> {
  final _controller = ScrollController();
  ApiResponse _apiResponse = ApiResponse(count: 0, results: []);
  List<Workout> workouts = [];

  void fetchWorkouts({bool next = false}) async {
    if (next && _apiResponse.next != null || !next) {
      _apiResponse =
          await getWorkouts(context, mounted, next ? _apiResponse.next : null);
      setState(() => workouts.addAll(List<Workout>.from(
          _apiResponse.results.map((w) => Workout.fromJson(w)))));
    }
  }

  @override
  void initState() {
    super.initState();
    fetchWorkouts();
    _controller.addListener(() {
      if (_controller.position.maxScrollExtent == _controller.offset) {
        fetchWorkouts(next: true);
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
        itemCount: workouts.length + 1,
        itemBuilder: (context, index) {
          if (index < workouts.length) {
            return WorkoutTile(workout: workouts[index]);
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

class WorkoutTile extends StatefulWidget {
  final bool createdByCurrentUser;
  final Workout workout;

  const WorkoutTile({
    Key? key,
    required this.workout,
    this.createdByCurrentUser = false,
  }) : super(key: key);

  @override
  State<WorkoutTile> createState() => _WorkoutTileState();
}

class _WorkoutTileState extends State<WorkoutTile> {
  late bool isFavorite;
  late String title;
  late Widget image;
  bool edited = false;

  void _setNewData(data) {
    if (data == null) return;
    setState(() {
      isFavorite = data['isFavorite'];
      title = data['title'];
      image = data['image'];
    });
  }

  @override
  void initState() {
    super.initState();
    title = widget.workout.title;
    isFavorite = widget.workout.isFavorite;
    image = Container(
      decoration: BoxDecoration(
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
        color: secondaryColor,
        image: widget.workout.thumbnailUrl != null
            ? DecorationImage(
                image: NetworkImage('${widget.workout.thumbnailUrl}'),
                fit: BoxFit.fill,
              )
            : null,
      ),
      child: widget.workout.thumbnailUrl == null
          ? const Center(
              child: Icon(
                Icons.hide_image,
                size: 50,
              ),
            )
          : null,
    );
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.of(context)
          .push(
            createPageRoute(
              WorkoutDetailPage(
                workout: widget.workout,
                editable: widget.createdByCurrentUser,
                isFavorite: isFavorite,
              ),
            ),
          )
          .then((data) => _setNewData(data)),
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
        height: 110,
        child: Align(
          alignment: Alignment.topLeft,
          child: Container(
            padding: const EdgeInsets.only(top: 10, left: 10, right: 10),
            child: Scaffold(
              backgroundColor: Colors.transparent,
              body: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Text(
                    widget.workout.title,
                    style:
                        const TextStyle(color: primaryTextColor, fontSize: 16),
                  ),
                  const SizedBox(height: 5),
                  Row(
                    children: [
                      widget.workout.author.profilePictureUrl != null
                          ? Container(
                              height: 12,
                              width: 12,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                image: DecorationImage(
                                  image: NetworkImage(
                                      widget.workout.author.profilePictureUrl!),
                                  fit: BoxFit.cover,
                                ),
                              ),
                            )
                          : Container(
                              height: 12,
                              width: 12,
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
                        widget.workout.author.username,
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
                            initialRating: widget.workout.avgRating.toDouble(),
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
                          Text(
                            '(${widget.workout.ratingsCount})',
                            style: const TextStyle(
                                color: primaryTextColor, fontSize: 12),
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
                            onPressed: () async {
                              if (!isFavorite) {
                                if (await addToFavorites(
                                  context,
                                  mounted: mounted,
                                  workoutId: widget.workout.id,
                                )) {
                                  setState(() => isFavorite = true);
                                }
                              } else {
                                if (await deleteFromFavorites(
                                  context,
                                  mounted: mounted,
                                  workoutId: widget.workout.id,
                                )) {
                                  setState(() => isFavorite = false);
                                }
                              }
                            },
                            icon: Icon(
                              isFavorite
                                  ? Icons.favorite
                                  : Icons.favorite_outline,
                            ),
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
        ),
      );

  Widget buildImage() => Hero(
        tag: 'workout image ${widget.workout.id}',
        child: AspectRatio(
          aspectRatio: 16 / 9,
          child: image,
        ),
      );
}
