import 'package:flutter/material.dart';
import 'package:gymshare/settings/colors.dart';

class FavoritesPage extends StatelessWidget {
  const FavoritesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: primaryColor,
      body: SafeArea(
          child: Center(
        child: Text(
          'Favorites',
          style: TextStyle(fontSize: 40, color: primaryTextColor),
        ),
      )),
    );
  }
}
