import 'package:flutter/material.dart';
import 'package:gymshare/components/utils/requests.dart';
import 'package:gymshare/components/utils/routes.dart';
import 'package:gymshare/components/widgets/custom_text_form_field.dart';
import 'package:gymshare/components/widgets/logo.dart';
import 'package:gymshare/components/widgets/rounded_rectangle_button.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/pages/accounts/signup_page.dart';
import 'package:gymshare/pages/dashboard.dart';
import 'package:gymshare/settings/colors.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _scrollController = ScrollController();

  late String username;
  late String password;

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  String? _validateInput(value) {
    if (value!.length < 4) {
      return 'Enter at least 4 characters.';
    }
    return null;
  }

  void _scrollToBottom() async {
    await Future.delayed(const Duration(milliseconds: 400));
    _scrollController.animateTo(
      _scrollController.position.maxScrollExtent,
      duration: const Duration(milliseconds: 200),
      curve: Curves.easeIn,
    );
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Scaffold(
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: ScrollConfig(
            child: SingleChildScrollView(
              controller: _scrollController,
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children: [
                    SizedBox(height: size.height * 0.05),
                    const GymShareLogo(),
                    SizedBox(height: size.height * 0.05),
                    CustomTextFormField(
                      controller: _usernameController,
                      labelText: 'Username',
                      validator: _validateInput,
                      onSaved: (value) => setState(() => username = value!),
                      onTap: _scrollToBottom,
                    ),
                    CustomTextFormField(
                      controller: _passwordController,
                      obsecureText: true,
                      labelText: 'Password',
                      validator: _validateInput,
                      onSaved: (value) => setState(() => password = value!),
                      onTap: _scrollToBottom,
                    ),
                    const SizedBox(height: 30),
                    const Divider(
                      color: primaryTextColor,
                    ),
                    RoundedRectangleButton(
                      width: size.width * 0.8,
                      padding: const EdgeInsets.only(top: 10),
                      child: const Text(
                        'Login',
                        style: TextStyle(color: primaryTextColor, fontSize: 16),
                      ),
                      onPress: () async {
                        FocusManager.instance.primaryFocus?.unfocus();
                        final isValid = _formKey.currentState!.validate();
                        if (isValid) {
                          _formKey.currentState!.save();
                          if (await gatherToken(username, password)) {
                            Navigator.of(context).pushReplacement(
                              createPageRouteWithAnimation(
                                  const DashboardPage()),
                            );
                          } else {
                            const snackBar = SnackBar(
                              content: SizedBox(
                                height: 60,
                                child: Center(
                                  child: Text(
                                    'Wrong Credentials!',
                                    style: TextStyle(
                                        color: primaryTextColor, fontSize: 18),
                                  ),
                                ),
                              ),
                              backgroundColor: tertiaryColor,
                            );
                            ScaffoldMessenger.of(context)
                                .showSnackBar(snackBar);
                          }
                        }
                      },
                    ),
                    const SizedBox(height: 30),
                    GestureDetector(
                      onTap: () => Navigator.of(context).pushReplacement(
                        createPageRouteWithAnimation(
                          const SignupPage(),
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
                          'Don’t have account yet? Create a new one',
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
    );
  }
}
