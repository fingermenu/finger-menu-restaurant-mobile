// @flow

import i18next from 'i18next';

i18next.init({
  interpolation: {
    escapeValue: false,
  },
  lng: 'en',
  resources: {
    en: {
      translation: {
        englishLanguage: { menuItem: 'English' },
        chineseLanguage: { menuItem: '中国' },
        fingerMenu: { title: 'Finger Menu' },
        home: { label: 'Home' },
        homePage: { label: 'Home Page' },
        signUp: { label: 'Sign Up', button: 'Sign Up' },
        signIn: { label: 'Sign In', button: 'Sign In' },
        signOut: { label: 'Sign Out' },
        cancel: { button: 'Cancel' },
        email: { label: 'Email' },
        password: { label: 'Password' },
        retypePassword: { label: 'Retype Password' },
      },
    },
    zh: {
      translation: {
        englishLanguage: { menuItem: 'English' },
        chineseLanguage: { menuItem: '中国' },
        fingerMenu: { title: '手指菜单' },
        home: { label: '主界面' },
        homePage: { label: '主页' },
        signUp: { label: '注册', button: '注册' },
        signIn: { label: '登录', button: '登录' },
        signOut: { label: '注销' },
        cancel: { button: '取消' },
        email: { label: '电子邮件' },
        password: { label: '密码' },
        retypePassword: { label: '重新输入密码' },
      },
    },
  },
});

export default i18next;
