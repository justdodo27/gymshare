import 'package:curved_navigation_bar/curved_navigation_bar.dart';
import 'package:flutter/material.dart';
import 'package:gymshare/components/widgets/seamless_pattern.dart';
import 'package:gymshare/pages/accounts/profile_page.dart';
import 'package:gymshare/pages/statistics/statistics_page.dart';
import 'package:gymshare/pages/workouts/active_workout_page.dart';
import 'package:gymshare/pages/workouts/favorites_page.dart';
import 'package:gymshare/pages/workouts/home_page.dart';
import 'package:gymshare/pages/workouts/training_page.dart';
import 'package:gymshare/settings/colors.dart';
import 'package:shared_preferences/shared_preferences.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  int currentPageIdx = 0;
  int currentPage = 0;

  void runTraining() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? workoutJSONString = prefs.getString('active_workout');
    if (workoutJSONString is String) {
      setState(() => {
        currentPageIdx = 5,
        currentPage = 2
      });
    } else if (currentPageIdx == 5) {
      setState(() => {
        currentPageIdx = 2,
        currentPage = 2
      });
    }
  }

  void changeScreen(int screenIdx) async {
    if (screenIdx == 2) {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? workoutJSONString = prefs.getString('active_workout');
      if (workoutJSONString is String) {
        setState(() => {
          currentPageIdx = 5,
          currentPage = screenIdx
        });
      } else {
        setState(() => {
          currentPageIdx = screenIdx,
          currentPage = screenIdx
        });  
      }
    } else {
      setState(() => {
        currentPageIdx = screenIdx,
        currentPage = screenIdx
      });
    }
  }

  static List<Widget> screens = [];

  @override
  void initState() {
    runTraining();
    screens = [
      const HomePage(),
      const FavoritesPage(),
      TrainingPage(callback: () => runTraining()),
      const StatisticsPage(),
      const ProfilePage(),
      ActivityPage(callback: () => runTraining()),
    ];
    super.initState();
  }

  Widget buildBottomNavigationBar() {
    return Theme(
      data: Theme.of(context).copyWith(
        iconTheme: const IconThemeData(
          color: primaryTextColor,
          size: 30,
        ),
      ),
      child: CurvedNavigationBar(
        height: 60,
        backgroundColor: Colors.transparent,
        color: secondaryColor,
        buttonBackgroundColor: const Color(0xFF3252CF),
        index: currentPage,
        onTap: (clicked) => changeScreen(clicked),
        animationCurve: Curves.linearToEaseOut,
        animationDuration: const Duration(milliseconds: 400),
        items: const [
          Icon(Icons.home),
          Icon(Icons.favorite),
          Icon(Icons.fitness_center),
          Icon(Icons.show_chart),
          Icon(Icons.person),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SeamlessPattern(
        child: Scaffold(
          backgroundColor: Colors.transparent,
          body: screens[currentPageIdx],
          bottomNavigationBar: buildBottomNavigationBar(),
        ),
      ),
    );
  }
}
