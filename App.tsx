import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';

const App = () => {

  useEffect(() => {
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('📱 Quyền thông báo đã được cấp!');
        const token = await messaging().getToken();
        console.log(token);
      } else {
        console.log('🚫 Người dùng chưa cấp quyền thông báo');
      }
    };

    requestPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('📩 Thông báo nhận được:', remoteMessage);

      // Kiểm tra nếu có nội dung notification
      if (remoteMessage?.notification) {
        const { title, body } = remoteMessage.notification;
        Alert.alert(title || 'Thông báo', body || 'Không có nội dung');
      } else if (remoteMessage?.data) {
        // Nếu là dạng data-only (thường dùng trong background)
        Alert.alert('📦 Data message', JSON.stringify(remoteMessage.data));
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <AppNavigator />
      <Toast />
    </Provider>
  );
};

export default App;
