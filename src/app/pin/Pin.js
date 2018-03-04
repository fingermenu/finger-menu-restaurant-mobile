// @flow

import { ErrorMessageWithRetry, LoadingInProgress } from '@microbusiness/common-react-native';
import * as asyncStorageActions from '@microbusiness/common-react/src/asyncStorage/Actions';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { graphql, QueryRenderer } from 'react-relay';
import { connect } from 'react-redux';
import { environment } from '../../framework/relay';
import PinRelayContainer from './PinRelayContainer';
import OfflinePinContainer from './OfflinePinContainer';
import * as localStateActions from '../../framework/localState/Actions';

class Pin extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  componentDidMount = () => {
    this.props.asyncStorageActions.readValue(Map({ key: 'restaurantId' }));
    this.props.asyncStorageActions.readValue(Map({ key: 'pin' }));
    this.props.asyncStorageActions.readValue(Map({ key: 'restaurantName' }));
    this.props.asyncStorageActions.readValue(Map({ key: 'restaurantConfigurations' }));

    this.props.i18n.changeLanguage('en_NZ');
    this.props.localStateActions.selectedLanguageChanged('en_NZ');
  };

  renderRelayComponent = ({ error, props, retry }) => {
    if (error) {
      return <ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />;
    }

    if (props) {
      return <PinRelayContainer user={props.user} />;
    }

    return <LoadingInProgress />;
  };

  render() {
    if (this.props.offlineMode) {
      const { restaurant: { pin, name } } = this.props;
      if (!pin || !name) {
        return <LoadingInProgress />;
      }

      return <OfflinePinContainer />;
    }

    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query PinQuery($count: Int!, $cursor: String) {
            user {
              ...PinRelayContainer_user
            }
          }
        `}
        variables={{
          cursor: null,
          count: 30,
        }}
        render={this.renderRelayComponent}
      />
    );
  }
}

Pin.propTypes = {
  localStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

function mapStateToProps(state) {
  return {
    offlineMode: !!state.asyncStorage.getIn(['keyValues', 'restaurantId']),
    restaurant: {
      name: state.asyncStorage.getIn(['keyValues', 'restaurantName']),
      pin: state.asyncStorage.getIn(['keyValues', 'pin']),
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    asyncStorageActions: bindActionCreators(asyncStorageActions, dispatch),
    localStateActions: bindActionCreators(localStateActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Pin));
