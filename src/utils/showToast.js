import Toast from 'react-native-toast-message';

export const showToast = (type, text1, text2 = '') => {
  Toast.show({
    type, // 'success', 'error', 'info'
    text1, // tiêu đề
    text2, // nội dung
    position: 'top',
    visibilityTime: 2000,
    autoHide: true,
    topOffset: 50,
  });
};
