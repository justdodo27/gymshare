import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:gymshare/api/models/workout.dart';
import 'package:gymshare/components/utils/helpers.dart';
import 'package:gymshare/components/utils/requests.dart';
import 'package:gymshare/components/widgets/custom_text_form_field.dart';
import 'package:gymshare/components/widgets/custom_large_text_form.dart';
import 'package:gymshare/components/widgets/rounded_rectangle_button.dart';
import 'package:gymshare/components/widgets/scroll_configuration.dart';
import 'package:gymshare/components/widgets/seamless_pattern.dart';
import 'package:gymshare/settings/colors.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';

class AddWorkoutPage extends StatefulWidget {
  final Workout? workout;

  const AddWorkoutPage({Key? key, this.workout}) : super(key: key);

  @override
  State<AddWorkoutPage> createState() => _AddWorkoutPageState();
}

class _AddWorkoutPageState extends State<AddWorkoutPage> {
  final _formKey = GlobalKey<FormState>();
  final _scrollController = ScrollController();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();

  File? _image;
  bool _isPublic = true;
  int _cycles = 1;
  bool _isButtonDisabled = false;
  bool _editMode = false;

  @override
  void initState() {
    super.initState();
    if (widget.workout != null) {
      final workout = widget.workout!;
      _titleController.text = workout.title;
      _descriptionController.text = workout.description ?? '';
      _isPublic = workout.visibility == 'Public' ? true : false;
      _cycles = workout.cycles.toInt();
      _editMode = true;
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Map<String, dynamic> get data {
    final data = <String, dynamic>{
      'id': widget.workout!.id,
      'title': _titleController.text,
      'description': _descriptionController.text,
      'visibility': _isPublic ? 'Public' : 'Hidden',
      'cycles': _cycles,
    };

    if (_image != null) {
      data['image_path'] = _image!.path;
    }
    return data;
  }

  String? _validateInput(String? value) {
    return value!.isEmpty ? 'Enter at least 1 character.' : null;
  }

  Future _pickImage(ImageSource source) async {
    try {
      final img = await ImagePicker().pickImage(source: source);
      if (img == null) return;
      final croppedImage = await _cropImage(imageFile: File(img.path));
      setState(() => _image = croppedImage);
      if (!mounted) return;
      Navigator.of(context).pop();
    } on PlatformException {
      Navigator.of(context).pop();
    }
  }

  Future<File?> _cropImage({required File imageFile}) async {
    CroppedFile? croppedImage =
        await ImageCropper().cropImage(sourcePath: imageFile.path);

    if (croppedImage == null) return null;
    return File(croppedImage.path);
  }

  Future<dynamic> _chooseImageSource() {
    return showModalBottomSheet(
      backgroundColor: secondaryColor,
      context: context,
      builder: (context) => SizedBox(
        height: 150,
        child: Row(
          children: [
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  IconButton(
                    iconSize: 40,
                    splashRadius: 70,
                    onPressed: () => _pickImage(ImageSource.camera),
                    icon: const Icon(Icons.camera_alt),
                  ),
                  const Text(
                    'Take a photo',
                    style: TextStyle(
                      color: primaryTextColor,
                    ),
                  )
                ],
              ),
            ),
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  IconButton(
                    iconSize: 40,
                    splashRadius: 70,
                    onPressed: () => _pickImage(ImageSource.gallery),
                    icon: const Icon(Icons.image),
                  ),
                  const Text(
                    'Choose from gallery',
                    style: TextStyle(
                      color: primaryTextColor,
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

  Future<bool> _createWorkout() async {
    final data = <String, dynamic>{
      'title': _titleController.text,
      'description': _descriptionController.text,
      'visibility': _isPublic ? 'Public' : 'Hidden',
      'cycles': _cycles,
      'image_path': _image!.path,
    };

    return await createWorkout(data, context, mounted);
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SeamlessPattern(
        
        child: Scaffold(
          appBar: AppBar(
            backgroundColor: secondaryColor,
            title: const Text('Create new workout plan'),
          ),
          backgroundColor: Colors.transparent,
          body: Form(
            key: _formKey,
            child: ScrollConfig(
              child: SingleChildScrollView(
                controller: _scrollController,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      CustomTextFormField(
                        padding: const EdgeInsets.symmetric(vertical: 16.0),
                        controller: _titleController,
                        labelText: 'Title',
                        validator: _validateInput,
                      ),
                      CustomLargeTextFormField(
                        padding: const EdgeInsets.symmetric(vertical: 16.0),
                        controller: _descriptionController,
                        labelText: 'Description',
                        validator: _validateInput,
                      ),
                      ((!_editMode && _image == null) ||
                              (_editMode &&
                                  widget.workout!.thumbnailUrl == null &&
                                  _image == null))
                          ? RoundedRectangleButton(
                              padding:
                                  const EdgeInsets.symmetric(vertical: 16.0),
                              borderColor: secondaryColor,
                              onPress: _chooseImageSource,
                              child: const Text('Upload an image'),
                            )
                          : buildThumbnail(),
                      buildSwitches(),
                      if (!_editMode)
                        RoundedRectangleButton(
                          padding: const EdgeInsets.symmetric(vertical: 16.0),
                          isButtonDisabled: _isButtonDisabled,
                          child: const Text(
                            'Save workout',
                            style: TextStyle(
                                color: primaryTextColor, fontSize: 16),
                          ),
                          onPress: () async {
                            final isValid = _formKey.currentState!.validate();
                            if (isValid) {
                              setState(() => _isButtonDisabled = true);
                              if (await _createWorkout()) {
                                Navigator.of(context).pop();
                                ScaffoldMessenger.of(context).showSnackBar(
                                  getInfoSnackBar(
                                    text: 'Workout has been created.',
                                  ),
                                );
                              } else {
                                setState(() => _isButtonDisabled = false);
                              }
                            }
                          },
                        ),
                      if (_editMode)
                        RoundedRectangleButton(
                          padding: const EdgeInsets.symmetric(vertical: 16.0),
                          isButtonDisabled: _isButtonDisabled,
                          child: const Text(
                            'Edit workout',
                            style: TextStyle(
                                color: primaryTextColor, fontSize: 16),
                          ),
                          onPress: () async {
                            final isValid = _formKey.currentState!.validate();
                            if (isValid) {
                              setState(() => _isButtonDisabled = true);
                              if (await editWorkout(data, context, mounted)) {
                                Navigator.of(context).pop(data);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  getInfoSnackBar(
                                    text: 'Workout has been edited.',
                                  ),
                                );
                              } else {
                                setState(() => _isButtonDisabled = false);
                              }
                            }
                          },
                        ),
                      const SizedBox(height: 30),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget buildSwitches() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Transform.scale(
                  scale: 1.5,
                  child: Switch.adaptive(
                    value: _isPublic,
                    activeColor: tertiaryColor,
                    onChanged: (value) => setState(() => _isPublic = value),
                  ),
                ),
                Text(
                  _isPublic ? 'Public' : 'Hidden',
                  style: const TextStyle(color: primaryTextColor),
                ),
              ],
            ),
          ),
          const SizedBox(width: 40),
          Expanded(
            child: Column(
              children: [
                Text(
                  _cycles.toString(),
                  style: const TextStyle(color: primaryTextColor),
                ),
                Slider(
                    activeColor: tertiaryColor,
                    value: _cycles.toDouble(),
                    min: 1,
                    max: 10,
                    onChanged: (value) =>
                        setState(() => _cycles = value.toInt())),
                const Text(
                  'Cycles',
                  style: TextStyle(color: primaryTextColor),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget buildThumbnail() {
    late ImageProvider<Object> img;
    if (_image != null) {
      img = FileImage(_image!);
    } else if (_editMode) {
      img = NetworkImage(widget.workout!.thumbnailUrl!);
    }

    return GestureDetector(
      onTap: () => _chooseImageSource(),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 16),
        child: AspectRatio(
          aspectRatio: 16 / 9,
          child: Container(
            padding: const EdgeInsets.all(5),
            decoration: BoxDecoration(
              border: Border.all(color: tertiaryColor),
              image: DecorationImage(
                image: img,
                fit: BoxFit.cover,
              ),
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        ),
      ),
    );
  }
}
