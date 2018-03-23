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
        yourOrder: { label: 'Your Order' },
        areYouSureToPlaceYourOrderNow: { message: 'Are you sure to place your order now?' },
        placeYourOrder: { label: 'Place Your Order' },
        noOrdersHaveBeenPlacedYet: { message: 'No orders have been placed yet.' },
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
        yourOrder: { label: '你的订单' },
        areYouSureToPlaceYourOrderNow: { messsage: '你确定现在下单吗？' },
        placeYourOrder: { label: '下订单' },
        noOrdersHaveBeenPlacedYet: { message: '还没有订单。' },
      },
    },
    jp: {
      translation: {
        englishLanguage: { menuItem: 'English' },
        chineseLanguage: { menuItem: '中国' },
        japaneseLanguage: { menuItem: '日本語' },
        fingerMenu: { title: 'フィンガーメニュー' },
        home: { label: 'ホーム' },
        homePage: { label: '' },
        signUp: { label: 'サインアップ', button: 'サインアップ' },
        signIn: { label: 'サインアウト', button: 'サインアウト' },
        signOut: { label: '' },
        cancel: { button: 'キャンセル' },
        email: { label: 'Eメール' },
        table: {
          manageTable: 'テーブルの管理',
          setupTable: 'セットアップテーブル',
        },
        password: { label: 'パスワード' },
        retypePassword: { label: 'パスワードを再入力してください' },
        waitressMode: { label: 'ウェイトレスモード' },
        yourOrder: { label: 'ご注文' },
        areYouSureToPlaceYourOrderNow: { message: '今すぐ注文してもよろしいですか？' },
        placeYourOrder: { label: 'あなたの注文を置く' },
        noOrdersHaveBeenPlacedYet: { message: 'まだ注文はありません。' },
      },
    },
  },
});

export default i18next;
