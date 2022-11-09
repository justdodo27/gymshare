import 'package:flutter/material.dart';
import 'package:gymshare/settings/colors.dart';

class WorkoutsPage extends StatelessWidget {
  const WorkoutsPage({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text('Workouts', style: TextStyle(color: primaryTextColor)),
    );
  }
}
