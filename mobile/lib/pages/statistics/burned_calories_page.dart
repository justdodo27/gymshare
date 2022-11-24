import 'package:flutter/material.dart';
import 'package:gymshare/api/models/statistic_calories.dart';
import 'package:gymshare/components/utils/requests.dart';
import 'package:gymshare/components/widgets/date_picker_field.dart';
import 'package:gymshare/components/widgets/logo.dart';
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
  List<StatisticCalories> stats = [];

  void fetchBurnedCaloriesStats() async {
    setState(() => stats.clear());
    final data = await getBurnedCaloriesStats(selectedDate, context, mounted);
    setState(() => stats.addAll(data));
  }

  void onDatePicked([DateTime? dateTime]) {
    if (dateTime != null) {
      selectedDate = dateTime;
    }
    final isValid = _formKey.currentState!.validate();
    if (isValid) fetchBurnedCaloriesStats();
  }

  Iterable<Widget> buildTiles() {
    return stats.map((entry) =>
        BurnedCaloriesTile(date: entry.date, caloriesBurned: entry.calories));
  }

  @override
  void initState() {
    super.initState();
    fetchBurnedCaloriesStats();
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
              if (stats.isNotEmpty) BarChartSample(stats: stats),
              if (stats.isEmpty)
                Column(
                  children: const [
                    SizedBox(height: 80),
                    GymShareLogo(),
                    Text(
                      'No data available',
                      style: TextStyle(color: primaryTextColor, fontSize: 25),
                    )
                  ],
                ),
              const SizedBox(height: 20),
              if (stats.isNotEmpty)
                const Text(
                  'History',
                  style: TextStyle(color: primaryTextColor, fontSize: 22),
                ),
              const SizedBox(height: 10),
              ...buildTiles()
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
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 24),
              child: Text(
                date,
                style: const TextStyle(color: primaryTextColor, fontSize: 22),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(right: 24),
              child: Text(
                '$caloriesBurned kcal',
                style: const TextStyle(color: primaryTextColor, fontSize: 22),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
