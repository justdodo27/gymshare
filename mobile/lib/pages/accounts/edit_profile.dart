import 'package:flutter/material.dart';
import 'package:gymshare/components/widgets/custom_text_form_field.dart';
import 'package:gymshare/components/widgets/rounded_rectangle_button.dart';
import 'package:gymshare/settings/colors.dart';

class EditProfilePage extends StatefulWidget {
  const EditProfilePage({super.key});

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  final _formKey = GlobalKey();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          backgroundColor: secondaryColor, title: const Text('Edit profile')),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: ListView(
            padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 10),
            children: [
              CustomTextFormField(
                labelText: 'Weight',
                validator: (value) => null,
                onSaved: (value) {},
              ),
              CustomTextFormField(
                labelText: 'Height',
                validator: (value) => null,
                onSaved: (value) {},
              ),
              const SizedBox(height: 20),
              const Divider(color: primaryTextColor),
              RoundedRectangleButton(
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                onPress: () {},
                child: const Text('Save changes'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
