import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:gymshare/api/models/user.dart';
import 'package:gymshare/components/utils/helpers.dart';
import 'package:gymshare/components/utils/routes.dart';
import 'package:gymshare/components/widgets/seamless_pattern.dart';
import 'package:gymshare/components/widgets/logo.dart';
import 'package:gymshare/components/widgets/rounded_rectangle_button.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/pages/accounts/change_password.dart';
import 'package:gymshare/pages/accounts/edit_profile.dart';
import 'package:gymshare/pages/accounts/login_page.dart';
import 'package:gymshare/settings/colors.dart';
import 'package:gymshare/settings/settings.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final backgroundHeight = 180.0;
  final profileSize = 120.0;
  late Future<Profile> _futureProfile;
  late Profile _profile;

  @override
  void initState() {
    super.initState();
    _futureProfile = _fetchUserData();
  }

  void deleteTokens() async {
    final prefs = await SharedPreferences.getInstance();
    prefs.remove('accessToken');
    prefs.remove('refreshToken');
    prefs.remove('isStaff');
  }

  Widget _buildTop() {
    return Stack(
      clipBehavior: Clip.none,
      alignment: Alignment.center,
      children: [
        _buildProfileBackground(),
        Positioned(
          top: backgroundHeight - profileSize / 2,
          child: _buildProfileImage(),
        ),
      ],
    );
  }

  Widget _buildProfileBackground() => Container(
        width: double.infinity,
        height: backgroundHeight,
        color: secondaryColor,
        child: const Hero(
          tag: 'logo',
          child: GymShareLogo(),
        ),
      );

  Widget _buildProfileImage() => Container(
        height: profileSize,
        width: profileSize,
        decoration: const BoxDecoration(
          color: tertiaryColor,
          shape: BoxShape.circle,
        ),
        child: Icon(
          Icons.person,
          size: profileSize * 0.7,
          color: secondaryColor,
        ),
      );

  Widget _buildContent(BuildContext context, Size size) {
    return Container(
      padding: EdgeInsets.only(top: profileSize * 0.7),
      child: Center(
        child: FutureBuilder<Profile>(
          future: _futureProfile,
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              return Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  (_profile.user.firstName.isNotEmpty ||
                          _profile.user.lastName.isNotEmpty)
                      ? Text(
                          '${_profile.user.firstName} ${_profile.user.lastName}',
                          style: const TextStyle(
                              color: primaryTextColor,
                              fontSize: 22,
                              fontWeight: FontWeight.bold),
                        )
                      : Text(
                          _profile.user.username,
                          style: const TextStyle(
                              color: primaryTextColor,
                              fontSize: 22,
                              fontWeight: FontWeight.bold),
                        ),
                  const SizedBox(height: 10),
                  const Divider(thickness: 1, color: secondaryColor),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildTile(
                          text: 'Height',
                          value: '${_profile.height ?? '???'}cm'),
                      _buildTile(
                          text: 'Weight',
                          value: '${_profile.weight ?? '???'}kg'),
                      _buildTile(text: 'Likes', value: '${_profile.likes} ❤'),
                    ],
                  ),
                  const Divider(thickness: 1, color: secondaryColor),
                  Container(
                    width: size.width * 0.9,
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        _buildButton(
                          icon: Icons.edit,
                          label: 'Edit profile',
                          onPress: () => Navigator.of(context)
                              .push(
                                createLeftToRightRouteAnimation(
                                  EditProfilePage(
                                    firstName: _profile.user.firstName,
                                    lastName: _profile.user.lastName,
                                    weight: _profile.weight,
                                    height: _profile.height,
                                  ),
                                ),
                              )
                              .then((value) => _fetchUserData()),
                        ),
                        _buildButton(
                          icon: Icons.password,
                          label: 'Change password',
                          onPress: () => Navigator.of(context).push(
                            createLeftToRightRouteAnimation(
                              const ChangePasswordPage(),
                            ),
                          ),
                        ),
                        _buildButton(
                          icon: Icons.logout,
                          label: 'Logout',
                          onPress: () {
                            deleteTokens();
                            Navigator.of(context).pushReplacement(
                                createPageRoute(const LoginPage()));
                          },
                        ),
                      ],
                    ),
                  )
                ],
              );
            }
            return SizedBox(
              height: size.height * 0.4,
              child: const Center(
                child: CircularProgressIndicator(color: tertiaryColor),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildButton({
    required IconData icon,
    required String label,
    required Function() onPress,
  }) {
    return RoundedRectangleButton(
      backgroundColor: quaternaryColor,
      borderColor: const Color(0xFF404561),
      borderWidth: 3,
      padding: const EdgeInsets.symmetric(vertical: 15),
      onPress: onPress,
      child: Row(
        children: [
          const SizedBox(width: 20),
          Icon(icon),
          const SizedBox(width: 20),
          Expanded(child: Text(label)),
        ],
      ),
    );
  }

  Widget _buildTile({required String text, required String value}) =>
      MaterialButton(
        onPressed: () {},
        padding: const EdgeInsets.symmetric(vertical: 4),
        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Text(
              value,
              style: const TextStyle(
                color: primaryTextColor,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 5),
            Text(
              text,
              style: const TextStyle(
                color: Colors.grey,
                fontSize: 16,
                // fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      );

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Scaffold(
      backgroundColor: primaryColor,
      body: SafeArea(
        child: SeamlessPattern(
          child: ScrollConfig(
            child: ListView(
              children: [
                _buildTop(),
                _buildContent(context, size),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<Profile> _fetchUserData() async {
    final token = await getJWT();
    final userId = token.decodedAccessToken['user_id'];

    final response = await http.get(
      Uri.parse(buildUrl('accounts/profiles/$userId')),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ${token.accessToken}',
      },
    );

    if (response.statusCode == 200) {
      setState(() => _profile = Profile.fromJson(jsonDecode(response.body)));
      return _profile;
    } else {
      throw Exception('User data could not be fetched.');
    }
  }
}
