import 'package:flutter/material.dart';
import 'package:gymshare/settings/colors.dart';

class StatisticsPage extends StatelessWidget {
  const StatisticsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: primaryColor,
      body: SafeArea(
          child: Center(
        child: Text(
          'Statistics',
          style: TextStyle(fontSize: 40, color: primaryTextColor),
        ),
      )),
    );
  }
}
