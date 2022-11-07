import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gymshare/components/widgets/seamless_pattern.dart';
import 'package:gymshare/pages/workouts/exercises_page.dart';
import 'package:gymshare/pages/workouts/workouts_page.dart';
import 'package:gymshare/settings/colors.dart';

class MySearchDelegate extends SearchDelegate {
  final searchResults = [
    'Turbo Admin Workout',
    'FBW',
    'Split',
    'Push Pull Legs',
  ];

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
    );
  }

  @override
  Widget? buildLeading(BuildContext context) => IconButton(
      onPressed: () => close(context, null),
      icon: const Icon(Icons.arrow_back));

  @override
  List<Widget>? buildActions(BuildContext context) => [
        IconButton(
            onPressed: () {
              query = '';
            },
            icon: const Icon(Icons.clear)),
      ];

  @override
  Widget buildResults(BuildContext context) => Container();

  @override
  Widget buildSuggestions(BuildContext context) {
    final suggestions = searchResults.where((searchResult) {
      final result = searchResult.toLowerCase();
      final input = query.toLowerCase();

      return result.contains(input);
    }).toList();

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

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: SeamlessPattern(
        child: Scaffold(
          appBar: AppBar(
            title: const Text('Search'),
            actions: [
              IconButton(
                onPressed: () {
                  showSearch(context: context, delegate: MySearchDelegate());
                },
                icon: const Icon(Icons.search),
              ),
            ],
            backgroundColor: secondaryColor,
            bottom: const TabBar(
              indicatorColor: tertiaryColor,
              tabs: [
                Tab(text: 'Workouts'),
                Tab(text: 'Exercises'),
              ],
            ),
          ),
          backgroundColor: Colors.transparent,
          body: const SafeArea(
            child: TabBarView(
              children: [
                WorkoutsPage(),
                ExercisesPage(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
