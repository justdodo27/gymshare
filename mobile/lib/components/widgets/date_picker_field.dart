import 'package:flutter/material.dart';
import 'package:gymshare/settings/colors.dart';

class CustomDatePickerFormField extends StatefulWidget {
  final EdgeInsets padding;
  final TextEditingController controller;
  final Function(String) onFieldSubmitted;

  const CustomDatePickerFormField({
    Key? key,
    required this.controller,
    required this.onFieldSubmitted,
    this.padding = const EdgeInsets.symmetric(vertical: 10.0),
  }) : super(key: key);

  @override
  State<CustomDatePickerFormField> createState() =>
      _CustomDatePickerFormFieldState();
}

class _CustomDatePickerFormFieldState extends State<CustomDatePickerFormField> {
  DateTime _selected = DateTime.now();

  String formatDate(DateTime date) =>
      '${date.month.toString().padLeft(2, '0')}/${date.year}';

  @override
  void initState() {
    super.initState();
    widget.controller.text = formatDate(_selected);
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: widget.padding,
      child: TextFormField(
        controller: widget.controller,
        onFieldSubmitted: widget.onFieldSubmitted,
        validator: (value) {
          RegExp validDateRegExp = RegExp(r'^\d+(\/\d+)*$');
          if (value == null ||
              value.length != 7 ||
              !validDateRegExp.hasMatch(value)) {
            return 'Enter valid date in MM/YYYY format.';
          }
          return null;
        },
        style: const TextStyle(color: primaryTextColor, fontSize: 16),
        decoration: InputDecoration(
          prefixIcon: const Icon(Icons.search, color: tertiaryColor),
          suffixIcon: IconButton(
            splashRadius: 20,
            padding: const EdgeInsets.all(10),
            icon: const Icon(Icons.date_range),
            onPressed: () async {
              DateTime? newDate = await showDatePicker(
                context: context,
                initialDate: DateTime.now(),
                firstDate: DateTime(2022, 1, 1),
                lastDate: DateTime.now(),
              );

              if (newDate == null) return;
              setState(() {
                _selected = newDate;
                widget.controller.text = formatDate(_selected);
              });
            },
          ),
          labelText: 'MM/YYYY',
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
