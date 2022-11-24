import 'package:flutter/material.dart';
import 'package:gymshare/api/models/statistic_exercise.dart';
import 'package:gymshare/components/utils/requests.dart';
import 'package:gymshare/components/widgets/date_picker_field.dart';
import 'package:gymshare/components/widgets/logo.dart';
import 'package:gymshare/settings/colors.dart';

class ExerciseHistoryPage extends StatefulWidget {
  const ExerciseHistoryPage({
    Key? key,
  }) : super(key: key);

  @override
  State<ExerciseHistoryPage> createState() => _ExerciseHistoryPageState();
}

class _ExerciseHistoryPageState extends State<ExerciseHistoryPage> {
  final _formKey = GlobalKey<FormState>();
  final _controller = TextEditingController();
  DateTime selectedDate = DateTime.now();
  List<StatisticExercise> stats = [];

  void fetchExerciseHistory() async {
    stats.clear();
    final history = await getExerciseHistory(selectedDate, context, mounted);
    setState(() => stats.addAll(history));
  }

  void onDatePicked([DateTime? dateTime]) {
    if (dateTime != null) {
      selectedDate = dateTime;
      final isValid = _formKey.currentState!.validate();
      if (isValid) fetchExerciseHistory();
    }
  }

  @override
  void initState() {
    super.initState();
    fetchExerciseHistory();
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
              controller: _controller,
              onDatePicked: onDatePicked,
            ),
            if (stats.isNotEmpty)
              Expanded(
                child: ListView.builder(
                  itemCount: stats.length,
                  itemBuilder: (context, index) =>
                      ExerciseHistoryTile(item: stats[index]),
                ),
              ),
            if (stats.isEmpty)
              Column(
                mainAxisSize: MainAxisSize.min,
                children: const [
                  SizedBox(height: 80),
                  GymShareLogo(),
                  Text(
                    'No data available',
                    style: TextStyle(color: primaryTextColor, fontSize: 25),
                  )
                ],
              ),
          ],
        ),
      ),
    );
  }
}

class ExerciseHistoryTile extends StatelessWidget {
  final StatisticExercise item;

  const ExerciseHistoryTile({
    Key? key,
    required this.item,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Container(
        color: quaternaryColor,
        child: ExpansionTile(
          tilePadding: const EdgeInsets.only(right: 10),
          title: Row(
            children: [
              if (item.thumbnailUrl == null)
                Container(
                  color: Colors.white,
                  width: 140,
                  height: 90,
                  child: const Center(
                    child: Icon(
                      Icons.image_not_supported,
                      color: primaryColor,
                    ),
                  ),
                ),
              if (item.thumbnailUrl != null)
                Image.network(
                  item.thumbnailUrl!,
                  width: 140,
                  height: 90,
                  fit: BoxFit.fill,
                ),
              const SizedBox(width: 8),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(0.0),
                  child: SingleChildScrollView(
                    child: Column(
                      mainAxisSize: MainAxisSize.max,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          item.title,
                          style: const TextStyle(
                            color: primaryTextColor,
                          ),
                        )
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          children: List<EntryTile>.from(
              item.entries.map((entry) => EntryTile(entry: entry))),
        ),
      ),
    );
  }
}

class EntryTile extends StatelessWidget {
  final Entry entry;

  const EntryTile({
    Key? key,
    required this.entry,
  }) : super(key: key);

  String formatDate(DateTime dateTime) =>
      '${dateTime.day.toString().padLeft(2, '0')}.${dateTime.month.toString().padLeft(2, '0')}.${dateTime.year} - ${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(10),
      color: secondaryColor,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            formatDate(entry.dateTime),
            style: const TextStyle(color: Colors.grey, fontSize: 12),
          ),
          if (entry.repeats != null)
            Text(
              'Repeats: ${entry.repeats}',
              style: const TextStyle(color: primaryTextColor),
            ),
          if (entry.weight != null)
            Text(
              'Weight: ${entry.weight}kg',
              style: const TextStyle(color: primaryTextColor),
            ),
          if (entry.time != null)
            Text(
              'Time: ${entry.time}s',
              style: const TextStyle(color: primaryTextColor),
            ),
          const Divider(thickness: 2),
        ],
      ),
    );
  }
}
