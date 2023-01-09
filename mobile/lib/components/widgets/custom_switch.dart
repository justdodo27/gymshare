import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class CustomSwitch extends StatefulWidget {
  const CustomSwitch({super.key});

  @override
  State<CustomSwitch> createState() => _CustomSwitchState();
}

class _CustomSwitchState extends State<CustomSwitch> {
  bool light = true;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
      RichText(text: const TextSpan(text: 'Visibility', style: TextStyle(color: Colors.white)),),
      Transform.scale(
      scale: 1,
      child: CupertinoSwitch(
      // This bool value toggles the switch.
      value: light,
      trackColor: const Color.fromARGB(255, 95, 93, 96).withOpacity(0.64),
      thumbColor: CupertinoColors.systemBlue,
      activeColor: const Color.fromARGB(255, 155, 96, 185).withOpacity(0.64),
      onChanged: (bool value) {
        // This is called when the user toggles the switch.
        setState(() {
          light = value;
        });
      },
      )
    ), 
    RichText(text: TextSpan(text: light ? "public" : "hidden", style: const TextStyle(color: Colors.white, fontSize: 12)),),
  ]);
  }
}
