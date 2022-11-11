import 'package:flutter/material.dart';
import 'package:gymshare/api/models/token.dart';
import 'package:gymshare/components/utils/routes.dart';
import 'package:gymshare/pages/accounts/login_page.dart';
import 'package:gymshare/settings/colors.dart';
import 'package:shared_preferences/shared_preferences.dart';

void scrollToBottom(ScrollController controller) async {
  await Future.delayed(const Duration(milliseconds: 400));
  controller.animateTo(
    controller.position.maxScrollExtent,
    duration: const Duration(milliseconds: 200),
    curve: Curves.easeIn,
  );
}

Future<JWT> getJWT() async {
  final prefs = await SharedPreferences.getInstance();
  return JWT(
    accessToken: prefs.getString('accessToken')!,
    refreshToken: prefs.getString('refreshToken')!,
    isStaff: prefs.getBool('isStaff')!,
  );
}

String? validatePassword(String? value) {
  RegExp validPasswordRegExp =
      RegExp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$');
  if (value != null && !validPasswordRegExp.hasMatch(value)) {
    return 'Password should have:\n'
        '     - minimum eight characters,\n'
        '     - at least one uppercase letter,\n'
        '     - one lowercase letter,\n'
        '     - one number.';
  }
  return null;
}

SnackBar getErrorSnackBar({String text = 'Error'}) => SnackBar(
      duration: const Duration(seconds: 1),
      content: SizedBox(
        height: 60,
        child: Center(
          child: Text(
            text,
            style: const TextStyle(
              color: primaryTextColor,
              fontSize: 17,
            ),
          ),
        ),
      ),
      backgroundColor: errorColor,
    );

SnackBar getInfoSnackBar({String text = 'Info'}) => SnackBar(
      duration: const Duration(milliseconds: 500),
      content: SizedBox(
        height: 60,
        child: Center(
          child: Text(
            text,
            style: const TextStyle(
              color: primaryTextColor,
              fontSize: 18,
            ),
          ),
        ),
      ),
      backgroundColor: secondaryColor,
    );

void deleteTokens() async {
  final prefs = await SharedPreferences.getInstance();
  prefs.remove('accessToken');
  prefs.remove('refreshToken');
  prefs.remove('isStaff');
}

void logOut(BuildContext context) {
  deleteTokens();
  Navigator.of(context).pushReplacement(createPageRoute(const LoginPage()));
}
