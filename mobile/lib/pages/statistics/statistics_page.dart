import 'package:flutter/material.dart';
import 'package:gymshare/components/widgets/colored_tab_bar.dart';
import 'package:gymshare/pages/statistics/burned_calories_page.dart';
import 'package:gymshare/pages/statistics/exercise_history_page.dart';
import 'package:gymshare/settings/colors.dart';

class StatisticsPage extends StatefulWidget {
  const StatisticsPage({super.key});

  @override
  State<StatisticsPage> createState() => _StatisticsPageState();
}

class _StatisticsPageState extends State<StatisticsPage>
    with TickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: ColoredTabBar(
        color: secondaryColor,
        tabBar: TabBar(
          controller: _tabController,
          indicatorColor: tertiaryColor,
          tabs: const [
            Tab(text: 'Workouts'),
            Tab(text: 'Exercises'),
          ],
        ),
      ),
      body: SafeArea(
          child: TabBarView(
        controller: _tabController,
        children: const [
          BurnedCaloriesPage(),
          ExerciseHistoryPage(),
        ],
      )),
    );
  }
}
