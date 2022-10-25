import 'package:flutter/material.dart';
import 'package:gymshare/settings/colors.dart';

class SearchPage extends StatelessWidget {
  const SearchPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: primaryColor,
      body: SafeArea(
          child: Center(
        child: Text(
          'Search',
          style: TextStyle(fontSize: 40, color: primaryTextColor),
        ),
      )),
    );
  }
}
