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
        yes: { button: 'Yes' },
        no: { button: 'No' },
        fullPayment: { button: 'Full Payment', label: 'Full Payment' },
        splitPayment: { button: 'Split Payment', label: 'Split Payment' },
        resetTable: { button: 'Reset Table', label: 'Reset Table' },
        home: { label: 'Home' },
        homePage: { label: 'Home Page' },
        signUp: { label: 'Sign Up', button: 'Sign Up' },
        signIn: { label: 'Sign In', button: 'Sign In' },
        signOut: { label: 'Sign Out' },
        cancel: { button: 'Cancel' },
        email: { label: 'Email' },
        manageTable: { label: 'Manage Table' },
        table: { label: 'Table {tableName}' },
        password: { label: 'Password' },
        retypePassword: { label: 'Retype Password' },
        waitressMode: { button: 'Waitress Mode' },
        yourOrder: { label: 'Your Order' },
        placeYourOrder: { label: 'Place Your Order' },
        total: { label: 'Total ${total}' },
        discount: { placeholder: 'Discount', label: 'Discount {discount}' },
        eftpos: { placeholder: 'Eftpos', label: 'Eftpos' },
        cash: { placeholder: 'Cash', label: 'Cash' },
        balanceToPay: { label: 'Balance To Pay ${balanceToPay}' },
        noOrdersHaveBeenPlacedYet: { message: 'No orders have been placed yet.' },
        placeOrder: { button: 'Place Order' },
        notes: { placeholder: 'Notes', label: 'Notes' },
        areYouSureToPlaceYourOrderNow: { message: 'Are you sure to place your order now?' },
        areYouSureToRemoveThisOrder: { message: 'Are you sure to remove this order?' },
        areYouSureToResetTable: { message: 'Are you sure to reset table {tableName}?' },
        areYouSureToPayTableInFull: { message: 'Are you sure to pay table table {tableName} in full?' },
        confirmPayment: { message: 'Confirm payment?' },
        payItems: { button: 'Pay {numberOfItems} Items' },
        cancelPayment: { button: 'Cancel Payment' },
        giveToGuest: { button: 'Give to Guest' },
        reserve: { button: 'Reserve' },
        updateReservation: { button: 'Update Reservation' },
        customerName: { placeholder: 'Customer Name' },
        reservationNotes: { placeholder: 'Reservation Notes' },
        enter: { button: 'Enter' },
        addToOrder: { button: 'Add {quantity} to Order' },
        updateOrder: { button: 'Update Order' },
        quantity: { label: 'Quantity' },
        sides: {
          message: 'Sides',
          minSidesMessage: 'At least {minNumberOfSideDishes} sides ',
          maxSidesMessage: 'Up to {maxNumberOfSideDishes} sides',
        },
        viewOrder: { label: 'View Order' },
        numberOfItems: { label: '{numberOfItems} Items' },
        thankYouForPlacingOrder: {
          message:
            'Thank you! The kitchen staff have received your order and are now busy crafting your culinary delights. The waiting staff will collect your tablet shortly.',
        },
        paid: { label: 'Paid' },
        payNow: { button: 'Pay Now' },
        payAndResetTableNow: { button: 'Pay & Reset Table Now' },
        confirm: { button: 'Confirm' },
        confirmAndPrintReceipt: { button: 'Confirm & Print Receipt' },
        dietaryOptions: { label: 'Dietary Options' },
        sizes: { label: 'Sizes' },
        others: { label: 'Others' },
        rePrintForKitchen: { label: 'Re-Print For Kitchen', button: 'Re-Print For Kitchen' },
        areYouSureToRePrintForKitchen: { message: 'Are you sure to re-print for kitchen?' },
        printReceipt: { label: 'Print Receipt', button: 'Print Receipt' },
        areYouSureToPrintReceipt: { message: 'Are you sure to print receipt?' },
        updateCustomers: { button: 'Update Customers' },
        lockScreen: { label: 'Lock screen' },
        dailyReport: { button: 'Daily Report' },
        print: { button: 'Print' },
      },
    },
    zh: {
      translation: {
        englishLanguage: { menuItem: 'English' },
        chineseLanguage: { menuItem: '中国' },
        japaneseLanguage: { menuItem: '日本語' },
        fingerMenu: { title: '手指菜单' },
        yes: { button: '是' },
        no: { button: '没有' },
        fullPayment: { button: '全额付款', label: '全额付款' },
        splitPayment: { button: '分期付款', label: '分期付款' },
        resetTable: { button: '重置表', label: '重置表' },
        home: { label: '主界面' },
        homePage: { label: '主页' },
        signUp: { label: '注册', button: '注册' },
        signIn: { label: '登录', button: '登录' },
        signOut: { label: '注销' },
        cancel: { button: '取消' },
        email: { label: '电子邮件' },
        manageTable: { label: '管理餐桌' },
        table: { label: '表 {tableName}' },
        password: { label: '密码' },
        retypePassword: { label: '重新输入密码' },
        waitressMode: { button: '女服务员模式' },
        yourOrder: { label: '你的订单' },
        placeYourOrder: { label: '下订单' },
        total: { label: '总 ${total}' },
        discount: { placeholder: '折扣', label: '折扣 {discount}' },
        eftpos: { placeholder: 'Eftpos', label: 'Eftpos' },
        cash: { placeholder: '现金', label: '现金' },
        balanceToPay: { label: '余额支付 ${balanceToPay}' },
        noOrdersHaveBeenPlacedYet: { message: '还没有订单。' },
        placeOrder: { button: '下订单' },
        notes: { placeholder: '笔记', label: '笔记' },
        areYouSureToPlaceYourOrderNow: { message: '你确定现在下单吗？' },
        areYouSureToRemoveThisOrder: { message: '你确定删除这个命令吗？' },
        areYouSureToResetTable: { message: '你确定要重置表吗 {tableName}？' },
        areYouSureToPayTableInFull: { message: '你确定完全支付表格 {tableName} 吗？' },
        confirmPayment: { message: '确认付款？' },
        payItems: { button: '支付 {numberOfItems} 项目' },
        cancelPayment: { button: '取消付款' },
        giveToGuest: { button: '给客人' },
        reserve: { button: '保留' },
        updateReservation: { button: '更新预订' },
        customerName: { placeholder: '顾客姓名' },
        reservationNotes: { placeholder: '继续说明' },
        enter: { button: '输入' },
        addToOrder: { button: '添加 {quantity} 来订购' },
        updateOrder: { button: '更新订单' },
        quantity: { label: '数量' },
        sides: {
          message: '你想要配菜？',
          minSidesMessage: '至少{minNumberOfSideDishes} 配菜 ',
          maxSidesMessage: '最多 {maxNumberOfSideDishes} 配菜',
        },
        viewOrder: { label: '查看订单' },
        numberOfItems: { label: '{numberOfItems} 项目' },
        thankYouForPlacingOrder: { message: '谢谢！厨房工作人员已经收到您的订单，现在正忙着制作您的美食。等候的工作人员很快就会收集您的平板电脑。' },
        paid: { label: '付费' },
        payNow: { button: '现在付款' },
        payAndResetTableNow: { button: '现在支付＆重置表' },
        confirm: { button: '确认' },
        confirmAndPrintReceipt: { button: '确认并打印收据' },
        dietaryOptions: { label: '膳食选择' },
        sizes: { label: '尺寸' },
        others: { label: '其他' },
        rePrintForKitchen: { label: '重新打印厨房', button: '重新打印厨房' },
        areYouSureToRePrintForKitchen: { message: '你确定要重新打印厨房吗？' },
        printReceipt: { label: '打印收据', button: '打印收据' },
        areYouSureToPrintReceipt: { message: '你确定打印收据吗？' },
        updateCustomers: { button: '更新客户' },
        lockScreen: { label: '锁屏' },
        dailyReport: { button: '每日报告' },
        print: { button: '打印' },
      },
    },
    ja: {
      translation: {
        englishLanguage: { menuItem: 'English' },
        chineseLanguage: { menuItem: '中国' },
        japaneseLanguage: { menuItem: '日本語' },
        fingerMenu: { title: 'フィンガーメニュー' },
        yes: { button: 'はい' },
        no: { button: 'いいえ' },
        fullPayment: { button: '完全な支払い', label: '完全な支払い' },
        splitPayment: { button: '分割払い', label: '分割払い' },
        resetTable: { button: 'リセットテーブル', label: 'リセットテーブル' },
        home: { label: 'ホーム' },
        homePage: { label: 'ホームページ' },
        signUp: { label: 'サインアップ', button: 'サインアップ' },
        signIn: { label: 'サインアウト', button: 'サインアウト' },
        signOut: { label: 'サインアウト' },
        cancel: { button: 'キャンセル' },
        email: { label: 'Eメール' },
        manageTable: { label: 'テーブルの管理' },
        table: { label: '表 {tableName}' },
        password: { label: 'パスワード' },
        retypePassword: { label: 'パスワードを再入力してください' },
        waitressMode: { button: 'ウェイトレスモード' },
        yourOrder: { label: 'ご注文' },
        placeYourOrder: { label: 'あなたの注文を置く' },
        total: { label: '合計 ${total}' },
        discount: { placeholder: 'ディスカウント', label: 'ディスカウント {discount}' },
        eftpos: { placeholder: 'Eftpos', label: 'Eftpos' },
        cash: { placeholder: '現金', label: '現金' },
        balanceToPay: { label: '支払う残高 ${balanceToPay}' },
        noOrdersHaveBeenPlacedYet: { message: 'まだ注文はありません。' },
        placeOrder: { button: '注文する' },
        notes: { placeholder: 'ノート', label: 'ノート' },
        areYouSureToPlaceYourOrderNow: { message: '今すぐ注文してもよろしいですか？' },
        areYouSureToRemoveThisOrder: { message: 'この注文を削除してもよろしいですか？' },
        areYouSureToResetTable: { message: 'テーブルをリセットしてもよろしいですか {tableName}？' },
        areYouSureToPayTableInFull: { message: 'あなたは完全にテーブルテーブル {tableName} を支払うことは確かですか？' },
        confirmPayment: { message: 'お支払いを確認しますか？' },
        payItems: { button: '有料 {numberOfItems} アイテム' },
        cancelPayment: { button: 'お支払いのキャンセル' },
        giveToGuest: { button: 'ゲストに与える' },
        reserve: { button: '予約' },
        updateReservation: { button: '予約の更新' },
        customerName: { placeholder: '顧客名' },
        reservationNotes: { placeholder: 'リセールノート' },
        enter: { button: '入る' },
        addToOrder: { button: 'オーダーに {quantity} を追加' },
        updateOrder: { button: '注文の更新' },
        quantity: { label: '量' },
        sides: {
          message: 'あなたはいくつかの側面が欲しいですか？',
          minSidesMessage: 'At least {minNumberOfSideDishes} sides ',
          maxSidesMessage: 'Up to {maxNumberOfSideDishes} sides',
        },
        viewOrder: { label: '表示の順序' },
        numberOfItems: { label: '{numberOfItems} アイテム' },
        thankYouForPlacingOrder: {
          message:
            'ありがとうございました！キッチンスタッフがあなたの注文を受け取り、あなたの料理の喜びを作り出すのに忙しいです。待っているスタッフがすぐにあなたのタブレットを収集します。',
        },
        paid: { label: '有料' },
        payNow: { label: '今払う' },
        payAndResetTableNow: { button: 'お支払い＆リセットテーブル今すぐ' },
        confirm: { button: '確認' },
        confirmAndPrintReceipt: { button: '領収書の確認と印刷' },
        dietaryOptions: { label: '食事のオプション' },
        sizes: { label: 'サイズ' },
        others: { label: 'その他' },
        rePrintForKitchen: { label: 'キッチン用に再印刷', button: 'キッチン用に再印刷' },
        areYouSureToRePrintForKitchen: { message: 'キッチン用に再印刷してもよろしいですか？' },
        printReceipt: { label: '領収書を印刷する', button: '領収書を印刷する' },
        areYouSureToPrintReceipt: { message: '領収書を印刷してもよろしいですか？' },
        updateCustomers: { button: '顧客を更新する' },
        lockScreen: { label: 'ロック画面' },
        dailyReport: { button: '日報' },
        print: { button: '印刷する' },
      },
    },
  },
});

export default i18next;
