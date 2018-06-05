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
          departmentCategoryReport(dateRange: $dateRange) {
            documentCategory {
              tag {
                name
              }
            }
            totalSale
            departmentSubCategoryReport {
              documentCategory {
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
