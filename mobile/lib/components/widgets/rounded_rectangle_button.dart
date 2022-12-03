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
  final bool isButtonDisabled;
  final num borderWidth;

  const RoundedRectangleButton({
    Key? key,
    required this.child,
    required this.onPress,
    this.padding = const EdgeInsets.only(top: 70.0),
    this.height = 60,
    this.width = double.infinity,
    this.backgroundColor = primaryColor,
    this.borderColor = tertiaryColor,
    this.isButtonDisabled = false,
    this.borderWidth = 2,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: padding,
      child: MaterialButton(
        color: backgroundColor,
        splashColor: borderColor,
        minWidth: width.toDouble(),
        height: height.toDouble(),
        onPressed: () {
          if (!isButtonDisabled) {
            onPress();
          }
        },
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(50),
          side: BorderSide(color: borderColor, width: borderWidth.toDouble()),
        ),
        child: isButtonDisabled
            ? const SizedBox(
                height: 20,
                width: 20,
                child: CircularProgressIndicator(
                  color: primaryTextColor,
                  strokeWidth: 2,
                ),
              )
            : child,
      ),
    );
  }
}
