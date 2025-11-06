import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { updateTask, deleteTask } from '../redux/taskSlice';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { pick, keepLocalCopy } from '@react-native-documents/picker';
import axios from 'axios';

const BASE_URL = 'http://10.0.2.2:3000';

const EditTaskScreen = ({ route, navigation }) => {
  const { task } = route.params;
  const dispatch = useDispatch();
  const [form, setForm] = useState({ ...task });

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, res => {
      if (res.assets && res.assets.length > 0) {
        setForm({ ...form, avatar: res.assets[0].uri });
      }
    });
  };

  const handleCamera = () => {
    launchCamera({ mediaType: 'photo' }, res => {
      if (res.assets && res.assets.length > 0) {
        setForm({ ...form, avatar: res.assets[0].uri });
      }
    });
  };

  const handlePickFile = async () => {
    try {
      const [file] = await pick({ type: ['application/pdf', 'application/msword'] });
      const [localFile] = await keepLocalCopy({
        files: [{ uri: file.uri, fileName: file.name }],
        destination: 'documentDirectory',
      });
      setForm({ ...form, fileCV: localFile.uri });
    } catch (error) {
      if (error.code !== 'DOCUMENT_PICKER_CANCELED') console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key !== 'avatar' && key !== 'fileCV') formData.append(key, form[key]);
      });
      if (form.avatar && !form.avatar.startsWith('/uploads')) {
        formData.append('avatar', { uri: form.avatar, name: 'avatar.jpg', type: 'image/jpeg' });
      }
      if (form.fileCV && !form.fileCV.startsWith('/uploads')) {
        formData.append('fileCV', { uri: form.fileCV, name: 'cv.pdf', type: 'application/pdf' });
      }

      const res = await axios.put(`${BASE_URL}/tasks/${form.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      dispatch(updateTask(res.data));
      Alert.alert('✅ Thành công', 'Cập nhật công việc thành công!');
      navigation.goBack();
    } catch (err) {
      console.error('❌ Lỗi cập nhật:', err);
      Alert.alert('Lỗi', 'Không thể cập nhật công việc.');
    }
  };

  const handleDelete = () => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc muốn xóa công việc này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await axios.delete(`${BASE_URL}/tasks/${form.id}`);
          dispatch(deleteTask(form.id));
          Alert.alert('Đã xóa', 'Công việc đã bị xóa.');
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Chỉnh sửa công việc</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Tên"
          style={styles.input}
          value={form.name}
          onChangeText={t => setForm({ ...form, name: t })}
        />
        <TextInput
          placeholder="Giới tính"
          style={styles.input}
          value={form.gender}
          onChangeText={t => setForm({ ...form, gender: t })}
        />
        <TextInput
          placeholder="Công việc"
          style={styles.input}
          value={form.job}
          onChangeText={t => setForm({ ...form, job: t })}
        />
        <TextInput
          placeholder="Vị trí"
          style={styles.input}
          value={form.position}
          onChangeText={t => setForm({ ...form, position: t })}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleCamera}>
            <Text style={styles.btnText}>📷 Chụp ảnh</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleImagePick}>
            <Text style={styles.btnText}>🖼 Chọn ảnh</Text>
          </TouchableOpacity>
        </View>

        {form.avatar && (
          <Image
            source={{
              uri: form.avatar.startsWith('/uploads') ? `${BASE_URL}${form.avatar}` : form.avatar,
            }}
            style={styles.avatar}
          />
        )}

        <TouchableOpacity style={styles.fileBtn} onPress={handlePickFile}>
          <Text style={styles.btnText}>📄 Chọn file CV</Text>
        </TouchableOpacity>
        {form.fileCV && <Text style={styles.fileText}>File đã chọn: {form.fileCV}</Text>}

        <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
          <Text style={styles.saveText}>💾 Cập nhật</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteText}>🗑️ Xóa công việc</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f7f7f7' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  actionBtn: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  avatar: { width: 120, height: 120, borderRadius: 60, alignSelf: 'center', marginVertical: 10 },
  fileBtn: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  fileText: { textAlign: 'center', color: '#555', marginBottom: 12 },
  saveBtn: {
    backgroundColor: '#FF9800',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  saveText: { color: '#fff', fontWeight: 'bold' },
  deleteBtn: {
    backgroundColor: '#F44336',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteText: { color: '#fff', fontWeight: 'bold' },
});

export default EditTaskScreen;
