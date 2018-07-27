// @flow

import Immutable, { Map, Range } from 'immutable';
import { ZonedDateTime, ZoneId, DateTimeFormatter } from 'js-joda';
import OrderHelper from './OrderHelper';

export const endingDots = '.';
export const endOfLine = '\n';
export const priceAndCurrencySignMaxLength = 7;
export const quantityMaxLength = 2;

export default class PrintHelper {
  static alignTextsOnEachEdge = (leftStr, rightStr, lineWidth, padding = ' ') => {
    if (leftStr.length + rightStr.length <= lineWidth - 1) {
      return leftStr + Array(lineWidth - (leftStr.length + rightStr.length) + 1).join(padding) + rightStr;
    }

    if (rightStr.length > lineWidth - 1) {
      throw new Error('Can\'t fit the right text.');
    }

    if (leftStr.length + rightStr.length > lineWidth - 1 && rightStr.length > lineWidth - endingDots.length) {
      throw new Error('Can\'t fit the right text.');
    }

    return leftStr.substring(0, lineWidth - (1 + endingDots.length + rightStr.length)) + endingDots + padding + rightStr;
  };

  static splitTextIntoMultipleLines = (str, lineWidth, prefixText = '', trimText = true) => {
    if (!str) {
      return '';
    }

    const trimmedText = str.trim();

    if (trimmedText.length === 0) {
      return '';
    }

    const finalStr = prefixText + (trimText ? trimmedText : str);

    return Range(0, finalStr.length / lineWidth)
      .map(idx => finalStr.substring(idx * lineWidth, (idx + 1) * lineWidth))
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

  static getPrintableOrderDetailsForKitchen = (details, maxLineWidth) => {
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
          PrintHelper.splitTextIntoMultipleLines(
            detail.get('quantity').toString() + '  ' + detail.getIn(['menuItemPrice', 'menuItem', 'nameToPrintOnKitchenReceipt']),
            maxLineWidth,
          ) +
          detail
            .get('orderChoiceItemPrices')
            .reduce(
              (reduction, orderChoiceItemPrice) =>
                reduction +
                PrintHelper.splitTextIntoMultipleLines(
                  '  ' + orderChoiceItemPrice.getIn(['choiceItemPrice', 'choiceItem', 'nameToPrintOnKitchenReceipt']),
                  maxLineWidth,
                  '',
                  false,
                ),
              '',
            ) +
          PrintHelper.splitTextIntoMultipleLines(detail.get('notes'), maxLineWidth, 'Notes: '),
        '',
      );
  };

  static getPrintableOrderDetailsForKitchenWithServingTime = (servingTime, details, maxLineWidth) =>
    PrintHelper.pad(servingTime, maxLineWidth, '-') +
    endOfLine +
    endOfLine +
    PrintHelper.getPrintableOrderDetailsForKitchen(details, maxLineWidth) +
    endOfLine +
    endOfLine;

  static convertOrderIntoPrintableDocumentForKitchen = (details, placedAt, notes, tableName, template, maxLineWidth) => {
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
            .getIn(['servingTime', 'tag', 'nameToPrintOnKitchenReceipt']),
          details: groupedDetails.get(servingTimeId),
        }),
      )
      .map(groupedDetailsWithServingTime =>
        PrintHelper.getPrintableOrderDetailsForKitchenWithServingTime(
          groupedDetailsWithServingTime.get('servingTimeNameToPrint'),
          groupedDetailsWithServingTime.get('details'),
          maxLineWidth,
        ),
      )
      .reduce((orderList1, orderList2) => orderList1 + endOfLine + orderList2, '');

    if (!detailsWithUnspecifiedServingTime.isEmpty()) {
      finalOrderList =
        finalOrderList +
        PrintHelper.getPrintableOrderDetailsForKitchenWithServingTime('Unspecified', detailsWithUnspecifiedServingTime, maxLineWidth);
    }

    return template
      .replace('\r', '')
      .replace('\n', '')
      .replace(/{CR}/g, '')
      .replace(/{LF}/g, '\n')
      .replace(
        /{OrderDateTime}/g,
        ZonedDateTime.parse(placedAt)
          .withZoneSameInstant(ZoneId.SYSTEM)
          .format(DateTimeFormatter.ofPattern('dd-MM-yyyy HH:mm:ss')),
      )
      .replace(/{Notes}/g, PrintHelper.splitTextIntoMultipleLines(notes, maxLineWidth, 'Notes: '))
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

  static convertTotalPriceToPrintableString = (total, maxLineWidth) => {
    if (!total) {
      return '';
    }

    return PrintHelper.alignTextsOnEachEdge('Total', PrintHelper.padStart(`$${total.toFixed(2)}`, 10), maxLineWidth) + endOfLine;
  };

  static convertTotalDiscountToPrintableString = (discount, maxLineWidth) => {
    if (!discount) {
      return '';
    }

    return PrintHelper.alignTextsOnEachEdge('Total Discount', PrintHelper.padStart(`-$${discount.toFixed(2)}`, 10), maxLineWidth) + endOfLine;
  };

  static convertDiscountToPrintableString = (discount, maxLineWidth) => {
    if (!discount) {
      return '';
    }

    return endOfLine + PrintHelper.alignTextsOnEachEdge('Discount', PrintHelper.padStart(`-$${discount.toFixed(2)}`, 10), maxLineWidth);
  };

  static convertTotalGstToPrintableString = (totalPrice, maxLineWidth) =>
    PrintHelper.alignTextsOnEachEdge('includes GST of', PrintHelper.padStart(`$${((totalPrice * 3) / 23).toFixed(2)}`, 10), maxLineWidth) + endOfLine;

  static getPrintableOrderDetailsForReceipt = (details, maxLineWidth) => {
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
              detail.getIn(['menuItemPrice', 'menuItem', 'nameToPrintOnCustomerReceipt']),
              PrintHelper.convertPriceAndQuantityToPrintableString(
                detail.getIn(['menuItemPrice', 'currentPrice']),
                detail.get('quantity').toString(),
              ),
              maxLineWidth,
            ) +
            endOfLine +
            detail
              .get('orderChoiceItemPrices')
              .reduce(
                (reduction, orderChoiceItemPrice) =>
                  reduction +
                  PrintHelper.alignTextsOnEachEdge(
                    ' ' + orderChoiceItemPrice.getIn(['choiceItemPrice', 'choiceItem', 'nameToPrintOnCustomerReceipt']),
                    PrintHelper.convertPriceAndQuantityToPrintableString(
                      orderChoiceItemPrice.getIn(['choiceItemPrice', 'currentPrice']),
                      (detail.get('quantity') * orderChoiceItemPrice.get('quantity')).toString(),
                    ),
                    maxLineWidth,
                  ) +
                  endOfLine,
                '',
              ),
          '',
        ) + PrintHelper.convertDiscountToPrintableString(details.first().getIn(['paymentGroup', 'discount']))
    );
  };

  static convertOrderIntoPrintableDocumentForReceipt = (details, tableName, template, maxLineWidth) => {
    const groupedDetails = details.groupBy(item => item.getIn(['paymentGroup', 'paymentGroupId']));

    return groupedDetails
      .map(items => {
        const totalPriceAndDiscount = OrderHelper.calculateTotalPriceAndDiscount(items);
        const totalPrice = totalPriceAndDiscount.get('totalPrice');

        const orderList =
          PrintHelper.getPrintableOrderDetailsForReceipt(items, maxLineWidth) +
          endOfLine +
          Array(maxLineWidth + 1).join('-') +
          endOfLine +
          PrintHelper.convertTotalDiscountToPrintableString(totalPriceAndDiscount.get('discount'), maxLineWidth) +
          PrintHelper.convertTotalPriceToPrintableString(totalPrice, maxLineWidth) +
          PrintHelper.convertTotalGstToPrintableString(totalPrice, maxLineWidth);

        const paidAt = items.first().getIn(['paymentGroup', 'paidAt']);

        return template
          .replace('\r', '')
          .replace('\n', '')
          .replace(/{CR}/g, '')
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
      .reduce((reduction, value) => reduction + endOfLine + value, '');
  };

  static convertDepartmentCategoriesReportIntoPrintableDocument = (departmentCategoriesReport, template, from, to, maxLineWidth) => {
    const departmentCategories = departmentCategoriesReport
      .map(departmentCategoryReport => {
        const subCategoriesReport = departmentCategoryReport.departmentSubCategoriesReport.map(departmentSubCategoryReport => {
          return PrintHelper.alignTextsOnEachEdge(
            PrintHelper.pad(departmentSubCategoryReport.departmentCategory.tag.key, 5) + departmentSubCategoryReport.departmentCategory.tag.name,
            PrintHelper.pad(departmentSubCategoryReport.quantity.toString(), 5) +
              PrintHelper.pad('$' + departmentSubCategoryReport.totalSale.toFixed(2), 6),
            maxLineWidth,
          );
        });

        const title = PrintHelper.splitTextIntoMultipleLines(departmentCategoryReport.departmentCategory.tag.name, maxLineWidth);
        const footer = PrintHelper.alignTextsOnEachEdge(
          '',
          PrintHelper.pad(departmentCategoryReport.quantity.toString(), 5) + PrintHelper.pad('$' + departmentCategoryReport.totalSale.toFixed(2), 6),
          maxLineWidth,
        );

        return title + subCategoriesReport + endOfLine + endOfLine + footer;
      })
      .reduce((reduction, value) => reduction + endOfLine + value, '');

    return template
      .replace('\r', '')
      .replace('\n', '')
      .replace(/{CR}/g, '')
      .replace(/{LF}/g, '\n')
      .replace(/{FromDateTime}/g, from ? from.format(DateTimeFormatter.ofPattern('dd-MM-yyyy HH:mm:ss')) : '')
      .replace(/{ToDateTime}/g, to ? to.format(DateTimeFormatter.ofPattern('dd-MM-yyyy HH:mm:ss')) : '')
      .replace(/{DepartmentCategories}/g, departmentCategories);
  };
}
