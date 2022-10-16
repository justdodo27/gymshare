import 'package:flutter/material.dart';
import 'package:gymshare/components/widgets/custom_text_form_field.dart';
import 'package:gymshare/components/widgets/rounded_rectangle_button.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/settings/colors.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();

  late String username;
  late String password;

  String? _validateInput(value) {
    if (value!.length < 4) {
      return 'Enter at least 4 characters.';
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: ScrollConfig(
          child: CustomScrollView(
            slivers: [
              SliverFillRemaining(
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          'Hello again!',
                          style: TextStyle(
                            color: primaryTextColor,
                            fontSize: 32,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 5),
                        CustomTextFormField(
                          labelText: 'Username',
                          validator: _validateInput,
                          onSaved: (value) => setState(() => username = value!),
                        ),
                        CustomTextFormField(
                          obsecureText: true,
                          labelText: 'Password',
                          validator: _validateInput,
                          onSaved: (value) => setState(() => password = value!),
                        ),
                        RoundedRectangleButton(
                          padding: const EdgeInsets.only(top: 10),
                          child: const Text(
                            'Login',
                            style: TextStyle(
                                color: primaryTextColor, fontSize: 16),
                          ),
                          onPress: () {
                            final isValid = _formKey.currentState!.validate();
                            if (isValid) {
                              _formKey.currentState!.save();
                            }
                          },
                        )
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
