import 'package:flutter/material.dart';
import 'package:gymshare/components/widgets/seamless_pattern.dart';
import 'package:gymshare/components/widgets/logo.dart';
import 'package:gymshare/components/widgets/rounded_rectangle_button.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/settings/colors.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});
  final backgroundHeight = 220.0;
  final profileSize = 120.0;

  editProfile() {}

  logOut() {}

  changePassword() {}

  deleteAccount() {}

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
        child: const GymShareLogo(),
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

  Widget _buildContent(Size size) {
    return Container(
      padding: EdgeInsets.only(top: profileSize * 0.7),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Andrzej Kapczyński',
              style: TextStyle(
                  color: primaryTextColor,
                  fontSize: 22,
                  fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            const Divider(thickness: 1, color: secondaryColor),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildTile(text: 'Height', value: '185cm'),
                _buildTile(text: 'Weight', value: '87kg'),
                _buildTile(text: 'Likes', value: '245 ❤'),
              ],
            ),
            const Divider(thickness: 1, color: secondaryColor),
            Container(
              width: size.width * 0.8,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  _buildButton(
                    icon: Icons.edit,
                    label: 'Edit profile',
                    onPress: editProfile,
                  ),
                  _buildButton(
                    icon: Icons.logout,
                    label: 'Logout',
                    onPress: logOut,
                  ),
                  _buildButton(
                    icon: Icons.password,
                    label: 'Change password',
                    onPress: changePassword,
                  ),
                  _buildButton(
                    icon: Icons.delete,
                    label: 'Delete account',
                    onPress: deleteAccount,
                  ),
                ],
              ),
            )
          ],
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
                _buildContent(size),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
