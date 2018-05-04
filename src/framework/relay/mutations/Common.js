// @flow

import cuid from 'cuid';

export default class Common {
  static createOrderOptimisticResponse = ({ id, restaurantId, notes, tableId, details, customers }, menuItemPrices, choiceItemPrices) => {
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
        notes,
        details: convertedDetails,
        customers,
      },
    };
  };

  static createTableOptimisticResponse = ({ id, tableState, numberOfAdults, numberOfChildren, customerName, notes, lastOrderCorrelationId }) => {
    return {
      node: {
        id,
        numberOfAdults,
        numberOfChildren,
        customerName,
        notes,
        lastOrderCorrelationId,
        tableState: {
          key: tableState,
        },
      },
    };
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
