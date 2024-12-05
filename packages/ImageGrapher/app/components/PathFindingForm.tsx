import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GraphData } from '../hooks/useGraphData';

interface PathFindingFormProps {
  currentData: GraphData;
  onSubmit: (startPoint: number, endPoint: number) => void;
}

export default function PathFindingForm({ currentData, onSubmit }: PathFindingFormProps) {
  const [startPoint, setStartPoint] = React.useState<string>('');
  const [endPoint, setEndPoint] = React.useState<string>('');

  const handleSubmit = () => {
    if (startPoint && endPoint) {
      onSubmit(parseInt(startPoint), parseInt(endPoint));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Path</Text>
      <View style={styles.form}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Start Point</Text>
          <Picker
            selectedValue={startPoint}
            onValueChange={(itemValue) => setStartPoint(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Start Point" value="" />
            {currentData?.nodes?.map((node, index) => (
              <Picker.Item
                key={`start-${index}`}
                label={node.label || `Point ${index + 1}`}
                value={index.toString()}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Destination</Text>
          <Picker
            selectedValue={endPoint}
            onValueChange={(itemValue) => setEndPoint(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Destination" value="" />
            {currentData?.nodes?.map((node, index) => (
              <Picker.Item
                key={`end-${index}`}
                label={node.label || `Point ${index + 1}`}
                value={index.toString()}
              />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={!startPoint || !endPoint}
        >
          <Text style={styles.buttonText}>Find Path</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  form: {
    gap: 16,
  },
  pickerContainer: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  picker: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    opacity: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
