import 'package:flutter/material.dart';
import 'package:gymshare/components/utils/helpers.dart';
import 'package:gymshare/components/utils/requests.dart';
import 'package:gymshare/components/utils/routes.dart';
import 'package:gymshare/components/widgets/custom_text_form_field.dart';
import 'package:gymshare/components/widgets/custom_large_text_form.dart';
import 'package:gymshare/components/widgets/app_bar_with_back.dart';
import 'package:gymshare/components/widgets/custom_switch.dart';
import 'package:gymshare/components/widgets/custom_slider.dart';
import 'package:gymshare/components/widgets/logo.dart';
import 'package:gymshare/components/widgets/rounded_rectangle_button.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/components/widgets/seamless_pattern.dart';
import 'package:gymshare/pages/accounts/signup_page.dart';
import 'package:gymshare/pages/dashboard.dart';
import 'package:gymshare/settings/colors.dart';

class EditWorkoutPage extends StatefulWidget {
  const EditWorkoutPage({Key? key}) : super(key: key);

  @override
  State<EditWorkoutPage> createState() => _EditWorkoutPageState();
}

class _EditWorkoutPageState extends State<EditWorkoutPage> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _imageController = TextEditingController();
  final _scrollController = ScrollController();

  late String title;
  late String description;
  late String image;

  bool _buttonDisabled = false;

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _imageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  String? _validateInput(String? value) {
    return value!.isEmpty ? 'Enter at least 1 character.' : null;
  }

  void _logIn() async {
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
                  child: Column(
                    mainAxisSize: MainAxisSize.max,
                    children: [
                      AppBar(
                        backgroundColor: const Color.fromARGB(255, 53, 60, 85),
                        leading: IconButton(
            icon: const Icon(Icons.navigate_before),
            onPressed: () {

            }),
                      title: const Text('Edit workout plan'),
                      toolbarHeight: 70,
                    ),
                      SizedBox(height: size.height * 0.05),
                      CustomTextFormField(
                        padding: const EdgeInsets.all(20.0),
                        controller: _titleController,
                        labelText: 'Title',
                        validator: _validateInput,
                        onSaved: (value) => setState(() => title = value!),
                        onTap: () => scrollToBottom(_scrollController),
                      ),
                      CustomLargeTextFormField(
                        padding: const EdgeInsets.all(20.0),
                        controller: _descriptionController,
                        labelText: 'Description',
                        validator: _validateInput,
                        onSaved: (value) => setState(() => description = value!),
                        onTap: () => scrollToBottom(_scrollController),
                      ),
                      CustomTextFormField(
                        padding: const EdgeInsets.all(20.0),
                        controller: _imageController,
                        labelText: 'Image',
                        validator: _validateInput,
                        onSaved: (value) => setState(() => image = value!),
                        onTap: () => scrollToBottom(_scrollController),
                      ),
                      const SizedBox(height: 30),
                      
  Row(
    mainAxisAlignment: MainAxisAlignment.spaceEvenly, 
    children: const <Widget>[
    CustomSwitch(),
   CustomSlider(),
    
  ],),
    const SizedBox(height: 30),
                      Hero(
                        tag: 'button',
                        child: RoundedRectangleButton(
                          isButtonDisabled: _buttonDisabled,
                          width: size.width * 0.8,
                          padding: const EdgeInsets.only(top: 10),
                          child: const Text(
                            'Save Workout',
                            style: TextStyle(
                                color: primaryTextColor, fontSize: 16),
                          ),
                          onPress: () => _logIn(),
                        ),
                      ),
                      const SizedBox(height: 30),
                      
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
