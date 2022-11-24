import 'package:flutter/material.dart';


class CustomSlider extends StatefulWidget {
  const CustomSlider({super.key});

  @override
  State<CustomSlider> createState() => _CustomSliderState();
}

class _CustomSliderState extends State<CustomSlider> {
  double _currentSliderValue = 20;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
      RichText(text: const TextSpan(text: 'Cycles', style: TextStyle(color: Colors.white)),),
      Row(
      children: [
      Transform.scale(
      scale: 1,
      child: Slider(
      value: _currentSliderValue,
      max: 50,
      divisions: 50,
      label: _currentSliderValue.round().toString(),
      onChanged: (double value) {
        setState(() {
          _currentSliderValue = value;
        });
      },
    )
    ),
    RichText(text:  TextSpan(text: _currentSliderValue.round().toString(), style: const TextStyle(color: Colors.white)),),
      ]),
  ]);
  }
}


