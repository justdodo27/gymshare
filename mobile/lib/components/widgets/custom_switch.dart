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
    final MaterialStateProperty<Color?> trackColor =
        MaterialStateProperty.resolveWith<Color?>(
      (Set<MaterialState> states) {
        // Track color when the switch is selected.
        if (states.contains(MaterialState.selected)) {
          return const Color.fromARGB(255, 118, 151, 212);
        }
        // Otherwise return null to set default track color
        // for remaining states such as when the switch is
        // hovered, focused, or disabled.
        return null;
      },
    );
    final MaterialStateProperty<Color?> overlayColor =
        MaterialStateProperty.resolveWith<Color?>(
      (Set<MaterialState> states) {
        // Material color when switch is selected.
        if (states.contains(MaterialState.selected)) {
          return const Color.fromARGB(255, 118, 151, 212).withOpacity(0.54);
        }
        // Material color when switch is disabled.
        if (states.contains(MaterialState.disabled)) {
          return Colors.grey.shade400;
        }
        // Otherwise return null to set default material color
        // for remaining states such as when the switch is
        // hovered, or focused.
        return null;
      },
    );

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
