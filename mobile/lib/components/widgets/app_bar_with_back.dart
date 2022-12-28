import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class AppBarBack extends StatefulWidget {
  final String appBarTitle;
  final EdgeInsets padding;
  final bool obsecureText;
  final String? Function(String?) validator;
  final void Function(String?)? onSaved;
  final void Function()? onTap;
  final TextInputType keyboardType;
  final TextEditingController? controller;
  final List<TextInputFormatter> inputFormatters;

  const AppBarBack({
    Key? key,
    required this.appBarTitle,
    required this.validator,
    this.onSaved,
    this.onTap,
    this.controller,
    this.padding = const EdgeInsets.symmetric(vertical: 0),
    this.obsecureText = false,
    this.keyboardType = TextInputType.name,
    this.inputFormatters = const <TextInputFormatter>[],
  }) : super(key: key);

  @override
  State<AppBarBack> createState() => _AppBarBackState();
}

class _AppBarBackState extends State<AppBarBack> {
  late bool isTextVisible;

  @override
  void initState() {
    super.initState();
    isTextVisible = widget.obsecureText;
  }

  @override
  Widget build(BuildContext context) {
    return  AppBar(
                      title: const Text('Next page'),
                    );
  }
}


