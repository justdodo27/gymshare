import 'package:flutter/material.dart';
import 'package:gymshare/components/logo.dart';
import 'package:gymshare/components/rounded_rectangle_button.dart';
import 'package:gymshare/components/scroll_configuration.dart';
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
            onPress: () {},
            child: const Text(
              'I am a Gym Rat',
              style: TextStyle(fontSize: 18),
            ),
          ),
          RoundedRectangleButton(
            onPress: () {},
            padding: const EdgeInsets.only(top: 20),
            child: const Text(
              'I am brand new to GymShare',
              style: TextStyle(fontSize: 18),
            ),
          )
        ],
      );

  Widget buildLogo(Size size) => Padding(
        padding: const EdgeInsets.only(top: 60),
        child: GymShareLogo(
          size: size.width * 0.5,
        ),
      );

  Widget buildWelcomeBanner() => Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 30),
            decoration: BoxDecoration(
                color: secondaryColor,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: tertiaryColor, width: 2)),
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
                      fontSize: 18,
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
                  child: Expanded(
                    child: Column(
                      mainAxisSize: MainAxisSize.max,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        buildWelcomeBanner(),
                        buildLogo(size),
                        buildButtons(),
                      ],
                    ),
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
