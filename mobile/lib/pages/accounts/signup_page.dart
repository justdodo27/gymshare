import 'dart:convert';
import 'package:email_validator/email_validator.dart';
import 'package:flutter/material.dart';
import 'package:gymshare/components/utils/helpers.dart';
import 'package:gymshare/components/utils/routes.dart';
import 'package:gymshare/components/widgets/seamless_pattern.dart';
import 'package:gymshare/components/widgets/custom_text_form_field.dart';
import 'package:gymshare/components/widgets/logo.dart';
import 'package:gymshare/components/widgets/rounded_rectangle_button.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/pages/accounts/login_page.dart';
import 'package:gymshare/settings/colors.dart';
import 'package:gymshare/settings/settings.dart';
import 'package:http/http.dart' as http;

class SignupPage extends StatefulWidget {
  const SignupPage({Key? key}) : super(key: key);

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final _formKey = GlobalKey<FormState>();
  final _scrollController = ScrollController();
  final _emailController = TextEditingController();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();

  late String email;
  late String username;
  late String password;

  bool _buttonDisabled = false;

  @override
  void dispose() {
    _emailController.dispose();
    _usernameController.dispose();
    _passwordController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  String? validateUsername(String? value) {
    if (value!.isEmpty) {
      return 'Enter at least 1 characters.';
    }
    return null;
  }

  String? validateEmail(String? value) {
    if (value != null && !EmailValidator.validate(value)) {
      return 'Enter a valid email address.';
    }
    return null;
  }

  Future<bool> createUser() async {
    final response = await http.post(
      Uri.parse(buildUrl('accounts/users/')),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'email': email,
        'username': username,
        'password': password,
      }),
    );

    return response.statusCode == 201;
  }

  void _signUp() async {
    FocusManager.instance.primaryFocus?.unfocus();
    final isValid = _formKey.currentState!.validate();
    if (isValid) {
      setState(() => _buttonDisabled = true);
      _formKey.currentState!.save();
      if (await createUser()) {
        ScaffoldMessenger.of(context).showSnackBar(
          getInfoSnackBar(text: 'Account created successfully!'),
        );
        Navigator.of(context).pushReplacement(
          createPageRoute(const LoginPage()),
        );
      } else {
        setState(() => _buttonDisabled = false);
        ScaffoldMessenger.of(context).showSnackBar(
          getErrorSnackBar(
              text: 'User with provided credentials already exists.'),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return SafeArea(
      child: SeamlessPattern(
        child: Scaffold(
          backgroundColor: Colors.transparent,
          body: Form(
            key: _formKey,
            child: ScrollConfig(
              child: SingleChildScrollView(
                controller: _scrollController,
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    children: [
                      SizedBox(height: size.height * 0.05),
                      const Hero(tag: 'logo', child: GymShareLogo()),
                      SizedBox(height: size.height * 0.05),
                      CustomTextFormField(
                        controller: _emailController,
                        labelText: 'Email',
                        keyboardType: TextInputType.emailAddress,
                        validator: validateEmail,
                        onSaved: (value) => setState(() => email = value!),
                        onTap: () => scrollToBottom(_scrollController),
                      ),
                      CustomTextFormField(
                        controller: _usernameController,
                        labelText: 'Username',
                        validator: validateUsername,
                        onSaved: (value) => setState(() => username = value!),
                        onTap: () => scrollToBottom(_scrollController),
                      ),
                      CustomTextFormField(
                        controller: _passwordController,
                        obsecureText: true,
                        labelText: 'Password',
                        keyboardType: TextInputType.visiblePassword,
                        validator: validatePassword,
                        onSaved: (value) => setState(() => password = value!),
                        onTap: () => scrollToBottom(_scrollController),
                      ),
                      const SizedBox(height: 30),
                      const Hero(
                        tag: 'divider',
                        child: Divider(
                          color: primaryTextColor,
                        ),
                      ),
                      Hero(
                        tag: 'button',
                        child: RoundedRectangleButton(
                          isButtonDisabled: _buttonDisabled,
                          width: size.width * 0.8,
                          padding: const EdgeInsets.only(top: 10),
                          child: const Text(
                            'Signup',
                            style: TextStyle(
                                color: primaryTextColor, fontSize: 16),
                          ),
                          onPress: () => _signUp(),
                        ),
                      ),
                      const SizedBox(height: 30),
                      GestureDetector(
                        onTap: () => Navigator.of(context).pushReplacement(
                          createPageRoute(
                            const LoginPage(),
                          ),
                        ),
                        child: Container(
                          padding: const EdgeInsets.only(
                            bottom: 2, // Space between underline and text
                          ),
                          decoration: const BoxDecoration(
                            border: Border(
                              bottom: BorderSide(
                                color: primaryTextColor,
                                width: 1.0, // Underline thickness
                              ),
                            ),
                          ),
                          child: const Text(
                            'Do you have account? Log in',
                            style: TextStyle(
                              color: primaryTextColor,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
