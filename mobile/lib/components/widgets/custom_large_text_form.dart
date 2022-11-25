import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:gymshare/settings/colors.dart';

class CustomLargeTextFormField extends StatefulWidget {
  final String labelText;
  final EdgeInsets padding;
  final bool obsecureText;
  final String? Function(String?) validator;
  final void Function(String?)? onSaved;
  final void Function()? onTap;
  final TextInputType keyboardType;
  final TextEditingController? controller;
  final List<TextInputFormatter> inputFormatters;

  const CustomLargeTextFormField({
    Key? key,
    required this.labelText,
    required this.validator,
    this.onSaved,
    this.onTap,
    this.controller,
    this.padding = const EdgeInsets.symmetric(vertical: 10.0),
    this.obsecureText = false,
    this.keyboardType = TextInputType.name,
    this.inputFormatters = const <TextInputFormatter>[],
  }) : super(key: key);

  @override
  State<CustomLargeTextFormField> createState() => _CustomLargeTextFormFieldState();
}

class _CustomLargeTextFormFieldState extends State<CustomLargeTextFormField> {
  late bool isTextVisible;

  @override
  void initState() {
    super.initState();
    isTextVisible = widget.obsecureText;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: widget.padding,
      child: TextFormField(
        onTap: widget.onTap,
        controller: widget.controller,
        validator: widget.validator,
        onSaved: widget.onSaved,
        obscureText: isTextVisible,
        minLines: 3,
        maxLines: 5,
        keyboardType: TextInputType.multiline,
        style: const TextStyle(color: primaryTextColor, fontSize: 16),
        inputFormatters: widget.inputFormatters,
        decoration: InputDecoration(
          suffixIcon: widget.obsecureText
              ? Padding(
                  padding: const EdgeInsets.all(0.0),
                  child: SizedBox(
                    
                    width: 100,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          splashRadius: 20,
                          padding: EdgeInsets.zero,
                          onPressed: () {
                            setState(() => isTextVisible = !isTextVisible);
                          },
                          icon: isTextVisible
                              ? const Icon(Icons.visibility)
                              : const Icon(Icons.visibility_off),
                        ),
                        IconButton(
                          splashRadius: 20,
                          padding: EdgeInsets.zero,
                          onPressed: () {
                            if (widget.controller != null) {
                              setState(() => widget.controller!.text = '');
                            }
                          },
                          icon: const Icon(Icons.close_outlined),
                        ),
                      ],
                    ),
                  ),
                )
              : IconButton(
                  splashRadius: 20,
                  padding: const EdgeInsets.all(10),
                  icon: const Icon(Icons.close_outlined),
                  onPressed: () {
                    if (widget.controller != null) {
                      setState(() => widget.controller!.text = '');
                    }
                  },
                ),
          labelText: widget.labelText,
          labelStyle: const TextStyle(color: Colors.grey),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(5),
            borderSide: const BorderSide(color: Colors.white),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(5),
            borderSide: const BorderSide(color: tertiaryColor),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(5),
            borderSide: const BorderSide(color: Colors.red),
          ),
          focusedErrorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(5),
            borderSide: const BorderSide(color: Colors.red),
          ),
        ),
        cursorColor: primaryTextColor,
      ),
    );
  }
}
