// @flow

import cuid from 'cuid';

export default class Common {
  static createOrderOptimisticResponse = (
    { id, restaurantId, numberOfAdults, numberOfChildren, customerName, notes, tableId, details, totalPrice },
    menuItemPrices,
    choiceItemPrices,
  ) => {
    const convertedDetails = details.map(({ id, quantity, notes, paid, menuItemPriceId, orderChoiceItemPrices }) => {
      const foundMenuItemPrice = menuItemPrices.find(menuItemPrice => menuItemPrice.get('id').localeCompare(menuItemPriceId) === 0);
      const convertedOrderChoiceItemPrices = orderChoiceItemPrices.map(({ id, quantity, notes, paid, choiceItemPriceId }) => {
        const foundChoiceItemPrice = choiceItemPrices.find(choiceItemPrice => choiceItemPrice.get('id').localeCompare(choiceItemPriceId) === 0);

        return {
          id,
          paid,
          quantity,
          notes,
          choiceItemPrice: {
            id: choiceItemPriceId,
            currentPrice: foundChoiceItemPrice.get('currentPrice'),
            choiceItem: {
              id: foundChoiceItemPrice.getIn(['choiceItem', 'id']),
              name: foundChoiceItemPrice.getIn(['choiceItem', 'name']),
              description: foundChoiceItemPrice.getIn(['choiceItem', 'description']),
            },
          },
        };
      });

      return {
        id,
        quantity,
        notes,
        paid,
        menuItemPrice: {
          id: menuItemPriceId,
          currentPrice: foundMenuItemPrice.get('currentPrice'),
          menuItem: {
            id: foundMenuItemPrice.getIn(['menuItem', 'id']),
            name: foundMenuItemPrice.getIn(['menuItem', 'name']),
            description: foundMenuItemPrice.getIn(['menuItem', 'description']),
          },
          orderChoiceItemPrices: convertedOrderChoiceItemPrices,
        },
      };
    });

    return {
      node: {
        id,
        tableId,
        restaurantId,
        numberOfAdults,
        numberOfChildren,
        customerName,
        notes,
        totalPrice,
        details: convertedDetails,
      },
    };
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

      const choiceItemPricesLinkedRecords = orderChoiceItemPrices.map(({ id, quantity, notes, paid, choiceItemPriceId }) => {
        const foundChoiceItemPrice = choiceItemPrices.find(choiceItemPrice => choiceItemPrice.get('id').localeCompare(choiceItemPriceId) === 0);
        const orderChoiceItemPriceLinkedRecord = store.create(cuid(), 'orderChoiceItemPrice');

        orderChoiceItemPriceLinkedRecord.setValue(id, 'id');
        orderChoiceItemPriceLinkedRecord.setValue(foundChoiceItemPrice.get('currentPrice'), 'currentPrice');
        orderChoiceItemPriceLinkedRecord.setValue(paid, 'paid');
        orderChoiceItemPriceLinkedRecord.setValue(quantity, 'quantity');
        orderChoiceItemPriceLinkedRecord.setValue(notes, 'notes');

        const choiceItemLinkedRecord = store.create(cuid(), 'choiceItem');

        choiceItemLinkedRecord.setValue(choiceItemPriceId, 'id');
        choiceItemLinkedRecord.setValue(foundChoiceItemPrice.getIn(['choiceItem', 'name']), 'name');
        choiceItemLinkedRecord.setValue(foundChoiceItemPrice.getIn(['choiceItem', 'description']), 'description');

        orderChoiceItemPriceLinkedRecord.setLinkedRecord(choiceItemLinkedRecord, 'choiceItem');

        return orderChoiceItemPriceLinkedRecord;
      });

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
