import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:gymshare/components/utils/requests.dart';
import 'package:gymshare/settings/settings.dart';
import 'package:http/http.dart' as http;
import 'package:gymshare/components/utils/helpers.dart';
import 'package:gymshare/components/widgets/custom_text_form_field.dart';
import 'package:gymshare/components/widgets/rounded_rectangle_button.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/settings/colors.dart';

class EditProfilePage extends StatefulWidget {
  final String? firstName;
  final String? lastName;
  final int? height;
  final double? weight;

  const EditProfilePage({
    super.key,
    this.firstName,
    this.lastName,
    this.height,
    this.weight,
  });

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  final _formKey = GlobalKey<FormState>();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _heightController = TextEditingController();
  final _weightController = TextEditingController();
  final _scrollController = ScrollController();

  bool _buttonDisabled = false;

  Future<bool> _editProfile() async {
    final token = await getJWT();
    final userId = token.decodedAccessToken['user_id'];

    http.MultipartRequest request = http.MultipartRequest(
      'PATCH',
      Uri.parse(buildUrl('accounts/profiles/$userId/')),
    );
    request.headers['Authorization'] = 'Bearer ${token.accessToken}';
    request.fields['first_name'] = _firstNameController.text;
    request.fields['last_name'] = _lastNameController.text;

    if (_weightController.text.isNotEmpty) {
      request.fields['weight'] = _weightController.text;
    }

    if (_heightController.text.isNotEmpty) {
      request.fields['height'] = _heightController.text;
    }

    final response = await request.send();

    if (response.statusCode == 401) {
      await refreshToken(refresh: token.refreshToken);
      return _editProfile();
    }

    return response.statusCode == 200;
  }

  @override
  void initState() {
    super.initState();
    _firstNameController.text = widget.firstName ?? '';
    _lastNameController.text = widget.lastName ?? '';
    _heightController.text =
        widget.height != null ? widget.height.toString() : '';
    _weightController.text =
        widget.weight != null ? widget.weight.toString() : '';
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _heightController.dispose();
    _weightController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          backgroundColor: secondaryColor, title: const Text('Edit profile')),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: ScrollConfig(
            child: ListView(
              controller: _scrollController,
              padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 10),
              children: [
                CustomTextFormField(
                  controller: _firstNameController,
                  labelText: 'First name',
                  validator: (value) {
                    if (value!.isEmpty) {
                      return 'Please provide your first name.';
                    }
                    return null;
                  },
                  onSaved: (value) {},
                ),
                CustomTextFormField(
                  controller: _lastNameController,
                  labelText: 'Last name',
                  validator: (value) {
                    if (value!.isEmpty) {
                      return 'Please provide your last name.';
                    }
                    return null;
                  },
                  onSaved: (value) {},
                  onTap: () => scrollToBottom(_scrollController),
                ),
                CustomTextFormField(
                  controller: _heightController,
                  labelText: 'Height',
                  validator: (value) => null,
                  onSaved: (value) {},
                  keyboardType: TextInputType.number,
                  inputFormatters: <TextInputFormatter>[
                    FilteringTextInputFormatter.digitsOnly
                  ],
                  onTap: () => scrollToBottom(_scrollController),
                ),
                CustomTextFormField(
                  controller: _weightController,
                  labelText: 'Weight',
                  validator: (value) => null,
                  onSaved: (value) {},
                  keyboardType: TextInputType.number,
                  inputFormatters: <TextInputFormatter>[
                    FilteringTextInputFormatter.allow(RegExp(r'(^\d*\.?\d*)')),
                  ],
                  onTap: () => scrollToBottom(_scrollController),
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
                      if (await _editProfile()) {
                        Navigator.of(context).pop();
                      } else {
                        setState(() => _buttonDisabled = false);
                        ScaffoldMessenger.of(context).showSnackBar(
                          getErrorSnackBar(text: 'Failed to edit profile.'),
                        );
                      }
                    }
                  },
                  child: const Text('Save changes'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
