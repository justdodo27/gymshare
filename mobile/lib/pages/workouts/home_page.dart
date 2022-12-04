import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gymshare/api/models/api_response.dart';
import 'package:gymshare/api/models/exercise.dart';
import 'package:gymshare/api/models/workout.dart';
import 'package:gymshare/components/utils/requests.dart';
import 'package:gymshare/components/utils/routes.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/components/widgets/seamless_pattern.dart';
import 'package:gymshare/pages/dashboard.dart';
import 'package:gymshare/pages/workouts/add_workout_page.dart';
import 'package:gymshare/pages/workouts/exercises_page.dart';
import 'package:gymshare/pages/workouts/workouts_page.dart';
import 'package:gymshare/settings/colors.dart';

class WorkoutSearchDelegate extends SearchDelegate {
  final BuildContext context;
  final bool mounted;
  final bool searchTypeWorkouts;
  final _controller = ScrollController();

  List<String> get searchResults {
    return searchTypeWorkouts
        ? [
            'Turbo Admin Workout',
            'FBW',
            'Split',
            'Push Pull Legs',
          ]
        : [
            'Push Ups',
            'Deadlift',
            'Running',
          ];
  }

  WorkoutSearchDelegate({
    required this.context,
    required this.mounted,
    required this.searchTypeWorkouts,
  });

  ApiResponse apiResponse = ApiResponse(count: 0, results: []);
  List<Workout> workouts = [];
  List<Exercise> exercises = [];

  void fetchWorkouts(String query, Function(void Function()) setState,
      {bool next = false}) async {
    if (next && apiResponse.next != null || !next) {
      apiResponse = await searchWorkouts(
          context, query, mounted, next ? apiResponse.next : null);
      setState(() => workouts.addAll(List<Workout>.from(
          apiResponse.results.map((w) => Workout.fromJson(w)))));
    }
  }

  void fetchExercises(String query, Function(void Function()) setState,
      {bool next = false}) async {
    if (next && apiResponse.next != null || !next) {
      apiResponse = await searchExercises(
          context, query, mounted, next ? apiResponse.next : null);

      setState(() => exercises.addAll(List<Exercise>.from(
          apiResponse.results.map((e) => Exercise.fromJson(e)))));
    }
  }

  @override
  ThemeData appBarTheme(BuildContext context) {
    return ThemeData(
      textTheme: TextTheme(
        button: GoogleFonts.roboto(
          color: primaryTextColor,
          fontWeight: FontWeight.w500,
        ),
        headline6: GoogleFonts.roboto(
          color: primaryTextColor,
          fontSize: 20.0,
          fontWeight: FontWeight.w500,
        ),
      ),
      textSelectionTheme: const TextSelectionThemeData(
        cursorColor: primaryTextColor,
      ),
      hintColor: Colors.grey,
      backgroundColor: primaryColor,
      appBarTheme: const AppBarTheme(backgroundColor: secondaryColor),
      inputDecorationTheme: const InputDecorationTheme(
        border: InputBorder.none,
        hintStyle: TextStyle(fontSize: 20.0),
      ),
      scaffoldBackgroundColor: primaryColor,
      primaryColor: secondaryColor,
      iconTheme: const IconThemeData(color: primaryTextColor),
    );
  }

  @override
  Widget? buildLeading(BuildContext context) => IconButton(
      onPressed: () {
        query = '';
        workouts = [];
        exercises = [];
        apiResponse = ApiResponse(count: 0, results: []);
        close(context, null);
      },
      icon: const Icon(Icons.arrow_back));

  @override
  List<Widget>? buildActions(BuildContext context) => [
        IconButton(
            onPressed: () {
              query = '';
              workouts = [];
              exercises = [];
              apiResponse = ApiResponse(count: 0, results: []);
            },
            icon: const Icon(Icons.clear)),
      ];

  @override
  Widget buildResults(BuildContext context) {
    bool sent = false;

    return StatefulBuilder(
      builder: (context, setState) {
        if (!sent) {
          if (searchTypeWorkouts) {
            fetchWorkouts(query, setState);
            _controller.addListener(() {
              if (_controller.position.maxScrollExtent == _controller.offset) {
                fetchWorkouts(query, setState, next: true);
              }
            });
          } else {
            fetchExercises(query, setState);
            _controller.addListener(() {
              if (_controller.position.maxScrollExtent == _controller.offset) {
                fetchExercises(query, setState, next: true);
              }
            });
          }
          sent = true;
        }

        return SeamlessPattern(
          child: ScrollConfig(
            child: ListView.builder(
              controller: _controller,
              padding: const EdgeInsets.only(
                  top: 20, bottom: 10, left: 20, right: 20),
              itemCount: searchTypeWorkouts
                  ? workouts.length + 1
                  : exercises.length + 1,
              itemBuilder: (context, index) {
                if (searchTypeWorkouts) {
                  if (index < workouts.length) {
                    return WorkoutTile(workout: workouts[index]);
                  } else {
                    return index == apiResponse.count
                        ? Container()
                        : const Padding(
                            padding: EdgeInsets.symmetric(vertical: 16),
                            child: Center(
                                child: CircularProgressIndicator(
                                    color: tertiaryColor)),
                          );
                  }
                } else {
                  if (index < exercises.length) {
                    return ExerciseTile(exercise: exercises[index]);
                  } else {
                    return index == apiResponse.count
                        ? Container()
                        : const Padding(
                            padding: EdgeInsets.symmetric(vertical: 16),
                            child: Center(
                                child: CircularProgressIndicator(
                                    color: tertiaryColor)),
                          );
                  }
                }
              },
            ),
          ),
        );
      },
    );
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    final suggestions = searchResults.where((searchResult) {
      final result = searchResult.toLowerCase();
      final input = query.toLowerCase();

      return result.contains(input);
    }).toList();

    workouts = [];
    exercises = [];
    apiResponse = ApiResponse(count: 0, results: []);

    return SeamlessPattern(
      child: ListView.builder(
        itemCount: suggestions.length,
        itemBuilder: (context, index) => ListTile(
            title: Text(
              suggestions[index],
              style: const TextStyle(color: primaryTextColor),
            ),
            onTap: () {
              query = suggestions[index];
              showResults(context);
            }),
      ),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> with TickerProviderStateMixin {
  late TabController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title:
            Text('Search ${_controller.index == 0 ? 'workouts' : 'exercises'}'),
        actions: [
          IconButton(
            onPressed: () {
              showSearch(
                context: context,
                delegate: WorkoutSearchDelegate(
                  context: context,
                  mounted: mounted,
                  searchTypeWorkouts: _controller.index == 0,
                ),
              );
            },
            icon: const Icon(Icons.search),
          ),
        ],
        backgroundColor: secondaryColor,
        bottom: TabBar(
          onTap: (s) => setState(() {}),
          controller: _controller,
          indicatorColor: tertiaryColor,
          tabs: const [
            Tab(text: 'Workouts'),
            Tab(text: 'Exercises'),
          ],
        ),
      ),
      backgroundColor: Colors.transparent,
      floatingActionButton: const AddWorkoutButton(),
      body: SafeArea(
        child: TabBarView(
          controller: _controller,
          children: const [
            WorkoutsPage(),
            ExercisesPage(),
          ],
        ),
      ),
    );
  }
}

class AddWorkoutButton extends StatelessWidget {
  const AddWorkoutButton({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton(
      backgroundColor: quaternaryColor,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      onPressed: () => Navigator.of(context)
          .push(createBottomToTopPageRouteAnimation(const AddWorkoutPage()))
          .then((value) => Navigator.of(context)
              .pushReplacement(createPageRoute(const DashboardPage()))),
      child: const Icon(Icons.add, color: primaryTextColor),
    );
  }
}
