import 'dart:math';

import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:gymshare/api/models/statistic_calories.dart';
import 'package:gymshare/components/widgets/logo.dart';
import 'package:gymshare/settings/colors.dart';

class BarChartSample extends StatefulWidget {
  final List<StatisticCalories> stats;

  const BarChartSample({super.key, required this.stats});

  @override
  State<StatefulWidget> createState() => BarChartSampleState();
}

class BarChartSampleState extends State<BarChartSample> {
  final Color leftBarColor = tertiaryColor;
  final Color rightBarColor = const Color(0xffff5182);

  late double width;
  late double maxValue;
  late List<BarChartGroupData> items;

  int touchedGroupIndex = -1;

  @override
  void initState() {
    super.initState();
    int i = -1;
    items = List<BarChartGroupData>.from(widget.stats.map((entry) {
      i++;
      return makeGroupData(i, entry.calories.toDouble());
    }));

    width = widget.stats.length.toDouble();
    maxValue = widget.stats.map<num>((e) => e.calories).reduce(max).toDouble();
  }

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 1,
      child: Card(
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
        color: quaternaryColor,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Row(
                mainAxisSize: MainAxisSize.min,
                children: const <Widget>[
                  GymShareLogo(size: 70),
                  SizedBox(
                    width: 10,
                  ),
                  Text(
                    'Burned Calories',
                    style: TextStyle(color: Colors.white, fontSize: 22),
                  ),
                  SizedBox(
                    width: 4,
                  ),
                ],
              ),
              const SizedBox(
                height: 38,
              ),
              Expanded(
                child: widget.stats.isNotEmpty
                    ? BarChart(
                        BarChartData(
                          maxY: maxValue,
                          barTouchData: BarTouchData(
                            touchTooltipData: BarTouchTooltipData(
                              tooltipBgColor: Colors.grey,
                              getTooltipItem: (a, b, c, d) => null,
                            ),
                          ),
                          titlesData: FlTitlesData(
                            show: true,
                            rightTitles: AxisTitles(
                              sideTitles: SideTitles(showTitles: false),
                            ),
                            topTitles: AxisTitles(
                              sideTitles: SideTitles(showTitles: false),
                            ),
                            bottomTitles: AxisTitles(
                              sideTitles: SideTitles(
                                showTitles: true,
                                getTitlesWidget: bottomTitles,
                                reservedSize: 42,
                              ),
                            ),
                            leftTitles: AxisTitles(
                              sideTitles: SideTitles(
                                showTitles: true,
                                reservedSize: 35,
                                interval: 1,
                                getTitlesWidget: leftTitles,
                              ),
                            ),
                          ),
                          borderData: FlBorderData(
                            show: false,
                          ),
                          barGroups: items,
                          gridData: FlGridData(show: false),
                        ),
                      )
                    : const Center(
                        child: Text(
                          'No data available :(',
                          style: TextStyle(
                            color: primaryTextColor,
                            fontSize: 25,
                          ),
                        ),
                      ),
              ),
              const SizedBox(
                height: 12,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget leftTitles(double value, TitleMeta meta) {
    const style = TextStyle(
      color: Color(0xff7589a2),
      fontWeight: FontWeight.bold,
      fontSize: 14,
    );
    String text;
    if (value == (maxValue * 0.3).floor() ||
        value == (maxValue * 0.6).floor() ||
        value == (maxValue * 0.9).floor()) {
      text = '${value.toInt()}';
    } else {
      return Container();
    }
    return SideTitleWidget(
      axisSide: meta.axisSide,
      space: 0,
      child: Text(text, style: style),
    );
  }

  Widget bottomTitles(double value, TitleMeta meta) {
    List<String> titles = [];
    for (var i = 1; i < widget.stats.length; i++) {
      if (i == 1 || i == (widget.stats.length / 2).floor()) {
        titles.add('$i'.padLeft(2, '0'));
        continue;
      }
      titles.add('');
    }
    titles.add('${widget.stats.length}');

    final Widget text = Text(
      titles[value.toInt()],
      style: const TextStyle(
        color: Color(0xff7589a2),
        fontWeight: FontWeight.bold,
        fontSize: 14,
      ),
    );

    return SideTitleWidget(
      axisSide: meta.axisSide,
      space: 16, //margin top
      child: text,
    );
  }

  BarChartGroupData makeGroupData(int x, double y1) {
    return BarChartGroupData(
      barsSpace: 1,
      x: x,
      barRods: [
        BarChartRodData(
          toY: y1,
          color: leftBarColor,
          width: 2.0,
        ),
      ],
    );
  }
}
