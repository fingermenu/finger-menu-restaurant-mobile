// @flow

import cuid from 'cuid';
import Immutable, { Map } from 'immutable';
import { ZonedDateTime, ZoneId } from 'js-joda';

export default class Common {
  static convertOrderMutationResponseToMap = orderLinkedRecord => {
    const nodeLinkedRecord = orderLinkedRecord.getLinkedRecord('node');
    const detailsLinkedRecords = Immutable.fromJS(nodeLinkedRecord.getLinkedRecords('details')).map(detailLinkedRecord => {
      const menuItemPriceLinkedRecord = detailLinkedRecord.getLinkedRecord('menuItemPrice');
      const menuItemLinkedRecord = menuItemPriceLinkedRecord.getLinkedRecord('menuItem');
      const orderChoiceItemPrices = Immutable.fromJS(detailLinkedRecord.getLinkedRecords('orderChoiceItemPrices'));

      return Map({
        currentPrice: menuItemPriceLinkedRecord.getValue('currentPrice'),
        name: menuItemLinkedRecord.getValue('name'),
        nameToPrint: menuItemLinkedRecord.getValue('nameToPrint'),
        description: menuItemLinkedRecord.getValue('description'),
        quantity: detailLinkedRecord.getValue('quantity'),
        notes: detailLinkedRecord.getValue('notes'),
        paid: detailLinkedRecord.getValue('paid'),
        choiceItems: orderChoiceItemPrices.map(orderChoiceItemPrice => {
          const choiceItemPriceLinkedRecord = orderChoiceItemPrice.getLinkedRecord('choiceItemPrice');
          const choiceItemLinkedRecord = choiceItemPriceLinkedRecord.getLinkedRecord('choiceItem');

          return Map({
            currentPrice: choiceItemPriceLinkedRecord.getValue('currentPrice'),
            name: choiceItemLinkedRecord.getValue('name'),
            nameToPrint: choiceItemLinkedRecord.getValue('nameToPrint'),
            description: choiceItemLinkedRecord.getValue('description'),
            quantity: orderChoiceItemPrice.getValue('quantity'),
            notes: orderChoiceItemPrice.getValue('notes'),
            paid: orderChoiceItemPrice.getValue('paid'),
          });
        }),
      });
    });

    const cancelledAt = nodeLinkedRecord.getValue('cancelledAt');

    return Map({
      id: nodeLinkedRecord.getValue('id'),
      correlationId: nodeLinkedRecord.getValue('correlationId'),
      placedAt: ZonedDateTime.parse(nodeLinkedRecord.getValue('placedAt')).withZoneSameInstant(ZoneId.SYSTEM),
      cancelledAt: cancelledAt ? ZonedDateTime.parse(cancelledAt).withZoneSameInstant(ZoneId.SYSTEM) : null,
      customerName: nodeLinkedRecord.getValue('customerName'),
      notes: nodeLinkedRecord.getValue('notes'),
      totalPrice: nodeLinkedRecord.getValue('totalPrice'),
      numberOfAdults: nodeLinkedRecord.getValue('numberOfAdults'),
      numberOfChildren: nodeLinkedRecord.getValue('numberOfChildren'),
      details: detailsLinkedRecords,
    });
  };

  static createOrderNodeForOptimisticUpdater = (
    store,
    { id, restaurantId, numberOfAdults, numberOfChildren, customerName, notes, tableId, details, totalPrice },
    menuItemPrices,
    choiceItemPrices,
  ) => {
    const node = store.create(cuid(), 'order');

    node.setValue(id, 'id');
    node.setValue(tableId, 'tableId');
    node.setValue(restaurantId, 'restaurantId');
    node.setValue(numberOfAdults, 'numberOfAdults');
    node.setValue(numberOfChildren, 'numberOfChildren');
    node.setValue(customerName, 'customerName');
    node.setValue(notes, 'notes');
    node.setValue(totalPrice, 'totalPrice');

    const detailItemsLinkedRecords = details.map(({ id, quantity, notes, paid, menuItemPriceId, orderChoiceItemPrices }) => {
      const detailItemLinkedRecord = store.create(cuid(), 'detailItem');

      detailItemLinkedRecord.setValue(id, 'id');
      detailItemLinkedRecord.setValue(quantity, 'quantity');
      detailItemLinkedRecord.setValue(notes, 'notes');
      detailItemLinkedRecord.setValue(paid, 'paid');

      const foundMenuItemPrice = menuItemPrices.find(menuItemPrice => menuItemPrice.get('id').localeCompare(menuItemPriceId) === 0);
      const menuItemPriceLinkedRecord = store.create(cuid(), 'menuItemPrice');

      menuItemPriceLinkedRecord.setValue(menuItemPriceId, 'id');
      menuItemPriceLinkedRecord.setValue(foundMenuItemPrice.get('currentPrice'), 'currentPrice');

      const menuItemLinkedRecord = store.create(cuid(), 'menuItem');

      menuItemLinkedRecord.setValue(menuItemPriceId, 'id');
      menuItemLinkedRecord.setValue(foundMenuItemPrice.getIn(['menuItem', 'name']), 'name');
      menuItemLinkedRecord.setValue(foundMenuItemPrice.getIn(['menuItem', 'description']), 'description');

      const choiceItemPricesLinkedRecords = orderChoiceItemPrices.map(
        ({
          id: orderChoiceItemPriceId,
          quantity: choiceItemPriceQuantity,
          notes: choiceItemPriceNotes,
          paid: choiceItemPricePaid,
          choiceItemPriceId,
        }) => {
          const foundChoiceItemPrice = choiceItemPrices.find(choiceItemPrice => choiceItemPrice.get('id').localeCompare(choiceItemPriceId) === 0);
          const orderChoiceItemPriceLinkedRecord = store.create(cuid(), 'orderChoiceItemPrice');

          orderChoiceItemPriceLinkedRecord.setValue(orderChoiceItemPriceId, 'id');
          orderChoiceItemPriceLinkedRecord.setValue(foundChoiceItemPrice.get('currentPrice'), 'currentPrice');
          orderChoiceItemPriceLinkedRecord.setValue(choiceItemPricePaid, 'paid');
          orderChoiceItemPriceLinkedRecord.setValue(choiceItemPriceQuantity, 'quantity');
          orderChoiceItemPriceLinkedRecord.setValue(choiceItemPriceNotes, 'notes');

          const choiceItemLinkedRecord = store.create(cuid(), 'choiceItem');

          choiceItemLinkedRecord.setValue(choiceItemPriceId, 'id');
          choiceItemLinkedRecord.setValue(foundChoiceItemPrice.getIn(['choiceItem', 'name']), 'name');
          choiceItemLinkedRecord.setValue(foundChoiceItemPrice.getIn(['choiceItem', 'description']), 'description');

          orderChoiceItemPriceLinkedRecord.setLinkedRecord(choiceItemLinkedRecord, 'choiceItem');

          return orderChoiceItemPriceLinkedRecord;
        },
      );

      menuItemPriceLinkedRecord.setLinkedRecords(choiceItemPricesLinkedRecords, 'choiceItemPrices');
      menuItemPriceLinkedRecord.setLinkedRecord(menuItemLinkedRecord, 'menuItem');
      detailItemLinkedRecord.setLinkedRecord(menuItemPriceLinkedRecord, 'menuItemPrice');

      return detailItemLinkedRecord;
    });

    node.setLinkedRecords(detailItemsLinkedRecords, 'details');

    const orderLinkedRecord = store.create(cuid(), 'order');

    orderLinkedRecord.setLinkedRecord(node, 'node');

    return orderLinkedRecord;
  };

  static convertTableMutationResponseToMap = tableLinkedRecord => {
    const nodeLinkedRecord = tableLinkedRecord.getLinkedRecord('node');
    const tableStateLinkedRecord = nodeLinkedRecord.getLinkedRecord('tableState');

    return Map({
      id: nodeLinkedRecord.getValue('id'),
      name: nodeLinkedRecord.getValue('name'),
      numberOfAdults: nodeLinkedRecord.getValue('numberOfAdults'),
      numberOfChildren: nodeLinkedRecord.getValue('numberOfChildren'),
      customerName: nodeLinkedRecord.getValue('customerName'),
      notes: nodeLinkedRecord.getValue('notes'),
      lastOrderCorrelationId: nodeLinkedRecord.getValue('lastOrderCorrelationId'),
      tableState: Map({
        id: tableStateLinkedRecord.getValue('id'),
        key: tableStateLinkedRecord.getValue('key'),
        name: tableStateLinkedRecord.getValue('name'),
      }),
    });
  };

  static createTableNodeForOptimisticUpdater = (
    store,
    { id, tableState, numberOfAdults, numberOfChildren, customerName, notes, lastOrderCorrelationId },
  ) => {
    const node = store.create(cuid(), 'table');

    node.setValue(id, 'id');
    node.setValue(numberOfAdults, 'numberOfAdults');
    node.setValue(numberOfChildren, 'numberOfChildren');
    node.setValue(customerName, 'customerName');
    node.setValue(notes, 'notes');
    node.setValue(lastOrderCorrelationId, 'lastOrderCorrelationId');

    const tableStateLinkedRecord = store.create(cuid(), 'tableState');

    tableStateLinkedRecord.setValue(tableState, 'key');

    node.setLinkedRecord(tableStateLinkedRecord, 'tableState');

    const tableLinkedRecord = store.create(cuid(), 'table');

    tableLinkedRecord.setLinkedRecord(node, 'node');

    return tableLinkedRecord;
  };
}
