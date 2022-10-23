import 'package:flutter/material.dart';
import 'package:gymshare/components/widgets/logo.dart';
import 'package:gymshare/pages/accounts/login_page.dart';
import 'package:animated_splash_screen/animated_splash_screen.dart';
import 'package:gymshare/pages/dashboard.dart';
import 'package:gymshare/settings/colors.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  late Future<String?> _token;

  @override
  void initState() {
    super.initState();
    _token = checkIfLoggedIn();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedSplashScreen(
      splash: const GymShareLogo(),
      splashIconSize: 150,
      nextScreen: FutureBuilder<String?>(
        future: _token,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            if (snapshot.data != null) {
              return const DashboardPage();
            }
          }
          return const LoginPage();
        },
      ),
      backgroundColor: primaryColor,
    );
  }

  Future<String?> checkIfLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('accessToken');
  }
}
