import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import useGraphData from './hooks/useGraphData';
import useFileUpload from './hooks/useFileUpload';
import usePathFinding from './hooks/usePathFinding';
import { fetchGraphData, fetchRoadGraphData } from './services/api';
import MapView from './components/MapView';
import PathFindingForm from './components/PathFindingForm';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const {
    currentData,
    activeTab,
    setActiveTab,
    loading: graphLoading,
    error: graphError,
  } = useGraphData();

  const {
    imageUri,
    loading: uploadLoading,
    error: uploadError,
    maxContain,
    setMaxContain,
    pickImage,
    handleUpload,
  } = useFileUpload({
    activeTab,
    onUploadSuccess: (data) => {
      if (activeTab === 'full') {
        fetchGraphData();
      } else {
        fetchRoadGraphData();
      }
    },
  });

  const {
    selectedPath,
    pathPoints,
    error: pathError,
    handlePathFind,
  } = usePathFinding(currentData ?? { nodes: [], lines: [] });

  const error = uploadError || graphError || pathError;
  const loading = uploadLoading || graphLoading;

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Tokyo International Exhibition Center Navigator</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'full' && styles.activeTab]}
              onPress={() => setActiveTab('full')}
            >
              <Text style={[styles.tabText, activeTab === 'full' && styles.activeTabText]}>
                Full Graph
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'road' && styles.activeTab]}
              onPress={() => setActiveTab('road')}
            >
              <Text style={[styles.tabText, activeTab === 'road' && styles.activeTabText]}>
                Road Graph
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.uploadSection}>
            <Text style={styles.sectionTitle}>Upload Floor Plan</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={pickImage}
              disabled={uploadLoading}
            >
              <Text style={styles.buttonText}>Select Image</Text>
            </TouchableOpacity>

            {imageUri && (
              <View style={styles.imagePreview}>
                <Text>Image selected</Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text>Max Contain:</Text>
              <TextInput
                style={styles.input}
                value={maxContain.toString()}
                onChangeText={(text) => setMaxContain(parseInt(text) || 2)}
                keyboardType="numeric"
                editable={!uploadLoading}
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleUpload()}
              disabled={!imageUri || uploadLoading}
            >
              <Text style={styles.buttonText}>Upload</Text>
            </TouchableOpacity>

            {loading && (
              <ActivityIndicator size="large" color="#0000ff" />
            )}

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </View>

          {currentData && (
            <View style={styles.mapContainer}>
              <MapView
                graphData={currentData}
                selectedPath={selectedPath}
                pathPoints={pathPoints}
              />
              <PathFindingForm 
                currentData={currentData}
                onSubmit={(start, end) => {
                  handlePathFind(start, end);
                }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  uploadSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreview: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    marginLeft: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: 100,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  mapContainer: {
    height: 850,
    marginTop: 20,
  },
  loadingContainer: {
    height: 600,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
