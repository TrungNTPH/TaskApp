import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, deleteTaskServer, toggleCompleteServer } from '../redux/taskSlice';
import { useNavigation } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { list } = useSelector(state => state.tasks);
  const navigation = useNavigation();
  const BASE_URL = 'http://10.0.2.2:3000';
  const [query, setQuery] = useState('');
  const [gender, setGender] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchTasks());
    });
    return unsubscribe;
  }, [navigation, dispatch]);

  useEffect(() => {
    dispatch(fetchTasks({ query, gender }));
  }, [gender]);

  const handleSearch = () => {
    dispatch(fetchTasks({ query, gender }));
  };

  const handleDelete = (id) => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc muốn xóa công việc này?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => dispatch(deleteTaskServer(id)) },
    ]);
  };

  const handleToggle = (id) => {
    dispatch(toggleCompleteServer(id));
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, item.completed && { opacity: 0.7 }]}>
      <TouchableOpacity onPress={() => {navigation.navigate('TaskDetail', {task: item})}}>
      <Image
        source={
          item.avatar
            ? { uri: `${BASE_URL}${item.avatar}` }
            : { uri: 'https://via.placeholder.com/64' }
        }
        style={styles.avatar}
      />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={[styles.name, item.completed && styles.doneText]}>
          {item.name}
        </Text>
        <Text style={styles.detail}>Giới tính: {item.gender}</Text>
        <Text style={styles.detail}>Công việc: {item.job}</Text>
        <Text style={styles.detail}>Vị trí: {item.position}</Text>

        <View style={styles.checkboxContainer}>
          <CheckBox
            value={item.completed}
            onValueChange={() => handleToggle(item.id)}
            tintColors={{ true: '#4CAF50', false: '#ccc' }}
          />
          <Text style={[styles.detail, item.completed && { color: '#4CAF50' }]}>
            {item.completed ? 'Hoàn thành' : 'Chưa hoàn thành'}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#4CAF50' }]}
            onPress={() => navigation.navigate('EditTask', { task: item })}
          >
            <Text style={styles.btnText}>✏️ Update</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#F44336' }]}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.btnText}>🗑️ Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="🔍 Tìm kiếm..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        style={styles.searchInput}
      />

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Giới tính:</Text>
        <Picker
          selectedValue={gender}
          onValueChange={(value) => setGender(value)}
          style={styles.picker}
        >
          <Picker.Item label="All" value="" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.addButtonText}>+ Thêm Công Việc</Text>
      </TouchableOpacity>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 50 }}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f6f6f6' },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  filterContainer: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  filterLabel: { fontWeight: 'bold', marginBottom: 5, fontSize: 14 },
  picker: { height: 50, width: '100%' },
  addButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 12 },
  info: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  doneText: { textDecorationLine: 'line-through', color: '#888' },
  detail: { fontSize: 14, color: '#555' },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  actions: { flexDirection: 'row', marginTop: 8 },
  btn: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
});

export default HomeScreen;
