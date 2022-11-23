import 'package:flutter/material.dart';
import 'package:gymshare/api/models/exercise.dart';
import 'package:gymshare/api/models/statistic_exercise.dart';
import 'package:gymshare/components/widgets/date_picker_field.dart';
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

  List<StatisticExercise> stats = [
    StatisticExercise(
      id: 1,
      dateTime: DateTime.now(),
      userId: 1,
      repeats: 10,
      exercise: Exercise(
        id: 1,
        title: 'Push ups',
        difficulty: 3,
        caloriesBurnRate: 10,
        exerciseType: 'With own weight',
        description: '',
        thumbnailUrl: '',
        videoUrl: '',
      ),
    ),
    StatisticExercise(
      id: 2,
      dateTime: DateTime.now(),
      userId: 1,
      repeats: 10,
      weight: 100,
      exercise: Exercise(
        id: 1,
        title: 'Deadlift',
        difficulty: 3,
        caloriesBurnRate: 10,
        exerciseType: 'With weight',
        description: '',
        thumbnailUrl: '',
        videoUrl: '',
      ),
    ),
    StatisticExercise(
      id: 3,
      dateTime: DateTime.now(),
      userId: 1,
      time: 100,
      exercise: Exercise(
        id: 1,
        title: 'Running',
        difficulty: 3,
        caloriesBurnRate: 10,
        exerciseType: 'With own weight',
        description: '',
        thumbnailUrl: '',
        videoUrl: '',
      ),
    ),
    StatisticExercise(
      id: 3,
      dateTime: DateTime.now(),
      userId: 1,
      time: 100,
      exercise: Exercise(
        id: 1,
        title: 'Lateral rises',
        difficulty: 3,
        caloriesBurnRate: 10,
        exerciseType: 'With own weight',
        description: '',
        thumbnailUrl: '',
        videoUrl: '',
      ),
    ),
    StatisticExercise(
      id: 3,
      dateTime: DateTime.now(),
      userId: 1,
      time: 100,
      exercise: Exercise(
        id: 1,
        title: 'Bench press',
        difficulty: 3,
        caloriesBurnRate: 10,
        exerciseType: 'With own weight',
        description: '',
        thumbnailUrl: '',
        videoUrl: '',
      ),
    ),
    StatisticExercise(
      id: 3,
      dateTime: DateTime.now(),
      userId: 1,
      time: 100,
      exercise: Exercise(
        id: 1,
        title: 'Dumbell press',
        difficulty: 3,
        caloriesBurnRate: 10,
        exerciseType: 'With own weight',
        description: '',
        thumbnailUrl: '',
        videoUrl: '',
      ),
    ),
  ];

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
      child: Form(
        key: _formKey,
        child: Column(
          children: [
            CustomDatePickerFormField(
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
            Expanded(
              child: ListView.builder(
                itemCount: stats.length,
                itemBuilder: (context, index) =>
                    ExerciseHistoryTile(item: stats[index]),
              ),
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

  String formatDate(DateTime dateTime) =>
      '${dateTime.day.toString().padLeft(2, '0')}.${dateTime.month.toString().padLeft(2, '0')}.${dateTime.year} - ${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Container(
        color: quaternaryColor,
        child: Row(
          children: [
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
            Expanded(
              child: ExpansionTile(
                title: Padding(
                  padding: const EdgeInsets.all(0.0),
                  child: SingleChildScrollView(
                    child: Column(
                      mainAxisSize: MainAxisSize.max,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          formatDate(item.dateTime),
                          style:
                              const TextStyle(color: Colors.grey, fontSize: 12),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          item.exercise.title,
                          style: const TextStyle(
                            color: primaryTextColor,
                          ),
                        )
                      ],
                    ),
                  ),
                ),
                children: [
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(10),
                    color: secondaryColor,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (item.repeats != null)
                          Text(
                            'Repeats: ${item.repeats}',
                            style: const TextStyle(color: primaryTextColor),
                          ),
                        if (item.weight != null)
                          Text(
                            'Weight: ${item.weight}',
                            style: const TextStyle(color: primaryTextColor),
                          ),
                        if (item.time != null)
                          Text(
                            'Time: ${item.time}',
                            style: const TextStyle(color: primaryTextColor),
                          ),
                      ],
                    ),
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
