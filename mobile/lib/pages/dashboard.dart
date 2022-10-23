import 'package:flutter/material.dart';
import 'package:gymshare/settings/colors.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: SafeArea(
        child: Center(
          child: Text(
            'Dashboard',
            style: TextStyle(
              color: primaryTextColor,
              fontSize: 30,
            ),
          ),
        ),
      ),
    );
  }
}
