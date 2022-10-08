import 'package:flutter/material.dart';
import 'package:gymshare/settings/colors.dart';

class StartPage extends StatefulWidget {
  const StartPage({Key? key}) : super(key: key);

  @override
  State<StartPage> createState() => _StartPageState();
}

class _StartPageState extends State<StartPage> {
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text(
          'Start page',
          style: TextStyle(color: primaryTextColor, fontSize: 30),
        ),
      ),
    );
  }
}
