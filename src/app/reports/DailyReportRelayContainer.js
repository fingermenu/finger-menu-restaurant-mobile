// @flow

import { createRefetchContainer, graphql } from 'react-relay';
import DailyReportContainer from './DailyReportContainer';

export default createRefetchContainer(
  DailyReportContainer,
  {
    user: graphql`
      fragment DailyReportRelayContainer_user on User {
        id
        restaurant(restaurantId: $restaurantId) {
          departmentCategoriesRootReport(dateTimeRange: $dateTimeRange) {
            eftpos
            cash
            totalSale
            quantity
            departmentCategoriesReport {
              departmentCategory {
                id
                tag {
                  key
                  name
                }
              }
              totalSale
              quantity
              departmentSubCategoriesReport {
                departmentCategory {
                  id
                  tag {
                    key
                    name
                  }
                }
                totalSale
                quantity
              }
            }
          }
        }
      }
    `,
  },
  graphql`
    query DailyReportRelayContainerFragmentQuery($restaurantId: ID!, $dateTimeRange: DateTimeRange!) {
      user {
        ...DailyReportRelayContainer_user
      }
    }
  `,
);
