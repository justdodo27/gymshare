import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:gymshare/components/utils/requests.dart';
import 'package:gymshare/settings/settings.dart';
import 'package:http/http.dart' as http;
import 'package:gymshare/components/utils/helpers.dart';
import 'package:gymshare/components/widgets/custom_text_form_field.dart';
import 'package:gymshare/components/widgets/rounded_rectangle_button.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/settings/colors.dart';

class ChangePasswordPage extends StatefulWidget {
  const ChangePasswordPage({super.key});

  @override
  State<ChangePasswordPage> createState() => _ChangePasswordPageState();
}

class _ChangePasswordPageState extends State<ChangePasswordPage> {
  final _formKey = GlobalKey<FormState>();
  final _oldPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();

  bool _buttonDisabled = false;

  Future<bool> _changePassword({
    required String oldPassword,
    required String newPassword,
  }) async {
    final token = await getJWT();
    final response = await http.put(
      Uri.parse(buildUrl('accounts/change-password/')),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ${token.accessToken}',
      },
      body: jsonEncode(<String, dynamic>{
        'old_password': oldPassword,
        'new_password': newPassword,
      }),
    );

    if (response.statusCode == 401) {
      await refreshToken(refresh: token.refreshToken);
      return _changePassword(
          oldPassword: oldPassword, newPassword: newPassword);
    }

    return response.statusCode == 200;
  }

  @override
  void dispose() {
    _oldPasswordController.dispose();
    _newPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: secondaryColor,
        title: const Text('Change password'),
      ),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: ScrollConfig(
            child: ListView(
              padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 10),
              children: [
                CustomTextFormField(
                  controller: _oldPasswordController,
                  obsecureText: true,
                  labelText: 'Old password',
                  validator: (value) {
                    if (value!.isEmpty) {
                      return 'Please provide your old password.';
                    }
                    return null;
                  },
                ),
                CustomTextFormField(
                  controller: _newPasswordController,
                  obsecureText: true,
                  labelText: 'New password',
                  validator: (value) => validatePassword(value),
                ),
                const SizedBox(height: 20),
                const Divider(color: primaryTextColor),
                RoundedRectangleButton(
                  isButtonDisabled: _buttonDisabled,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                  onPress: () async {
                    FocusManager.instance.primaryFocus?.unfocus();
                    final isValid = _formKey.currentState!.validate();

                    if (isValid) {
                      setState(() => _buttonDisabled = true);
                      if (await _changePassword(
                          oldPassword: _oldPasswordController.text,
                          newPassword: _newPasswordController.text)) {
                        Navigator.of(context).pop();
                        ScaffoldMessenger.of(context).showSnackBar(
                          getInfoSnackBar(
                              text: 'Password has been successfully changed.'),
                        );
                      } else {
                        setState(() => _buttonDisabled = false);
                        ScaffoldMessenger.of(context).showSnackBar(
                          getErrorSnackBar(text: 'Failed to change password.'),
                        );
                      }
                    }
                  },
                  child: const Text('Save password'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
