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
          departmentCategoriesReport(dateRange: $dateRange) {
            departmentCategory {
              id
              tag {
                name
              }
            }
            totalSale
            departmentSubCategoriesReport {
              departmentCategory {
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
    query DailyReportRelayContainerFragmentQuery($restaurantId: ID!, $dateRange: DateRange!) {
      user {
        ...DailyReportRelayContainer_user
      }
    }
  `,
);
