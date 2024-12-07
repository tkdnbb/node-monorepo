import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import useGraphData from './hooks/useGraphData';
import useFileUpload from './hooks/useFileUpload';
import usePathFinding from './hooks/usePathFinding';
import MapView from './components/MapView';
import PathFindingForm from './components/PathFindingForm';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import clsx from 'clsx';

export default function App() {
  const {
    currentData,
    activeTab,
    setActiveTab,
    loading: graphLoading,
    error: graphError,
    loadGraphData,
    loadRoadGraphData,
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
        loadGraphData();
      } else {
        loadRoadGraphData();
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
  const fullTabClassName = clsx(classNames.tab, {[classNames.activeTab]: activeTab === 'full'}, {'bg-gray-300': activeTab === 'road'});
  const roadTabClassName = clsx(classNames.tab, {[classNames.activeTab]: activeTab === 'road'}, {'bg-gray-300': activeTab === 'full'});
  console.log(fullTabClassName, "---", roadTabClassName);
  return (
    <GestureHandlerRootView className={classNames.container}>
      <ScrollView className={classNames.scrollView}>
        <View className={classNames.header}>
          <Text className={classNames.title}>Tokyo International Exhibition Center Navigator</Text>
        </View>

        <View className={classNames.content}>
          <View className={classNames.tabContainer}>
            <TouchableOpacity
              className={fullTabClassName}
              onPress={() => setActiveTab('full')}
            >
              <Text className={clsx(classNames.tabText, {[classNames.activeTabText]: activeTab === 'full'})}>
                Full Graph
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={roadTabClassName}
              onPress={() => setActiveTab('road')}
            >
              <Text className={clsx(classNames.tabText, {[classNames.activeTabText]: activeTab === 'road'})}>
                Road Graph
              </Text>
            </TouchableOpacity>
          </View>

          <View className={classNames.uploadSection}>
            <Text className={classNames.sectionTitle}>Upload Floor Plan</Text>
            <TouchableOpacity
              className={classNames.button}
              onPress={pickImage}
              disabled={uploadLoading}
            >
              <Text className={classNames.buttonText}>Select Image</Text>
            </TouchableOpacity>

            {imageUri && (
              <View className={classNames.imagePreview}>
                <Text>Image selected</Text>
              </View>
            )}

            <View className={classNames.inputContainer}>
              <Text>Max Contain:</Text>
              <TextInput
                className={classNames.input}
                value={maxContain.toString()}
                onChangeText={(text) => setMaxContain(parseInt(text) || 2)}
                keyboardType="numeric"
                editable={!uploadLoading}
              />
            </View>

            <TouchableOpacity
              className={classNames.button}
              onPress={() => handleUpload()}
              disabled={!imageUri || uploadLoading}
            >
              <Text className={classNames.buttonText}>Upload</Text>
            </TouchableOpacity>

            {loading && (
              <ActivityIndicator size="large" color="#0000ff" />
            )}

            {error && (
              <Text className={classNames.errorText}>{error}</Text>
            )}
          </View>

          {currentData && (
            <View className={classNames.mapContainer}>
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

// 使用 nativewind 重写样式
const classNames = {
  container: 'flex-1',
  scrollView: 'flex-1 bg-gray-100',
  header: 'p-5 bg-white border-b border-gray-300',
  title: 'text-2xl font-bold text-gray-800',
  content: 'p-5',
  tabContainer: 'flex-row mb-5',
  tab: 'flex-1 p-2.5 items-center mx-1.25 rounded',
  activeTab: 'bg-blue-500',
  tabText: 'text-gray-800',
  activeTabText: 'text-white',
  uploadSection: 'bg-white p-5 rounded-lg mb-5',
  sectionTitle: 'text-lg font-semibold mb-3.75',
  button: 'bg-blue-500 p-3 rounded items-center my-2.5',
  buttonText: 'text-white text-lg',
  imagePreview: 'my-2.5 p-2.5 bg-gray-200 rounded',
  inputContainer: 'flex-row items-center my-2.5',
  input: 'ml-2.5 p-2 border border-gray-300 rounded w-25',
  errorText: 'text-red-500 mt-2.5',
  mapContainer: 'h-212.5 mt-5',
  loadingContainer: 'h-150 justify-center items-center',
};
