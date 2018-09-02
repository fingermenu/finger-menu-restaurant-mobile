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
            quantity
            totalSale
            departmentCategoriesReport {
              departmentCategory {
                id
                tag {
                  key
                  name
                }
              }
              quantity
              totalSale
              departmentSubCategoriesReport {
                departmentCategory {
                  id
                  tag {
                    key
                    name
                  }
                }
                quantity
                totalSale
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
