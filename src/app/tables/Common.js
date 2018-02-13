// @flow

import Styles from './Styles';

export default class Common {
  static getTableStyle = tableState => {
    switch (tableState) {
    case 'taken':
      return Styles.tableBadgeTaken;

    case 'empty':
      return Styles.tableBadgeEmpty;

    case 'reserved':
      return Styles.tableBadgeReserve;

    case 'paid':
      return Styles.tableBadgePaid;
    }
  };
}
