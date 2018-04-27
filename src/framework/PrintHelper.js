// @flow

import Immutable, { Map, Range } from 'immutable';
import { ZonedDateTime, ZoneId, DateTimeFormatter } from 'js-joda';

export const endingDots = '.';
export const maxLineLength = 48;
export const endOfLine = '\r\n';

export default class PrinterHelper {
  static alignTextsOnEachEdge = (leftStr, rightStr, width = maxLineLength, padding = ' ') => {
    if (leftStr.length + rightStr.length <= width - 1) {
      return leftStr + Array(width - (leftStr.length + rightStr.length)).join(padding) + rightStr;
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
          PrinterHelper.alignTextsOnEachEdge(detail.getIn(['menuItemPrice', 'menuItem', 'nameToPrint']), detail.get('quantity').toString()) +
          endOfLine +
          detail
            .get('orderChoiceItemPrices')
            .reduce(
              (reduction, orderChoiceItemPrice) =>
                reduction +
                PrinterHelper.splitTextIntoMultipleLines(
                  '  ' + orderChoiceItemPrice.getIn(['choiceItemPrice', 'choiceItem', 'nameToPrint']),
                  '',
                  false,
                ),
              '',
            ) +
          PrinterHelper.splitTextIntoMultipleLines(detail.get('notes'), 'Notes: '),
        '',
      );
  };

  static getPrintableOrderDetailsForKitchenWithServingTime = (servingTime, details) => {
    const padding = Array(Math.floor((maxLineLength - servingTime.length) / 2 + 1)).join('-');

    return (
      padding + servingTime + padding + endOfLine + endOfLine + PrinterHelper.getPrintableOrderDetailsForKitchen(details) + endOfLine + endOfLine
    );
  };

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
        PrinterHelper.getPrintableOrderDetailsForKitchenWithServingTime(
          groupedDetailsWithServingTime.get('servingTimeNameToPrint'),
          groupedDetailsWithServingTime.get('details'),
        ),
      )
      .reduce((orderList1, orderList2) => orderList1 + endOfLine + orderList2, '');

    if (!detailsWithUnspecifiedServingTime.isEmpty()) {
      finalOrderList =
        finalOrderList + PrinterHelper.getPrintableOrderDetailsForKitchenWithServingTime('Unspecified', detailsWithUnspecifiedServingTime);
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
      .replace(/{Notes}/g, PrinterHelper.splitTextIntoMultipleLines(notes, 'Notes: '))
      .replace(/{CustomerName}/g, PrinterHelper.splitTextIntoMultipleLines(customerName), 'Customer Name: ')
      .replace(/{TableName}/g, tableName)
      .replace(/{OrderList}/g, finalOrderList);
  };

  static getPrintableOrderDetailsForReceipt = details => {
    const groupedDetails = details.groupBy(detail => {
      const choiceItemPriceIds = detail
        .get('orderChoiceItemPrices')
        .map(orderChoiceItemPrice => orderChoiceItemPrice.getIn(['choiceItemPrice', 'id']))
        .sort((id1, id2) => id1.localeCompare(id2))
        .reduce((reduction, id) => reduction + id, '');

      return detail.getIn(['menuItemPrice', 'id']) + choiceItemPriceIds;
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
          PrinterHelper.alignTextsOnEachEdge(
            detail.getIn(['menuItemPrice', 'menuItem', 'nameToPrint']),
            detail.get('quantity').toString() + 'x   $' + detail.getIn(['menuItemPrice', 'currentPrice']).toFixed(2),
          ) +
          endOfLine +
          detail
            .get('orderChoiceItemPrices')
            .reduce(
              (reduction, orderChoiceItemPrice) =>
                reduction +
                PrinterHelper.alignTextsOnEachEdge(
                  orderChoiceItemPrice.getIn(['choiceItemPrice', 'choiceItem', 'nameToPrint']),
                  '   $' + orderChoiceItemPrice.getIn(['choiceItemPrice', 'currentPrice']).toFixed(2),
                ) +
                endOfLine,
              '',
            ),
        '',
      );
  };

  static convertOrderIntoPrintableDocumentForReceipt = (details, tableName, template) => {
    const orderList = PrinterHelper.getPrintableOrderDetailsForReceipt(details);

    return template
      .replace('\r', '')
      .replace('\n', '')
      .replace(/{CR}/g, '\r')
      .replace(/{LF}/g, '\n')
      .replace(
        /{OrderDateTime}/g,
        ZonedDateTime.now()
          .withZoneSameInstant(ZoneId.SYSTEM)
          .format(DateTimeFormatter.ofPattern('dd-MM-yyyy HH:mm:ss')),
      )
      .replace(/{TableName}/g, tableName)
      .replace(/{OrderList}/g, orderList);
  };
}
