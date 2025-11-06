import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, ScrollView } from 'react-native';

const BASE_URL = 'http://10.0.2.2:3000';

export default function TaskDetailScreen({ route }) {
  const { task } = route.params;

  const handleOpenCV = () => {
    if (task.fileCV) {
      const url = task.fileCV.startsWith('/uploads') ? `${BASE_URL}${task.fileCV}` : task.fileCV;
      Linking.openURL(url);
    } else {
      alert('⚠️ Không có file CV nào được tải lên');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image
          source={
            task.avatar
              ? { uri: task.avatar.startsWith('/uploads') ? `${BASE_URL}${task.avatar}` : task.avatar }
              : { uri: 'https://via.placeholder.com/100' }
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>{task.name}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Giới tính:</Text>
          <Text style={styles.value}>{task.gender}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Công việc:</Text>
          <Text style={styles.value}>{task.job}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Vị trí:</Text>
          <Text style={styles.value}>{task.position}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Ngày tạo:</Text>
          <Text style={styles.value}>{new Date(task.createdAt).toLocaleString()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Trạng thái:</Text>
          <Text style={[styles.value, task.completed ? styles.completed : styles.pending]}>
            {task.completed ? '✅ Hoàn thành' : '⌛ Chưa hoàn thành'}
          </Text>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleOpenCV}>
          <Text style={styles.btnText}>📄 Xem file CV</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontWeight: '600',
    width: 100,
  },
  value: {
    flex: 1,
    color: '#555',
  },
  completed: { color: '#4CAF50', fontWeight: 'bold' },
  pending: { color: '#FF9800', fontWeight: 'bold' },
  btn: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
