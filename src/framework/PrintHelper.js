// @flow

import Immutable, { Map, Range } from 'immutable';
import { ZonedDateTime, ZoneId, DateTimeFormatter } from 'js-joda';
import OrderHelper from './OrderHelper';

export const endingDots = '.';
export const maxLineLength = 48;
export const endOfLine = '\r\n';
export const priceAndCurrencySignMaxLength = 7;
export const quantityMaxLength = 2;

export default class PrintHelper {
  static alignTextsOnEachEdge = (leftStr, rightStr, width = maxLineLength, padding = ' ') => {
    if (leftStr.length + rightStr.length <= width - 1) {
      return leftStr + Array(width - (leftStr.length + rightStr.length) + 1).join(padding) + rightStr;
    }

    if (rightStr.length > width - 1) {
      throw new Error('Can\'t fit the right text.');
    }

    if (leftStr.length + rightStr.length > width - 1 && rightStr.length > width - endingDots.length) {
      throw new Error('Can\'t fit the right text.');
    }

    return leftStr.substring(0, width - (1 + endingDots.length + rightStr.length)) + endingDots + padding + rightStr;
  };

  static splitTextIntoMultipleLines = (str, prefixText = '', trimText = true, lineLength = maxLineLength) => {
    if (!str) {
      return '';
    }

    const trimmedText = str.trim();

    if (trimmedText.length === 0) {
      return '';
    }

    const finalStr = prefixText + (trimText ? trimmedText : str);

    return Range(0, finalStr.length / lineLength)
      .map(idx => finalStr.substring(idx * lineLength, (idx + 1) * lineLength))
      .reduce((reduction, value) => reduction + value + endOfLine, '');
  };

  static pad = (str, maxLength, paddingChar = ' ') => {
    if (!str || str.length === 0) {
      return Array(maxLength + 1).join(paddingChar);
    }

    if (str.length >= maxLength) {
      return str;
    }

    const padding = Array(Math.floor((maxLength - str.length) / 2 + 1)).join(paddingChar);

    return padding + str + padding;
  };

  static padStart = (str, maxLength, paddingChar = ' ') => {
    if (!str || str.length === 0) {
      return Array(maxLength + 1).join(paddingChar);
    }

    if (str.length >= maxLength) {
      return str;
    }

    return Array(maxLength - str.length + 1).join(paddingChar) + str;
  };

  static getPrintableOrderDetailsForKitchen = details => {
    const groupedDetails = details.groupBy(detail => {
      const choiceItemPriceIds = detail
        .get('orderChoiceItemPrices')
        .map(orderChoiceItemPrice => orderChoiceItemPrice.getIn(['choiceItemPrice', 'id']))
        .sort((id1, id2) => id1.localeCompare(id2))
        .reduce((reduction, id) => reduction + id, '');
      const notes = detail.get('notes') ? detail.get('notes') : '';

      return detail.getIn(['menuItemPrice', 'id']) + notes + choiceItemPriceIds;
    });

    return groupedDetails
      .keySeq()
      .map(key =>
        groupedDetails
          .get(key)
          .reduce(
            (reduction, detail) => (reduction.isEmpty() ? detail : reduction.update('quantity', quantity => quantity + detail.get('quantity'))),
            Map(),
          ),
      )
      .reduce(
        (menuItemsDetail, detail) =>
          menuItemsDetail +
          endOfLine +
          PrintHelper.alignTextsOnEachEdge(detail.getIn(['menuItemPrice', 'menuItem', 'nameToPrint']), detail.get('quantity').toString()) +
          endOfLine +
          detail
            .get('orderChoiceItemPrices')
            .reduce(
              (reduction, orderChoiceItemPrice) =>
                reduction +
                PrintHelper.splitTextIntoMultipleLines(
                  '  ' + orderChoiceItemPrice.getIn(['choiceItemPrice', 'choiceItem', 'nameToPrint']),
                  '',
                  false,
                ),
              '',
            ) +
          PrintHelper.splitTextIntoMultipleLines(detail.get('notes'), 'Notes: '),
        '',
      );
  };

  static getPrintableOrderDetailsForKitchenWithServingTime = (servingTime, details) =>
    PrintHelper.pad(servingTime, maxLineLength, '-') +
    endOfLine +
    endOfLine +
    PrintHelper.getPrintableOrderDetailsForKitchen(details) +
    endOfLine +
    endOfLine;

  static convertOrderIntoPrintableDocumentForKitchen = (details, placedAt, notes, customerName, tableName, template) => {
    const immutableDetails = Immutable.fromJS(details);
    const detailsWithUnspecifiedServingTime = immutableDetails.filterNot(detail => !!detail.get('servingTime'));
    const detailsWithServingTimes = immutableDetails.filter(detail => !!detail.get('servingTime'));
    const groupedDetails = detailsWithServingTimes.groupBy(detail => detail.getIn(['servingTime', 'id']));
    let finalOrderList = groupedDetails
      .keySeq()
      .map(servingTimeId =>
        Map({
          servingTimeNameToPrint: groupedDetails
            .get(servingTimeId)
            .first()
            .getIn(['servingTime', 'tag', 'nameToPrint']),
          details: groupedDetails.get(servingTimeId),
        }),
      )
      .map(groupedDetailsWithServingTime =>
        PrintHelper.getPrintableOrderDetailsForKitchenWithServingTime(
          groupedDetailsWithServingTime.get('servingTimeNameToPrint'),
          groupedDetailsWithServingTime.get('details'),
        ),
      )
      .reduce((orderList1, orderList2) => orderList1 + endOfLine + orderList2, '');

    if (!detailsWithUnspecifiedServingTime.isEmpty()) {
      finalOrderList =
        finalOrderList + PrintHelper.getPrintableOrderDetailsForKitchenWithServingTime('Unspecified', detailsWithUnspecifiedServingTime);
    }

    return template
      .replace('\r', '')
      .replace('\n', '')
      .replace(/{CR}/g, '\r')
      .replace(/{LF}/g, '\n')
      .replace(
        /{OrderDateTime}/g,
        ZonedDateTime.parse(placedAt)
          .withZoneSameInstant(ZoneId.SYSTEM)
          .format(DateTimeFormatter.ofPattern('dd-MM-yyyy HH:mm:ss')),
      )
      .replace(/{Notes}/g, PrintHelper.splitTextIntoMultipleLines(notes, 'Notes: '))
      .replace(/{CustomerName}/g, PrintHelper.splitTextIntoMultipleLines(customerName), 'Customer Name: ')
      .replace(/{TableName}/g, tableName)
      .replace(/{OrderList}/g, finalOrderList);
  };

  static convertPriceAndQuantityToPrintableString = (unitPrice, quantity) => {
    const finalQuantity = quantity ? quantity : 1;

    if (!unitPrice || unitPrice === 0) {
      return (
        PrintHelper.padStart(null, priceAndCurrencySignMaxLength) +
        PrintHelper.padStart(finalQuantity.toString(), quantityMaxLength) +
        PrintHelper.padStart(null, priceAndCurrencySignMaxLength)
      );
    }

    const unitPriceToPrint = '$' + unitPrice.toFixed(2);
    const totalPriceToPrint = '$' + (unitPrice * finalQuantity).toFixed(2);

    return (
      PrintHelper.padStart(unitPriceToPrint, priceAndCurrencySignMaxLength) +
      ' ' +
      PrintHelper.padStart(finalQuantity.toString(), quantityMaxLength) +
      ' ' +
      PrintHelper.padStart(totalPriceToPrint, priceAndCurrencySignMaxLength)
    );
  };

  static convertTotalPriceToPrintableString = total => {
    if (!total) {
      return '';
    }

    return PrintHelper.alignTextsOnEachEdge('Total', PrintHelper.padStart(`$${total.toFixed(2)}`, 10)) + endOfLine;
  };

  static convertTotalDiscountToPrintableString = discount => {
    if (!discount) {
      return '';
    }

    return PrintHelper.alignTextsOnEachEdge('Total Discount', PrintHelper.padStart(`-$${discount.toFixed(2)}`, 10)) + endOfLine;
  };

  static convertDiscountToPrintableString = discount => {
    if (!discount) {
      return '';
    }

    return endOfLine + PrintHelper.alignTextsOnEachEdge('Discount', PrintHelper.padStart(`-$${discount.toFixed(2)}`, 10));
  };

  static convertTotalGstToPrintableString = (totalPrice, gstPercentage) => {
    if (!gstPercentage) {
      return '';
    }

    return (
      PrintHelper.alignTextsOnEachEdge('includes GST of', PrintHelper.padStart(`$${(totalPrice * gstPercentage / 100).toFixed(2)}`, 10)) + endOfLine
    );
  };

  static getPrintableOrderDetailsForReceipt = details => {
    if (details.isEmpty()) {
      return '';
    }

    const groupedDetails = details.groupBy(detail => {
      const choiceItemPriceIds = detail
        .get('orderChoiceItemPrices')
        .map(orderChoiceItemPrice => orderChoiceItemPrice.getIn(['choiceItemPrice', 'id']))
        .sort((id1, id2) => id1.localeCompare(id2))
        .reduce((reduction, id) => reduction + id, '');

      return detail.getIn(['menuItemPrice', 'id']) + choiceItemPriceIds;
    });

    return (
      groupedDetails
        .keySeq()
        .map(key =>
          groupedDetails
            .get(key)
            .reduce(
              (reduction, detail) => (reduction.isEmpty() ? detail : reduction.update('quantity', quantity => quantity + detail.get('quantity'))),
              Map(),
            ),
        )
        .reduce(
          (menuItemsDetail, detail) =>
            menuItemsDetail +
            endOfLine +
            PrintHelper.alignTextsOnEachEdge(
              detail.getIn(['menuItemPrice', 'menuItem', 'nameToPrint']),
              PrintHelper.convertPriceAndQuantityToPrintableString(
                detail.getIn(['menuItemPrice', 'currentPrice']),
                detail.get('quantity').toString(),
              ),
            ) +
            endOfLine +
            detail
              .get('orderChoiceItemPrices')
              .reduce(
                (reduction, orderChoiceItemPrice) =>
                  reduction +
                  PrintHelper.alignTextsOnEachEdge(
                    ' ' + orderChoiceItemPrice.getIn(['choiceItemPrice', 'choiceItem', 'nameToPrint']),
                    PrintHelper.convertPriceAndQuantityToPrintableString(
                      orderChoiceItemPrice.getIn(['choiceItemPrice', 'currentPrice']),
                      (detail.get('quantity') * orderChoiceItemPrice.get('quantity')).toString(),
                    ),
                  ) +
                  endOfLine,
                '',
              ),
          '',
        ) + PrintHelper.convertDiscountToPrintableString(details.first().getIn(['paymentGroup', 'discount']))
    );
  };

  static convertOrderIntoPrintableDocumentForReceipt = (details, tableName, gstPercentage, template) => {
    const groupedDetails = details.groupBy(item => item.getIn(['paymentGroup', 'id']));

    return groupedDetails
      .map(items => {
        const totalPriceAndDiscount = OrderHelper.calculateTotalPriceAndDiscount(items);
        const totalPrice = totalPriceAndDiscount.get('totalPrice');

        const orderList =
          PrintHelper.getPrintableOrderDetailsForReceipt(items) +
          endOfLine +
          Array(maxLineLength + 1).join('-') +
          endOfLine +
          PrintHelper.convertTotalDiscountToPrintableString(totalPriceAndDiscount.get('discount')) +
          PrintHelper.convertTotalPriceToPrintableString(totalPrice) +
          PrintHelper.convertTotalGstToPrintableString(totalPrice, gstPercentage);

        const paidAt = items.first().getIn(['paymentGroup', 'paidAt']);

        return template
          .replace('\r', '')
          .replace('\n', '')
          .replace(/{CR}/g, '\r')
          .replace(/{LF}/g, '\n')
          .replace(
            /{PaidAtDateTime}/g,
            paidAt
              ? ZonedDateTime.parse(paidAt)
                .withZoneSameInstant(ZoneId.SYSTEM)
                .format(DateTimeFormatter.ofPattern('dd-MM-yyyy HH:mm:ss'))
              : '',
          )
          .replace(/{TableName}/g, tableName)
          .replace(/{OrderList}/g, orderList);
      })
      .reduce((receipt1, receipt2) => receipt1 + endOfLine + receipt2, '');
  };
}
