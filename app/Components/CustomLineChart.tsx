import {colors} from 'app/Styles/theme';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {LineChart} from './LineChart';
import {Rect, Text as TextSVG, Svg} from 'react-native-svg';
import {reshapeValues} from 'app/Utils/utilities';
type I_CustomChartProps = {
  chartDimension: {height: number; width: number};
  chartData?: any[];
};
const CustomLineChart = (props: I_CustomChartProps) => {
  const {chartDimension = {height: 400, width: 200}, chartData} = props;
  let [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
  });
  useEffect(() => {
    setTooltipPos({
      x: 0,
      y: 0,
      visible: false,
      value: 0,
    });
  }, [chartData]);
  return (
    <LineChart
      data={{
        labels: [],
        datasets: [
          {
            data: chartData,
          },
        ],
      }}
      width={chartDimension.width + 60} // from react-native
      height={chartDimension.height}
      chartConfig={{
        fillShadowGradient: 'rgba(255, 0, 0,0)',
        fillShadowGradientOpacity: 0,
        backgroundColor: '#e26a00',
        backgroundGradientFrom: '#567BA7',
        backgroundGradientTo: '#567BA7',
        backgroundGradientToOpacity: 0,
        backgroundGradientFromOpacity: 0,

        decimalPlaces: 2, // optional, defaults to 2dp
        color: () => colors.white,

        style: {
          borderRadius: 16,
        },
      }}
      style={styles.chartStyle}
      withDots={true}
      withInnerLines={false}
      withVerticalLabels={false}
      withHorizontalLabels={false}
      withVerticalLines={false}
      withHorizontalLines={false}
      fillColor="blue"
      decorator={() => {
        return tooltipPos.visible ? (
          <View>
            <Svg>
              <Rect
                x={tooltipPos.x - 30}
                y={tooltipPos.y + 10}
                width="70"
                height="30"
              />
              <TextSVG
                x={tooltipPos.x + 5}
                y={tooltipPos.y + 30}
                fill="rgb(0, 0, 238)"
                fontSize="16"
                fontWeight="bold"
                textAnchor="middle">
                {`$${reshapeValues(tooltipPos.value, 4)}`}
              </TextSVG>
            </Svg>
          </View>
        ) : null;
      }}
      onDataPointClick={data => {
        let isSamePoint = tooltipPos.x === data.x && tooltipPos.y === data.y;

        isSamePoint
          ? setTooltipPos(previousState => {
              return {
                ...previousState,
                value: data.value,
                visible: !previousState.visible,
              };
            })
          : setTooltipPos({
              x: data.x,
              value: data.value,
              y: data.y,
              visible: true,
            });
      }}
    />
  );
};

export default CustomLineChart;

const styles = StyleSheet.create({
  chartStyle: {
    alignSelf: 'center',
    paddingRight: 0,
    paddingLeft: 0,
    paddingTop: 5,
  },
});
