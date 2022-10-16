import 'package:email_validator/email_validator.dart';
import 'package:flutter/material.dart';
import 'package:gymshare/components/widgets/custom_text_form_field.dart';
import 'package:gymshare/components/widgets/rounded_rectangle_button.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/settings/colors.dart';

class SignupPage extends StatefulWidget {
  const SignupPage({Key? key}) : super(key: key);

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final _formKey = GlobalKey<FormState>();

  late String email;
  late String username;
  late String password;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: ScrollConfig(
          child: CustomScrollView(
            slivers: [
              SliverFillRemaining(
                hasScrollBody: false,
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          'Create an account',
                          style: TextStyle(
                            color: primaryTextColor,
                            fontSize: 32,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 5),
                        CustomTextFormField(
                          labelText: 'Email',
                          keyboardType: TextInputType.emailAddress,
                          validator: (value) {
                            if (value != null &&
                                !EmailValidator.validate(value)) {
                              return 'Enter a valid email address.';
                            }
                            return null;
                          },
                          onSaved: (value) => setState(() => email = value!),
                        ),
                        CustomTextFormField(
                          labelText: 'Username',
                          validator: (value) {
                            if (value!.length < 4) {
                              return 'Enter at least 4 characters.';
                            }
                            return null;
                          },
                          onSaved: (value) => setState(() => username = value!),
                        ),
                        CustomTextFormField(
                          obsecureText: true,
                          labelText: 'Password',
                          keyboardType: TextInputType.visiblePassword,
                          validator: (value) {
                            RegExp validPasswordRegExp = RegExp(
                                r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$');
                            if (value != null &&
                                !validPasswordRegExp.hasMatch(value)) {
                              return 'Password should have:\n'
                                  '     - minimum eight characters,\n'
                                  '     - at least one uppercase letter,\n'
                                  '     - one lowercase letter,\n'
                                  '     - one number.';
                            }
                            return null;
                          },
                          onSaved: (value) => setState(() => password = value!),
                        ),
                        RoundedRectangleButton(
                          padding: const EdgeInsets.only(top: 10),
                          child: const Text(
                            'Signup',
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
