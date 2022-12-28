import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gymshare/api/models/api_response.dart';
import 'package:gymshare/api/models/workout.dart';
import 'package:gymshare/components/utils/requests.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/components/widgets/seamless_pattern.dart';
import 'package:gymshare/pages/workouts/created_workouts_page.dart';
import 'package:gymshare/pages/workouts/favorite_workouts_page.dart';
import 'package:gymshare/pages/workouts/home_page.dart';
import 'package:gymshare/pages/workouts/workouts_page.dart';
import 'package:gymshare/settings/colors.dart';

class FavoriteWorkoutSearchDelegate extends SearchDelegate {
  final BuildContext context;
  final bool mounted;
  final bool searchTypeFavorites;
  final _controller = ScrollController();

  final searchResults = [
    'Turbo Admin Workout',
    'FBW',
    'Split',
    'Push Pull Legs',
  ];

  FavoriteWorkoutSearchDelegate({
    required this.context,
    required this.mounted,
    required this.searchTypeFavorites,
  });

  ApiResponse apiResponse = ApiResponse(count: 0, results: []);
  List<Workout> favorites = [];
  List<Workout> created = [];

  void fetchFavorites(String query, Function(void Function()) setState,
      {bool next = false}) async {
    if (next && apiResponse.next != null || !next) {
      apiResponse = await searchWorkouts(
          context, query, mounted, next ? apiResponse.next : null);
      setState(() => favorites.addAll(List<Workout>.from(
          apiResponse.results.map((w) => Workout.fromJson(w)))));
    }
  }

  void fetchCreated(String query, Function(void Function()) setState,
      {bool next = false}) async {
    if (next && apiResponse.next != null || !next) {
      apiResponse = await searchCreated(
          context, query, mounted, next ? apiResponse.next : null);
      setState(() => created.addAll(List<Workout>.from(
          apiResponse.results.map((w) => Workout.fromJson(w)))));
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
        favorites = [];
        created = [];
        close(context, null);
      },
      icon: const Icon(Icons.arrow_back));

  @override
  List<Widget>? buildActions(BuildContext context) => [
        IconButton(
            onPressed: () {
              query = '';
              favorites = [];
              created = [];
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
          if (searchTypeFavorites) {
            fetchFavorites(query, setState);
            _controller.addListener(() {
              if (_controller.position.maxScrollExtent == _controller.offset) {
                fetchFavorites(query, setState, next: true);
              }
            });
          } else {
            fetchCreated(query, setState);
            _controller.addListener(() {
              if (_controller.position.maxScrollExtent == _controller.offset) {
                fetchCreated(query, setState, next: true);
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
              itemCount: searchTypeFavorites
                  ? favorites.length + 1
                  : created.length + 1,
              itemBuilder: (context, index) {
                if (searchTypeFavorites) {
                  if (index < favorites.length) {
                    return WorkoutTile(workout: favorites[index]);
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
                  if (index < created.length) {
                    return WorkoutTile(workout: created[index]);
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

    favorites = [];
    created = [];
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

class FavoritesPage extends StatefulWidget {
  const FavoritesPage({super.key});

  @override
  State<FavoritesPage> createState() => _FavoritesPageState();
}

class _FavoritesPageState extends State<FavoritesPage>
    with TickerProviderStateMixin {
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
            Text('Search ${_controller.index == 0 ? 'workouts' : 'created'}'),
        actions: [
          IconButton(
            onPressed: () {
              showSearch(
                context: context,
                delegate: FavoriteWorkoutSearchDelegate(
                  context: context,
                  mounted: mounted,
                  searchTypeFavorites: _controller.index == 0,
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
            Tab(text: 'Favorites'),
            Tab(text: 'Created'),
          ],
        ),
      ),
      backgroundColor: Colors.transparent,
      floatingActionButton: const AddWorkoutButton(),
      body: SafeArea(
        child: TabBarView(
          controller: _controller,
          children: const [
            FavoriteWorkoutsPage(),
            CreatedWorkoutsPage(),
          ],
        ),
      ),
    );
  }
}
