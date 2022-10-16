import 'package:flutter/material.dart';
import 'package:gymshare/settings/colors.dart';

class CustomTextFormField extends StatelessWidget {
  final String labelText;
  final EdgeInsets padding;
  final bool obsecureText;
  final String? Function(String?) validator;
  final void Function(String?) onSaved;
  final TextInputType keyboardType;

  const CustomTextFormField({
    Key? key,
    required this.labelText,
    required this.validator,
    required this.onSaved,
    this.padding = const EdgeInsets.symmetric(vertical: 10.0),
    this.obsecureText = false,
    this.keyboardType = TextInputType.name,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: padding,
      child: TextFormField(
        validator: validator,
        onSaved: onSaved,
        obscureText: obsecureText,
        keyboardType: keyboardType,
        style: const TextStyle(color: primaryTextColor, fontSize: 16),
        decoration: InputDecoration(
          labelText: labelText,
          labelStyle: const TextStyle(color: Colors.grey),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: const BorderSide(color: Colors.white),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: const BorderSide(color: tertiaryColor),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: const BorderSide(color: Colors.red),
          ),
          focusedErrorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
            borderSide: const BorderSide(color: Colors.red),
          ),
        ),
        cursorColor: primaryTextColor,
      ),
    );
  }
}
