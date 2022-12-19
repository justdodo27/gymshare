import 'package:flutter/material.dart';
import 'package:gymshare/api/models/exercise.dart';
import 'package:gymshare/api/models/exercise_in_workout.dart';
import 'package:gymshare/components/widgets/custom_text_form_field.dart';
import 'package:gymshare/components/widgets/logo.dart';
import 'package:gymshare/components/widgets/rounded_rectangle_button.dart';
import 'package:gymshare/components/widgets/seamless_pattern.dart';
import 'package:gymshare/settings/colors.dart';
import 'package:gymshare/api/models/api_response.dart';
import 'package:gymshare/components/utils/requests.dart';

class AddExercisePage extends StatefulWidget {
  final int count;
  const AddExercisePage({super.key, required this.count});

  @override
  State<AddExercisePage> createState() => _AddExercisePageState();
}

class _AddExercisePageState extends State<AddExercisePage> {
  late TextEditingController _controller;
  final _timesController = TextEditingController();
  final _repeatsController = TextEditingController();
  final _seriesController = TextEditingController();
  final ScrollController scrollController = ScrollController();

  ApiResponse _apiResponse = ApiResponse(count: 0, results: []);
  List<Exercise> exercises = [];
  Exercise? exercise;
  bool isSearching = true;

  void fetchExercises({bool next = false, String query = ''}) async {
    if (next && _apiResponse.next != null || !next) {
      _apiResponse = await searchExercises(
          context, query, mounted, next ? _apiResponse.next : null);

      exercises.clear();
      setState(() => exercises.addAll(List<Exercise>.from(
          _apiResponse.results.map((w) => Exercise.fromJson(w)))));
    }
  }

  void clearFields() {
    _controller.clear();
    _timesController.clear();
    _repeatsController.clear();
    _seriesController.clear();
  }

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
    _controller.addListener(() {
      if (_controller.text.isEmpty) {
        setState(() {
          exercises.clear();
          isSearching = true;
        });
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _repeatsController.dispose();
    _seriesController.dispose();
    _timesController.dispose();
    scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SeamlessPattern(
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Add exercise'),
          backgroundColor: secondaryColor,
        ),
        backgroundColor: Colors.transparent,
        body: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  const GymShareLogo(),
                  Container(
                    padding: const EdgeInsets.only(top: 20),
                    child: TextFormField(
                      controller: _controller,
                      onChanged: (value) {
                        if (value.isNotEmpty) {
                          fetchExercises(query: value);
                        } else {
                          setState(() {
                            exercises.clear();
                          });
                        }
                      },
                      decoration: InputDecoration(
                          border: const OutlineInputBorder(),
                          labelText: 'Search exercise',
                          suffixIcon: IconButton(
                            onPressed: clearFields,
                            icon: const Icon(Icons.clear),
                          )),
                      style: const TextStyle(color: primaryTextColor),
                    ),
                  ),
                  if (isSearching)
                    SizedBox(
                      height: 100.0,
                      width: double.infinity,
                      child: ListView.builder(
                        controller: scrollController,
                        itemCount: exercises.length,
                        itemBuilder: (context, index) {
                          return GestureDetector(
                            onTap: () {
                              exercise = exercises[index];
                              _controller.text = exercises[index].title;
                              setState(() => isSearching = false);
                            },
                            child: Container(
                              color: surface2,
                              child: Padding(
                                padding: const EdgeInsets.only(
                                    left: 8.0, right: 8.0, top: 10, bottom: 10),
                                child: Text(
                                  exercises[index].title,
                                  style: const TextStyle(
                                      fontSize: 15.0, color: onSurface),
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  if (!isSearching) ...{
                    if (exercise!.exerciseType == 'With time')
                      CustomTextFormField(
                        controller: _timesController,
                        keyboardType: TextInputType.number,
                        labelText: 'Time',
                        validator: (s) => null,
                      )
                    else ...{
                      CustomTextFormField(
                        controller: _repeatsController,
                        keyboardType: TextInputType.number,
                        labelText: 'Repeats',
                        validator: (s) => null,
                      ),
                      CustomTextFormField(
                        controller: _seriesController,
                        keyboardType: TextInputType.number,
                        labelText: 'Series',
                        validator: (s) => null,
                      ),
                    },
                    RoundedRectangleButton(
                      padding: const EdgeInsets.only(top: 5),
                      child: const Text('Add exercise'),
                      onPress: () {
                        final entry = ExerciseInWorkout(
                          id: -1,
                          exercise: exercise!,
                          order: widget.count + 1,
                          repeats: _getFieldValue(_repeatsController),
                          series: _getFieldValue(_seriesController),
                          time: _getFieldValue(_timesController),
                        );
                        Navigator.of(context).pop(entry);
                      },
                    ),
                  },
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  num? _getFieldValue(TextEditingController controller) =>
      controller.text.isNotEmpty ? num.parse(controller.text) : null;
}
