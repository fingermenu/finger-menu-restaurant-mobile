// @flow

import i18next from 'i18next';

i18next.init({
  interpolation: {
    escapeValue: false,
  },
  lng: 'en_NZ',
  resources: {
    en_NZ: {
      translation: {
        englishLanguage: { menuItem: 'English' },
        chineseLanguage: { menuItem: '中国' },
        japaneseLanguage: { menuItem: '日本語' },
        fingerMenu: { title: 'Finger Menu' },
        home: { label: 'Home' },
        homePage: { label: 'Home Page' },
        signUp: { label: 'Sign Up', button: 'Sign Up' },
        signIn: { label: 'Sign In', button: 'Sign In' },
        signOut: { label: 'Sign Out' },
        cancel: { button: 'Cancel' },
        email: { label: 'Email' },
        table: {
          manageTable: 'Manage Table',
          setupTable: 'Setup Table',
        },
        password: { label: 'Password' },
        retypePassword: { label: 'Retype Password' },
        waitressMode: { label: 'Waitress Mode' },
      },
    },
    zh: {
      translation: {
        englishLanguage: { menuItem: 'English' },
        chineseLanguage: { menuItem: '中国' },
        japaneseLanguage: { menuItem: '日本語' },
        fingerMenu: { title: '手指菜单' },
        home: { label: '主界面' },
        homePage: { label: '主页' },
        signUp: { label: '注册', button: '注册' },
        signIn: { label: '登录', button: '登录' },
        signOut: { label: '注销' },
        cancel: { button: '取消' },
        email: { label: '电子邮件' },
        table: {
          manageTable: '管理餐桌',
          setupTable: '设置餐桌',
        },
        password: { label: '密码' },
        retypePassword: { label: '重新输入密码' },
        waitressMode: { label: '女服务员模式' },
      },
    },
    jp: {
      translation: {
        englishLanguage: { menuItem: 'English' },
        chineseLanguage: { menuItem: '中国' },
        japaneseLanguage: { menuItem: '日本語' },
        fingerMenu: { title: '手指菜单' },
        home: { label: '主界面' },
        homePage: { label: '主页' },
        signUp: { label: '注册', button: '注册' },
        signIn: { label: '登录', button: '登录' },
        signOut: { label: '注销' },
        cancel: { button: '取消' },
        email: { label: '电子邮件' },
        table: {
          manageTable: '管理餐桌',
          setupTable: '设置餐桌',
        },
        password: { label: '密码' },
        retypePassword: { label: '重新输入密码' },
        waitressMode: { label: 'ウェイトレスモード' },
      },
    },
  },
});

export default i18next;
