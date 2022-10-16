import 'package:flutter/material.dart';
import 'package:gymshare/settings/colors.dart';

class ScrollConfig extends StatelessWidget {
  final Widget child;

  const ScrollConfig({Key? key, required this.child}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ScrollConfiguration(
      behavior: const ScrollBehavior(),
      child: GlowingOverscrollIndicator(
        axisDirection: AxisDirection.down,
        color: tertiaryColor,
        child: child,
      ),
    );
  }
}
