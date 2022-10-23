import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:gymshare/api/models/token.dart';
import 'package:gymshare/components/utils/routes.dart';
import 'package:gymshare/components/widgets/custom_text_form_field.dart';
import 'package:gymshare/components/widgets/rounded_rectangle_button.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/pages/dashboard.dart';
import 'package:gymshare/settings/colors.dart';
import 'package:gymshare/settings/settings.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

Future<bool> gatherToken(String username, String password)
async {
  final response = await http.post(
    Uri.parse(buildUrl('api/token/')),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(<String, String>{
      'username': username,
      'password': password
    }),
  );

  if (response.statusCode == 200) {
    final token = JWT.fromJSON(jsonDecode(response.body));
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('accessToken', token.accessToken);
    await prefs.setString('refreshToken', token.refreshToken);
    await prefs.setBool('isStaff', token.isStaff);
    
    return true;
  } else {
    
    return false;
  }
}

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
                          onPress: () async{
                            final isValid = _formKey.currentState!.validate();
                            if (isValid) {
                              _formKey.currentState!.save();
                              if (await gatherToken(username, password)){
                                Navigator.of(context).push(createPageRouteWithAnimation(const DashboardPage()));
                              } else { 
                                const snackBar = SnackBar(
                                  content: SizedBox(height: 60, child: Center(child: Text('Wrong Credentials!', style: TextStyle(color: primaryTextColor, fontSize: 18),))),
                                  backgroundColor: tertiaryColor,
                                );
                                ScaffoldMessenger.of(context).showSnackBar(snackBar);
                              }
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
