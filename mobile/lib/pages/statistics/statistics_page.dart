import 'package:flutter/material.dart';
import 'package:gymshare/components/widgets/date_picker_field.dart';

class StatisticsPage extends StatefulWidget {
  const StatisticsPage({super.key});

  @override
  State<StatisticsPage> createState() => _StatisticsPageState();
}

class _StatisticsPageState extends State<StatisticsPage> {
  final _formKey = GlobalKey<FormState>();
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                CustomDatePickerFormField(
                  controller: _controller,
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
        ),
      ),
    );
  }
}
