import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { GraphData, Node } from '../hooks/useGraphData';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

interface MapViewProps {
  graphData: GraphData;
  selectedPath: number[] | null;
  pathPoints: {
    start: number | null;
    end: number | null;
  };
}

interface ScaledNode extends Node {
  scaledX: number;
  scaledY: number;
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export default function MapView({ graphData, selectedPath, pathPoints }: MapViewProps) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const [dimensions] = useState({
    width: Dimensions.get('window').width,
    height: 600,
  });

  // Calculate scaled coordinates
  const calculateScaledCoordinates = useCallback((nodes: Node[]) => {
    if (!nodes?.length) return { scaledNodes: [], bounds: null };

    // Find bounds
    const bounds = nodes.reduce(
      (acc, node) => ({
        minX: Math.min(acc.minX, node.x),
        minY: Math.min(acc.minY, node.y),
        maxX: Math.max(acc.maxX, node.x),
        maxY: Math.max(acc.maxY, node.y),
      }),
      {
        minX: Infinity,
        minY: Infinity,
        maxX: -Infinity,
        maxY: -Infinity,
      }
    );

    // Add padding (10%)
    const rangeX = bounds.maxX - bounds.minX;
    const rangeY = bounds.maxY - bounds.minY;
    const paddingX = rangeX * 0.1;
    const paddingY = rangeY * 0.1;

    bounds.minX -= paddingX;
    bounds.maxX += paddingX;
    bounds.minY -= paddingY;
    bounds.maxY += paddingY;

    // Calculate scale to fit
    const scaleX = dimensions.width / (bounds.maxX - bounds.minX);
    const scaleY = dimensions.height / (bounds.maxY - bounds.minY);
    const baseScale = Math.min(scaleX, scaleY);

    // Scale coordinates
    const scaledNodes = nodes.length ? nodes.map((node) => ({
      ...node,
      scaledX: (node.x - bounds.minX) * baseScale,
      scaledY: (node.y - bounds.minY) * baseScale,
    })) : [];

    return { scaledNodes, bounds, baseScale };
  }, [dimensions]);

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      scale.value = withSpring(Math.max(0.5, Math.min(scale.value, 2)));
    });

  const { scaledNodes } = calculateScaledCoordinates(graphData.nodes);
  const pinchHandler = (
    <GestureDetector gesture={pinchGesture}>
      <Animated.View>
        <AnimatedSvg
          width={dimensions.width}
          height={dimensions.height}
          style={[styles.svg, useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))]}
        >
          <G>
            {/* Draw lines */}
            {graphData.lines?.map(([startIdx, endIdx], index) => {
              const start = scaledNodes[startIdx];
              const end = scaledNodes[endIdx];
              return (
                <Line
                  key={`line-${index}`}
                  x1={start.scaledX}
                  y1={start.scaledY}
                  x2={end.scaledX}
                  y2={end.scaledY}
                  stroke="#666"
                  strokeWidth="1"
                />
              );
            })}

            {/* Draw selected path */}
            {selectedPath && selectedPath.length > 1 && (
              <G>
                {selectedPath.slice(1).map((nodeIdx, index) => {
                  const start = scaledNodes[selectedPath[index]];
                  const end = scaledNodes[nodeIdx];
                  return (
                    <Line
                      key={`path-${index}`}
                      x1={start.scaledX}
                      y1={start.scaledY}
                      x2={end.scaledX}
                      y2={end.scaledY}
                      stroke="#28a745"
                      strokeWidth="3"
                    />
                  );
                })}
              </G>
            )}

            {/* Draw nodes */}
            {scaledNodes.map((node, index) => {
              let nodeColor = '#007bff';
              let nodeSize = 5;

              if (pathPoints?.start === index) {
                nodeColor = '#28a745';
                nodeSize = 7;
              } else if (pathPoints?.end === index) {
                nodeColor = '#dc3545';
                nodeSize = 7;
              }

              return (
                <G key={`node-${index}`}>
                  <Circle
                    cx={node.scaledX}
                    cy={node.scaledY}
                    r={nodeSize}
                    fill={nodeColor}
                  />
                  {node.label && (
                    <SvgText
                      x={node.scaledX}
                      y={node.scaledY - 10}
                      fill="#333"
                      fontSize="12"
                      textAnchor="middle"
                    >
                      {node.label}
                    </SvgText>
                  )}
                </G>
              );
            })}
          </G>
        </AnimatedSvg>
      </Animated.View>
    </GestureDetector>
  );

  if (!graphData?.nodes) {
    return null;
  }

  return (
    <View style={styles.container}>
      {pinchHandler}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  svg: {
    backgroundColor: 'white',
  },
});
