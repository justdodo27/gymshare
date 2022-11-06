import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:gymshare/settings/colors.dart';

class GymShareLogo extends StatelessWidget {
  final num size;

  const GymShareLogo({
    Key? key,
    this.size = 150,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SvgPicture.asset(
      'assets/logo.svg',
      height: size.toDouble(),
      color: primaryTextColor,
    );
  }
}
