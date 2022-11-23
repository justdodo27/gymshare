import 'package:flutter/material.dart';
import 'package:gymshare/components/widgets/date_picker_field.dart';

class BurnedCaloriesPage extends StatefulWidget {
  const BurnedCaloriesPage({
    Key? key,
  }) : super(key: key);

  @override
  State<BurnedCaloriesPage> createState() => _BurnedCaloriesPageState();
}

class _BurnedCaloriesPageState extends State<BurnedCaloriesPage> {
  final _formKey = GlobalKey<FormState>();
  final _controller = TextEditingController();
  DateTime selectedDate = DateTime.now();

  onDatePicked([DateTime? dateTime]) {
    if (dateTime != null) {
      selectedDate = dateTime;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
      child: Form(
        key: _formKey,
        child: Column(
          children: [
            CustomDatePickerFormField(
              day: false,
              controller: _controller,
              onDatePicked: onDatePicked,
              onFieldSubmitted: (value) {
                final isValid = _formKey.currentState!.validate();
                if (isValid) {
                  print('Valid');
                } else {
                  print('Not valid');
                }
              },
            ),
          ],
        ),
      ),
    );
  }
}
