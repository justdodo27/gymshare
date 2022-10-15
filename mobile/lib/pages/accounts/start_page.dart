import 'package:flutter/material.dart';
import 'package:gymshare/components/utils/routes.dart';
import 'package:gymshare/components/widgets/logo.dart';
import 'package:gymshare/components/widgets/rounded_rectangle_button.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/pages/accounts/login_page.dart';
import 'package:gymshare/pages/accounts/signup_page.dart';
import 'package:gymshare/settings/colors.dart';

class StartPage extends StatefulWidget {
  const StartPage({Key? key}) : super(key: key);

  @override
  State<StartPage> createState() => _StartPageState();
}

class _StartPageState extends State<StartPage> {
  Widget buildButtons() => Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          RoundedRectangleButton(
            onPress: () => Navigator.of(context).push(
              createPageRouteWithAnimation(const LoginPage()),
            ),
            child: const Text(
              'I am a Gym Rat',
              style: TextStyle(fontSize: 18),
            ),
          ),
          RoundedRectangleButton(
            onPress: () => Navigator.of(context).push(
              createPageRouteWithAnimation(const SignupPage()),
            ),
            padding: const EdgeInsets.only(top: 20),
            child: const Text(
              'I am brand new to GymShare',
              style: TextStyle(fontSize: 18),
            ),
          )
        ],
      );

  Widget buildWelcomeBanner() => Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 30.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: const [
                Text(
                  'Welcome',
                  style: TextStyle(
                    color: primaryTextColor,
                    fontSize: 35,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                Padding(
                  padding: EdgeInsets.only(top: 20, left: 20, right: 20),
                  child: Text(
                    'Improve the efficiency and pleasure of your training with GymShare',
                    style: TextStyle(
                      color: primaryTextColor,
                      fontSize: 16,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ],
            ),
          ),
        ],
      );

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Scaffold(
      body: SafeArea(
        child: ScrollConfig(
          child: CustomScrollView(
            slivers: [
              SliverFillRemaining(
                hasScrollBody: false,
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                      vertical: 40.0, horizontal: 10),
                  child: Column(
                    mainAxisSize: MainAxisSize.max,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      buildWelcomeBanner(),
                      GymShareLogo(size: size.width * 0.5),
                      buildButtons(),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
