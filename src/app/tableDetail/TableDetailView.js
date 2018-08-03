// @flow

import { Common } from '@microbusiness/common-javascript';
import Immutable, { List } from 'immutable';
import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { ScrollView, SectionList, Text, TouchableNative, View } from 'react-native';
import PropTypes from 'prop-types';
import { Badge, Button, ButtonGroup, Icon, Input, CheckBox } from 'react-native-elements';
import PopupDialog, { DialogTitle, SlideAnimation } from 'react-native-popup-dialog';
import { translate } from 'react-i18next';
import OrderItemRow from '../orders/OrderItemRow';
import Styles from './Styles';
import { DefaultColor, DefaultStyles, getPopupDialogSizes } from '../../style';
import { TableProp } from './PropTypes';
import config from '../../framework/config';
import OrderHelper from '../../framework/OrderHelper';
import { ListItemSeparator } from '../../components/list';
import SplitPaymentPopupDialogContentView from './SplitPaymentPopupDialogContentView';
import FullPaymentPopupDialogContentView from './FullPaymentPopupDialogContentView';
import ResetTablePopupDialogContentView from './ResetTablePopupDialogContentView';
import RePrintForKitchenPopupDialogContentView from './RePrintForKitchenPopupDialogContentView';
import PrintReceiptPopupDialogContentView from './PrintReceiptPopupDialogContentView';
import DefaultPaymentButtonsView from './DefaultPaymentButtonsView';

class TableDetailView extends Component {
  constructor(props, context) {
    super(props, context);

    this.onGiveToGuestPressedDebounced = debounce(props.onGiveToGuestPressed, config.navigationDelay);
  }

  state = {
    selectedDiscountButtonIndex: 0,
    discount: '',
    discountType: '$',
    selectedOrders: List(),
    isSplitPaymentMode: false,
  };

  getTotal = () => {
    const { isSplitPaymentMode, selectedOrders } = this.state;

    return isSplitPaymentMode ? this.getCalculatedOrderItemsTotal(selectedOrders) : this.getRemainingTotal();
  };

  getBalanceToPayAndDiscount = () => {
    const { discountType } = this.state;
    const total = this.getTotal();
    const discount = this.convertStringDiscountValueToDecimal();

    switch (discountType) {
    case '$': {
      const balanceToPay = discount <= total ? total - discount : total;

      return { balanceToPay, discount: total - balanceToPay };
    }

    case '%': {
      const balanceToPay = discount <= 100 ? (total * (100 - discount)) / 100 : total;

      return { balanceToPay, discount: total - balanceToPay };
    }

    default: {
      return { balanceToPay: total, discount: 0 };
    }
    }
  };

  getCustomerName = (table, customerId) => {
    const customer = table.customers.find(customer => customer.customerId === customerId);

    return customer ? customer.name : '';
  };

  getCalculatedOrderItemsTotal = orderItems =>
    orderItems.reduce(
      (reduction, value) =>
        reduction +
        value.get('quantity') *
          (value.getIn(['menuItemPrice', 'currentPrice']) +
            value.get('orderChoiceItemPrices').reduce((ov, os) => ov + os.getIn(['choiceItemPrice', 'currentPrice']), 0.0)),
      0.0,
    );

  getDiscountTypes = () => ['$', '%'];

  getSelectedDiscountType = discountTypeIndex => this.getDiscountTypes()[discountTypeIndex];

  setResetPopupDialogRef = popupDialog => {
    this.resetPopupDialog = popupDialog;
  };

  setPaidPopupDialogRef = popupDialog => {
    this.paidPopupDialog = popupDialog;
  };

  setSplitPaidPopupDialogRef = popupDialog => {
    this.splitPaidPopupDialog = popupDialog;
  };

  setRePrintForKitchenPopupDialogRef = popupDialog => {
    this.rePrintForKitchenPopupDialog = popupDialog;
  };

  setPrintReceiptPopupDialogRef = popupDialog => {
    this.printReceiptPopupDialog = popupDialog;
  };

  getRemainingTotal = () => {
    const { orders } = this.props;

    return orders.reduce(
      (remainingTotal, order) =>
        remainingTotal +
        this.getCalculatedOrderItemsTotal(
          Immutable.fromJS(order)
            .get('details')
            .filterNot(_ => _.get('paid')),
        ),
      0,
    );
  };

  getDiscountDisplayValue = () => {
    const discount = this.convertStringDiscountValueToDecimal();
    const { discountType } = this.state;

    return discountType === '%' ? (discount ? discount : '0') + discountType : discountType + (discount ? discount.toFixed(2) : '0.00');
  };

  getOrderItems = orderItems => {
    const { table } = this.props;

    return Immutable.fromJS(orderItems)
      .groupBy(item => item.getIn(['customer', 'customerId']))
      .mapEntries(([key, value]) => [
        key,
        {
          data: value.toJS(),
          categoryTitle: this.getCustomerName(table, key),
          categoryKey: key,
        },
      ])
      .sortBy(_ => _.categoryTitle)
      .valueSeq()
      .toJS();
  };

  convertStringDiscountValueToDecimal = () => {
    const { discount } = this.state;

    const discountStr = discount ? discount.trim() : '';
    if (!Common.isDecimal(discountStr)) {
      return 0;
    }

    return parseFloat(discountStr);
  };

  isDiscountValid = () => {
    const discount = this.convertStringDiscountValueToDecimal();
    const { discountType } = this.state;

    switch (discountType) {
    case '$':
      return discount <= this.getTotal();

    case '%':
      return discount <= 100;

    default:
      return false;
    }
  };

  handleResetTableConfirmed = () => {
    const { onResetTablePressed } = this.props;

    this.resetPopupDialog.dismiss();
    onResetTablePressed();
  };

  handleResetTableCancelled = () => {
    this.resetPopupDialog.dismiss();
  };

  handleResetTablePressed = () => this.resetPopupDialog.show();

  handleRePrintForKitchenConfirmed = () => {
    const { onRePrintForKitchen } = this.props;

    this.rePrintForKitchenPopupDialog.dismiss();
    onRePrintForKitchen();
  };

  handleRePrintForKitchenCancelled = () => {
    this.rePrintForKitchenPopupDialog.dismiss();
  };

  handleRePrintForKitchenPressed = () => this.rePrintForKitchenPopupDialog.show();

  handlePrintReceiptConfirmed = () => {
    const { onPrintReceipt } = this.props;

    this.printReceiptPopupDialog.dismiss();
    onPrintReceipt();
  };

  handlePrintReceiptCancelled = () => {
    this.printReceiptPopupDialog.dismiss();
  };

  handlePrintReceiptPressed = () => this.printReceiptPopupDialog.show();

  handleSetTablePaidConfirmed = ({ eftpos, cash }) => {
    const { onSetPaidPressed } = this.props;

    this.paidPopupDialog.dismiss();
    this.setState({ selectedOrders: List() });

    const { discount } = this.getBalanceToPayAndDiscount();

    onSetPaidPressed({ discount, eftpos, cash });
  };

  handleSetTablePaidAndResetConfirmed = ({ eftpos, cash }) => {
    const { onSetPaidAndResetPressed } = this.props;

    this.paidPopupDialog.dismiss();
    this.setState({ selectedOrders: List() });

    const { discount } = this.getBalanceToPayAndDiscount();

    onSetPaidAndResetPressed({ discount, eftpos, cash });
  };

  handleSetTablePaidCancelled = () => {
    this.paidPopupDialog.dismiss();
  };

  handleSetTablePaidPressed = () => {
    const {
      table: {
        tableState: { key },
      },
    } = this.props;

    if (key === 'taken') {
      this.paidPopupDialog.show();
    }
  };

  handleCustomPayPressed = () => {
    this.setState({ isSplitPaymentMode: true });
  };

  handlePayCustomPayPressed = () => {
    this.splitPaidPopupDialog.show();
  };

  handleCancelCustomPayPressed = () => {
    this.setState({ isSplitPaymentMode: false, selectedOrders: List() });
  };

  handleSplitPayConfirmed = ({ eftpos, cash }) => {
    const { onSplitPaidPressed } = this.props;
    const { selectedOrders } = this.state;

    this.splitPaidPopupDialog.dismiss();
    this.setState({ selectedOrders: List() });

    const { discount } = this.getBalanceToPayAndDiscount();

    onSplitPaidPressed({ discount, eftpos, cash }, selectedOrders);
  };

  handleSplitPayConfirmedAndPrintReceipt = ({ eftpos, cash }) => {
    const { selectedOrders } = this.state;
    const { onSplitPaidAndPrintReceiptPressed } = this.props;

    this.splitPaidPopupDialog.dismiss();
    this.setState({ selectedOrders: List() });

    const { discount } = this.getBalanceToPayAndDiscount();

    onSplitPaidAndPrintReceiptPressed({ discount, eftpos, cash }, selectedOrders);
  };

  handlePayCustomCancelled = () => {
    this.splitPaidPopupDialog.dismiss();
  };

  handleOrderSelected = (order, isSelected) => {
    if (isSelected) {
      this.setState(({ selectedOrders: prevSelectedOrders }) => ({ selectedOrders: prevSelectedOrders.push(Immutable.fromJS(order)) }));
    } else {
      this.setState(({ selectedOrders: prevSelectedOrders }) => ({
        selectedOrders: prevSelectedOrders.filterNot(_ => _.get('orderMenuItemPriceId') === order.orderMenuItemPriceId),
      }));
    }
  };

  handleSectionHeaderSelected = (section, isSelected) => {
    if (isSelected) {
      this.setState(({ selectedOrders: prevSelectedOrders }) => ({
        selectedOrders: prevSelectedOrders.merge(Immutable.fromJS(section.data).filterNot(_ => _.get('paid'))),
      }));
    } else {
      this.setState(({ selectedOrders: prevSelectedOrders }) => ({
        selectedOrders: prevSelectedOrders.filterNot(
          _ => section.data.find(order => order.orderMenuItemPriceId === _.get('orderMenuItemPriceId')) !== undefined,
        ),
      }));
    }
  };

  handleDiscountValueChanged = discount => {
    const discountStr = discount ? discount.trim() : '';

    if (!discountStr) {
      this.setState({ discount: '' });
    } else {
      if (!Common.isDecimal(discount)) {
        return;
      }

      this.setState({ discount });
    }
  };

  updateIndex = selectedDiscountButtonIndex => {
    this.setState({ selectedDiscountButtonIndex, discountType: this.getSelectedDiscountType(selectedDiscountButtonIndex) });
  };

  keyExtractor = item => item.id;

  selectedOrdersKeyExtractor = item => item.orderMenuItemPriceId;

  renderSplitPaymentPopupDialog = (slideAnimation, tableName) => {
    const { t } = this.props;
    const popupDialogSize = getPopupDialogSizes();
    const { selectedOrders } = this.state;

    return (
      <PopupDialog
        width={popupDialogSize.width}
        height={popupDialogSize.height}
        dialogTitle={<DialogTitle title={t('splitPayment.label') + ' ' + tableName} />}
        dialogAnimation={slideAnimation}
        ref={this.setSplitPaidPopupDialogRef}
      >
        <SplitPaymentPopupDialogContentView
          total={this.getCalculatedOrderItemsTotal(selectedOrders)}
          discount={this.getDiscountDisplayValue()}
          balanceToPay={this.getBalanceToPayAndDiscount().balanceToPay}
          onPaidButtonPressed={this.handleSplitPayConfirmed}
          onPaidAndPrintButtonPressed={this.handleSplitPayConfirmedAndPrintReceipt}
          onCancelButtonPressed={this.handlePayCustomCancelled}
        />
      </PopupDialog>
    );
  };

  renderResetTablePopupDialog = (slideAnimation, tableName) => {
    const { t } = this.props;
    const popupDialogSize = getPopupDialogSizes();

    return (
      <PopupDialog
        width={popupDialogSize.width}
        height={popupDialogSize.height}
        dialogTitle={<DialogTitle title={t('resetTable.label')} />}
        dialogAnimation={slideAnimation}
        ref={this.setResetPopupDialogRef}
      >
        <ResetTablePopupDialogContentView
          tableName={tableName}
          onResetButtonPressed={this.handleResetTableConfirmed}
          onCancelButtonPressed={this.handleResetTableCancelled}
        />
      </PopupDialog>
    );
  };

  renderFullPaymentPopupDialog = (slideAnimation, tableName) => {
    const { t, canPrintReceipt } = this.props;
    const popupDialogSize = getPopupDialogSizes();

    return (
      <PopupDialog
        width={popupDialogSize.width}
        height={popupDialogSize.height}
        dialogTitle={<DialogTitle title={t('fullPayment.label')} />}
        dialogAnimation={slideAnimation}
        ref={this.setPaidPopupDialogRef}
      >
        <FullPaymentPopupDialogContentView
          tableName={tableName}
          total={this.getRemainingTotal()}
          discount={this.getDiscountDisplayValue()}
          balanceToPay={this.getBalanceToPayAndDiscount().balanceToPay}
          canPrintReceipt={canPrintReceipt}
          onPaidButtonPressed={this.handleSetTablePaidConfirmed}
          onPaidAndResetButtonPressed={this.handleSetTablePaidAndResetConfirmed}
          onCancelButtonPressed={this.handleSetTablePaidCancelled}
        />
      </PopupDialog>
    );
  };

  renderRePrintForKitchenPopupDialog = slideAnimation => {
    const { t } = this.props;
    const popupDialogSize = getPopupDialogSizes();

    return (
      <PopupDialog
        width={popupDialogSize.width}
        height={popupDialogSize.height}
        dialogTitle={<DialogTitle title={t('rePrintForKitchen.label')} />}
        dialogAnimation={slideAnimation}
        ref={this.setRePrintForKitchenPopupDialogRef}
      >
        <RePrintForKitchenPopupDialogContentView
          onPrintButtonPressed={this.handleRePrintForKitchenConfirmed}
          onCancelButtonPressed={this.handleRePrintForKitchenCancelled}
        />
      </PopupDialog>
    );
  };

  renderPrintReceiptPopupDialog = slideAnimation => {
    const { t } = this.props;
    const popupDialogSize = getPopupDialogSizes();

    return (
      <PopupDialog
        width={popupDialogSize.width}
        height={popupDialogSize.height}
        dialogTitle={<DialogTitle title={t('printReceipt.label')} />}
        dialogAnimation={slideAnimation}
        ref={this.setPrintReceiptPopupDialogRef}
      >
        <PrintReceiptPopupDialogContentView
          onPrintButtonPressed={this.handlePrintReceiptConfirmed}
          onCancelButtonPressed={this.handlePrintReceiptCancelled}
        />
      </PopupDialog>
    );
  };

  renderSplitPaymentButtons = () => {
    const { t } = this.props;
    const { selectedOrders } = this.state;

    return (
      <View style={Styles.mainScreenButtonsContainer}>
        <Button
          title={t('payItems.button').replace('{numberOfItems}', selectedOrders.count())}
          disabled={selectedOrders.isEmpty() || !this.isDiscountValid()}
          onPress={this.handlePayCustomPayPressed}
        />
        <Button title={t('cancelPayment.button')} onPress={this.handleCancelCustomPayPressed} />
      </View>
    );
  };

  renderDefaultPaymentButtons = tableState => {
    const { orders, canPrintReceipt, canPrintKitchenOrder } = this.props;

    return (
      <DefaultPaymentButtonsView
        fullPaymentDisabled={tableState.key === 'paid' || orders.length === 0 || !this.isDiscountValid()}
        onFullPaymentButtonPressed={this.handleSetTablePaidPressed}
        splitPaymentDisabled={tableState.key === 'paid' || orders.length === 0}
        onSplitPaymentButtonPressed={this.handleCustomPayPressed}
        onResetButtonPressed={this.handleResetTablePressed}
        giveToGuestDisabled={tableState.key !== 'taken'}
        onGiveToGuestButtonPressed={this.onGiveToGuestPressedDebounced}
        canPrintReceipt={canPrintReceipt}
        printReceiptDisabled={orders.length === 0}
        onPrintReceiptButtonPressed={this.handlePrintReceiptPressed}
        canPrintKitchenOrder={canPrintKitchenOrder}
        rePrintKitchenDisabled={orders.length === 0}
        onRePrintKitchenButtonPressed={this.handleRePrintForKitchenPressed}
      />
    );
  };

  renderOrderItemRow = info => {
    const { isSplitPaymentMode, selectedOrders } = this.state;

    return (
      <OrderItemRow
        orderItem={info.item}
        menuItem={info.item.menuItemPrice.menuItem}
        menuItemCurrentPrice={info.item.menuItemPrice.currentPrice}
        enableMultiSelection={isSplitPaymentMode}
        onOrderSelected={this.handleOrderSelected}
        isSelected={!!selectedOrders.find(_ => _.get('orderMenuItemPriceId') === info.item.orderMenuItemPriceId)}
        orderItemIsEditable
        showRemove={false}
      />
    );
  };

  renderSelectedPayingItem = info => (
    <OrderItemRow
      orderItem={info.item}
      menuItemCurrentPrice={info.item.menuItemPrice.currentPrice}
      enableMultiSelection={false}
      orderItemIsEditable
      showRemove={false}
      showImage={false}
    />
  );

  renderSectionHeader = ({ section }) => {
    const { isSplitPaymentMode, selectedOrders } = this.state;
    const isSectionSelected = section.data.every(
      order => !!selectedOrders.find(_ => _.get('orderMenuItemPriceId') === order.orderMenuItemPriceId) || order.paid,
    );
    const isAllSectionOrdersPaid = section.data.every(order => order.paid);

    return (
      <View style={Styles.sectionHeader}>
        {!isAllSectionOrdersPaid && isSplitPaymentMode ? (
          <CheckBox
            center
            size={28}
            iconType="material-community"
            checkedIcon="check-circle-outline"
            uncheckedIcon="checkbox-blank-circle-outline"
            checked={isSectionSelected}
            onPress={() => this.handleSectionHeaderSelected(section, !isSectionSelected)}
          />
        ) : (
          <View />
        )}
        <Icon name="person-outline" color={DefaultColor.iconColor} />
        <Text style={[DefaultStyles.primaryLabelFont, Styles.sectionTitle]}>
          {section.categoryTitle}
        </Text>
      </View>
    );
  };

  renderSeparator = () => <ListItemSeparator />;

  render = () => {
    const {
      t,
      table: { name, tableState },
      orders,
      onEndReached,
      onRefresh,
      isRefreshing,
    } = this.props;
    const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
    const { selectedDiscountButtonIndex } = this.state;
    const immutableOrders = Immutable.fromJS(orders);
    const totalPrice = OrderHelper.calculateTotalPriceAndDiscountForMultuipleOrders(immutableOrders)
      .get('totalPrice')
      .toFixed(2);
    const { isSplitPaymentMode, discount } = this.state;

    return (
      <View style={Styles.container}>
        {this.renderResetTablePopupDialog(slideAnimation, name)}
        {this.renderFullPaymentPopupDialog(slideAnimation, name)}
        {this.renderSplitPaymentPopupDialog(slideAnimation, name)}
        {this.renderRePrintForKitchenPopupDialog(slideAnimation)}
        {this.renderPrintReceiptPopupDialog(slideAnimation)}

        <View style={Styles.headerContainer}>
          <Text style={DefaultStyles.primaryTitleFont}>
            {t('table.label').replace('{tableName}', name)}
          </Text>
          <Badge
            value={tableState.name}
            textStyle={Styles.tableText}
            component={TouchableNative}
            containerStyle={[Styles.tableBadgeContainer, Styles.tableBadgeTaken]}
            wrapperStyle={Styles.tableBadgeWrapper}
          />
          <Text style={DefaultStyles.primaryTitleFont}>
$
            {totalPrice}
          </Text>
        </View>
        {orders.length > 0 ? (
          <SectionList
            renderItem={this.renderOrderItemRow}
            renderSectionHeader={this.renderSectionHeader}
            sections={this.getOrderItems(immutableOrders.flatMap(order => order.get('details')).toJS())}
            keyExtractor={this.keyExtractor}
            onEndReached={onEndReached}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
            ItemSeparatorComponent={this.renderSeparator}
            extraData={this.state}
          />
        ) : (
          <ScrollView contentContainerStyle={Styles.emptyOrdersContainer}>
            <Text style={DefaultStyles.primaryLabelFont}>
              {t('noOrdersHaveBeenPlacedYet.message')}
            </Text>
          </ScrollView>
        )}
        <View style={Styles.paymentSummaryContainer}>
          <View style={Styles.paymentSummaryTotalRow}>
            <Text style={DefaultStyles.primaryLabelFont}>
              {t('total.label').replace('{total}', totalPrice)}
            </Text>
            <View style={DefaultStyles.rowContainer}>
              <Input
                placeholder={t('discount.placeholder')}
                onChangeText={this.handleDiscountValueChanged}
                value={discount}
                containerStyle={{ width: 100 }}
                keyboardType="numeric"
              />
              <ButtonGroup
                onPress={this.updateIndex}
                selectedIndex={selectedDiscountButtonIndex}
                buttons={this.getDiscountTypes()}
                containerStyle={{ height: 30, width: 100 }}
              />
            </View>
          </View>
          <View style={Styles.paymentSummaryBalanceRow}>
            <Text style={DefaultStyles.primaryLabelFont}>
              {t('balanceToPay.label').replace('{balanceToPay}', this.getBalanceToPayAndDiscount().balanceToPay.toFixed(2))}
            </Text>
          </View>
        </View>
        {isSplitPaymentMode ? this.renderSplitPaymentButtons() : this.renderDefaultPaymentButtons(tableState)}
      </View>
    );
  };
}

TableDetailView.propTypes = {
  isRefreshing: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onEndReached: PropTypes.func.isRequired,
  table: TableProp.isRequired,
  canPrintKitchenOrder: PropTypes.bool.isRequired,
  canPrintReceipt: PropTypes.bool.isRequired,
  onResetTablePressed: PropTypes.func.isRequired,
  onSetPaidPressed: PropTypes.func.isRequired,
  onSetPaidAndResetPressed: PropTypes.func.isRequired,
  onSplitPaidPressed: PropTypes.func.isRequired,
  onSplitPaidAndPrintReceiptPressed: PropTypes.func.isRequired,
  onGiveToGuestPressed: PropTypes.func.isRequired,
  onRePrintForKitchen: PropTypes.func.isRequired,
  onPrintReceipt: PropTypes.func.isRequired,
};

export default translate()(TableDetailView);
