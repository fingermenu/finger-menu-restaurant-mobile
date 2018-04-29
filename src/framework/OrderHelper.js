// @flow

import { List, Map } from 'immutable';

export default class OrderHelper {
  static calculateTotalPriceAndDiscountGroupedByPayment = details => {
    if (!details) {
      return List();
    }

    const groupedDetails = details.groupBy(item => item.getIn(['paymentGroup', 'id']));

    return groupedDetails.keySeq().map(paymentGroupId => {
      const menuItemPrices = groupedDetails.get(paymentGroupId);
      const totalPrice = menuItemPrices.reduce(
        (totalPrice, menuItemPrice) =>
          totalPrice +
          menuItemPrice.get('quantity') *
            (menuItemPrice.getIn(['menuItemPrice', 'currentPrice']) +
              menuItemPrice
                .get('orderChoiceItemPrices')
                .reduce(
                  (totalChoiceItemPrice, orderChoiceItemPrice) =>
                    totalChoiceItemPrice + orderChoiceItemPrice.get('quantity') * orderChoiceItemPrice.getIn(['choiceItemPrice', 'currentPrice']),
                  0,
                )),
        0,
      );
      const discount = menuItemPrices.first().getIn(['paymentGroup', 'discount']);

      if (discount) {
        return Map({ paymentGroupId, totalPrice: totalPrice - discount, discount });
      }

      return Map({ paymentGroupId, totalPrice, discount: 0 });
    });
  };

  static calculateTotalPriceAndDiscount = details => {
    if (!details) {
      return Map({ totalPrice: 0, discount: 0 });
    }

    return OrderHelper.calculateTotalPriceAndDiscountGroupedByPayment(details).reduce(
      (reduction, paymentGroupResult) =>
        reduction
          .update('totalPrice', totalPrice => totalPrice + paymentGroupResult.get('totalPrice'))
          .update('discount', discount => discount + paymentGroupResult.get('discount')),
      Map({ totalPrice: 0, discount: 0 }),
    );
  };

  static calculateTotalPriceAndDiscountForMultuipleOrders = orders =>
    OrderHelper.calculateTotalPriceAndDiscount(orders.flatMap(order => order.get('details')));
}
