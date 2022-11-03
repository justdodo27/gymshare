import 'package:flutter/material.dart';
import 'package:gymshare/components/widgets/custom_text_form_field.dart';
import 'package:gymshare/components/widgets/rounded_rectangle_button.dart';
import 'package:gymshare/settings/colors.dart';

class ChangePasswordPage extends StatefulWidget {
  const ChangePasswordPage({super.key});

  @override
  State<ChangePasswordPage> createState() => _ChangePasswordPageState();
}

class _ChangePasswordPageState extends State<ChangePasswordPage> {
  final _formKey = GlobalKey();

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
          child: ListView(
            padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 10),
            children: [
              CustomTextFormField(
                obsecureText: true,
                labelText: 'Old password',
                validator: (value) => null,
                onSaved: (value) {},
              ),
              CustomTextFormField(
                obsecureText: true,
                labelText: 'New password',
                validator: (value) => null,
                onSaved: (value) {},
              ),
              const SizedBox(height: 20),
              const Divider(color: primaryTextColor),
              RoundedRectangleButton(
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                onPress: () {},
                child: const Text('Save password'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
