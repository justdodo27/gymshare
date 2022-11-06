import 'package:flutter/cupertino.dart';


class SeamlessPattern extends StatelessWidget {
  final Widget child;
  const SeamlessPattern({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return SizedBox(
      height: size.height,
      child: Stack(
        children: [
          Positioned.fill(
            child: Image.asset(
              'assets/seamless-pattern.png',
              repeat: ImageRepeat.repeat,
            ),
          ),
          child,
        ],
      ),
    );
  }
}
