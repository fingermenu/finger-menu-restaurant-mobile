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
          departmentCategoriesReport(dateTimeRange: $dateTimeRange) {
            departmentCategory {
              id
              tag {
                name
              }
            }
            totalSale
            departmentSubCategoriesReport {
              departmentCategory {
                id
                tag {
                  name
                }
              }
              totalSale
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
