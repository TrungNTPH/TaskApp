import React, { useState } from 'react';
import {
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  Alert,
  ScrollView,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { pick, keepLocalCopy } from '@react-native-documents/picker';
import axios from 'axios';

const AddTaskScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    gender: '',
    job: '',
    position: '',
    avatar: '',
    fileCV: '',
  });
  const dispatch = useDispatch();

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

  const handleSave = async () => {
    if (!form.name || !form.job) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập ít nhất Tên và Công việc');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('id', Date.now().toString());
      formData.append('name', form.name);
      formData.append('gender', form.gender);
      formData.append('job', form.job);
      formData.append('position', form.position);
      formData.append('completed', false);
      formData.append('createdAt', new Date().toISOString());

      if (form.avatar) {
        const fileName = form.avatar.split('/').pop();
        formData.append('avatar', {
          uri: form.avatar,
          type: 'image/jpeg',
          name: fileName || 'photo.jpg',
        });
      }

      const res = await axios.post('http://10.0.2.2:3000/tasks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('✅ Upload thành công:', res.data);
      Alert.alert('Thành công', 'Đã thêm công việc mới');
      navigation.goBack();
    } catch (err) {
      console.log('❌ Upload lỗi:', err.message);
      Alert.alert('Lỗi', 'Không thể tải ảnh lên server');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thêm Công Việc Mới</Text>

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
          <TouchableOpacity style={styles.button} onPress={handleCamera}>
            <Text style={styles.buttonText}>📷 Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleImagePick}>
            <Text style={styles.buttonText}>🖼 Thư viện</Text>
          </TouchableOpacity>
        </View>

        {form.avatar && (
          <Image source={{ uri: form.avatar }} style={styles.avatar} />
        )}

        <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={handlePickFile}>
          <Text style={styles.buttonText}>📄 Chọn file CV</Text>
        </TouchableOpacity>
        {form.fileCV && <Text style={styles.fileText}>File đã chọn: {form.fileCV.split('/').pop()}</Text>}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>💾 Lưu Công Việc</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f5f5f5', flexGrow: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  button: {
    flex: 0.48,
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 12,
    alignSelf: 'center',
  },
  fileText: { marginTop: 8, fontSize: 14, color: '#555', textAlign: 'center' },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default AddTaskScreen;
