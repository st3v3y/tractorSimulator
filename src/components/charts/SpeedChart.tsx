import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface GpsDataPoint {
  lat: number;
  lng: number;
  speed?: number;
  timestamp?: number;
}

interface SpeedChartProps {
  gpsData: GpsDataPoint[];
}

export const SpeedChart = ({ gpsData }: SpeedChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<am5.Root | null>(null);
  const seriesRef = useRef<am5xy.LineSeries | null>(null);

  // Determine if we have timestamps
  const hasTimestamps = gpsData.length > 0 && gpsData[0].timestamp;
  // Calculate cumulative distance for tooltip
  let totalDistance = 0;
  const chartData = gpsData.map((point, idx, arr) => {
    const time = hasTimestamps ? point.timestamp || 0 : idx;
    let distance = 0;
    if (idx > 0) {
      const prev = arr[idx - 1];
      const R = 6371;
      const dLat = ((point.lat - prev.lat) * Math.PI) / 180;
      const dLng = ((point.lng - prev.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((prev.lat * Math.PI) / 180) *
          Math.cos((point.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      distance = R * c;
      totalDistance += distance;
    }
    return {
      time,
      speed: point.speed || 0,
      distance: totalDistance,
    };
  });

  useLayoutEffect(() => {
    if (!chartRef.current) return;
    if (rootRef.current) rootRef.current.dispose();
    let root = am5.Root.new(chartRef.current);
    // Hide amCharts logo
    if (root._logo) root._logo.dispose();
    rootRef.current = root;
    root.setThemes([am5themes_Animated.new(root)]);
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: false,
        wheelX: 'panX',
        wheelY: 'zoomX',
        paddingTop: 10,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
      })
    );

    let xAxis;
    if (hasTimestamps) {
      xAxis = chart.xAxes.push(
        am5xy.DateAxis.new(root, {
          baseInterval: { timeUnit: 'second', count: 1 },
          renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 80 }),
          tooltipDateFormat: 'HH:mm:ss',
          dateFormats: { second: 'HH:mm:ss', minute: 'HH:mm:ss', hour: 'HH:mm:ss' },
          periodChangeDateFormats: { second: 'HH:mm:ss', minute: 'HH:mm:ss', hour: 'HH:mm:ss' },
        })
      );
      xAxis
        .get('renderer')
        .labels.template.setAll({
          fontSize: 10,
          paddingTop: 0,
          paddingBottom: 0,
          maxWidth: 60,
          oversizedBehavior: 'truncate',
          dy: 10,
        });
    }

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, { minGridDistance: 50 }),
        numberFormat: '#,###.0',
        maxPrecision: 1,
      })
    );
    yAxis
      .get('renderer')
      .labels.template.setAll({
        fontSize: 10,
        paddingLeft: 0,
        paddingRight: 0,
        maxWidth: 40,
        oversizedBehavior: 'truncate',
      });

    let series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: 'Speed',
        xAxis,
        yAxis,
        valueYField: 'speed',
        valueXField: 'time',
        stroke: am5.color('#22c55e'),
      })
    );

    series.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 2,
          fill: am5.color('#c3f3d3'),
          stroke: am5.color('#22c55e'),
          strokeWidth: 1,
          interactive: true,
          tooltipText:
            "[bold]Speed:[/] {valueY.formatNumber('#,##0.00')} km/h\n{valueX.formatDate('HH:mm:ss')}",
        }),
      })
    );

    series.data.setAll(chartData);
    seriesRef.current = series;
    chart.appear(500, 50);
    return () => {
      root.dispose();
    };
  }, []);

  useLayoutEffect(() => {
    if (seriesRef.current) {
      seriesRef.current.data.setAll(chartData);
    }
  }, [gpsData]);

  return <div ref={chartRef} style={{ width: '100%', height: '140px' }} />;
};
