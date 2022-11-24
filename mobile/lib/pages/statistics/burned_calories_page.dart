import 'package:flutter/material.dart';
import 'package:gymshare/components/widgets/date_picker_field.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/pages/statistics/bar_chart.dart';
import 'package:gymshare/settings/colors.dart';

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

  void onDatePicked([DateTime? dateTime]) {
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
      child: ScrollConfig(
        child: SingleChildScrollView(
          child: Column(
            children: [
              Form(
                key: _formKey,
                child: CustomDatePickerFormField(
                  day: false,
                  controller: _controller,
                  onDatePicked: onDatePicked,
                ),
              ),
              const BarChartSample(),
              const SizedBox(height: 20),
              const Text(
                'History',
                style: TextStyle(color: primaryTextColor, fontSize: 22),
              ),
              const SizedBox(height: 10),
              const BurnedCaloriesTile(date: '30-11-2022', caloriesBurned: 520),
              const BurnedCaloriesTile(date: '29-11-2022', caloriesBurned: 435),
              const BurnedCaloriesTile(date: '28-11-2022', caloriesBurned: 289),
              const BurnedCaloriesTile(date: '27-11-2022', caloriesBurned: 552),
            ],
          ),
        ),
      ),
    );
  }
}

class BurnedCaloriesTile extends StatelessWidget {
  final String date;
  final num caloriesBurned;

  const BurnedCaloriesTile({
    Key? key,
    required this.date,
    required this.caloriesBurned,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5.0),
      child: Container(
        height: 60,
        width: double.infinity,
        decoration: const BoxDecoration(
          borderRadius: BorderRadius.all(Radius.circular(5)),
          color: quaternaryColor,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            Text(
              date,
              style: const TextStyle(color: primaryTextColor, fontSize: 22),
            ),
            Text(
              '$caloriesBurned kcal',
              style: const TextStyle(color: primaryTextColor, fontSize: 22),
            ),
          ],
        ),
      ),
    );
  }
}
