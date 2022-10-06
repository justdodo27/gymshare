import 'package:flutter/material.dart';
import 'package:gymshare/pages/start_page.dart';
import 'package:animated_splash_screen/animated_splash_screen.dart';
import 'package:gymshare/settings/colors.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  Widget build(BuildContext context) {
    return AnimatedSplashScreen(
      splash: const Center(
        child: Text(
          'Gymshare',
          style: TextStyle(
            fontSize: 60,
            color: primaryTextColor,
          ),
        ),
      ),
      nextScreen: const StartPage(),
      backgroundColor: primaryColor,
    );
  }
}
