import 'package:flutter/material.dart';
import 'package:gymshare/settings/colors.dart';

class RoundedRectangleButton extends StatelessWidget {
  final Widget child;
  final Function() onPress;
  final EdgeInsets padding;
  final num height;
  final num width;
  final Color backgroundColor;
  final Color borderColor;

  const RoundedRectangleButton({
    Key? key,
    required this.child,
    required this.onPress,
    this.padding = const EdgeInsets.only(top: 70.0),
    this.height = 60,
    this.width = double.infinity,
    this.backgroundColor = primaryColor,
    this.borderColor = tertiaryColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: padding,
      child: MaterialButton(
        color: backgroundColor,
        minWidth: width.toDouble(),
        height: height.toDouble(),
        onPressed: onPress,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(50),
          side: BorderSide(color: borderColor, width: 2),
        ),
        child: child,
      ),
    );
  }
}
