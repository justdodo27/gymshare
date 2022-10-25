import 'package:flutter/material.dart';
import 'package:gymshare/settings/colors.dart';

class TrainingPage extends StatelessWidget {
  const TrainingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: primaryColor,
      body: SafeArea(
          child: Center(
        child: Text(
          'Training',
          style: TextStyle(fontSize: 40, color: primaryTextColor),
        ),
      )),
    );
  }
}
