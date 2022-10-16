import 'package:flutter/material.dart';

class GymShareLogo extends StatelessWidget {
  final num size;

  const GymShareLogo({
    Key? key,
    this.size = 150,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: size.toDouble(),
      width: size.toDouble(),
      decoration: BoxDecoration(
          color: const Color(0xFF7209b7),
          shape: BoxShape.circle,
          border: Border.all(color: const Color(0xFF2d00f7), width: 2)),
      child: Icon(
        Icons.fitness_center,
        size: size.toDouble() * 0.65,
      ),
    );
  }
}
