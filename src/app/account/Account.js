// @flow

import React from 'react';
import { Text, View } from 'react-native';
import { ButtonGroup, Button } from 'react-native-elements';
import { translate } from 'react-i18next';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

class Account extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: 2,
    };
    this.updateIndex = this.updateIndex.bind(this);
  }
  updateIndex(selectedIndex) {
    switch (selectedIndex) {
      case 0:
        this.props.i18n.changeLanguage('en');
        break;
      case 1:
        this.props.i18n.changeLanguage('zh');
        break;
    }

    this.setState({ selectedIndex });
  }

  render = () => {
    const { t } = this.props;
    const english = () => <Text>{t('englishLanguage.menuItem')}</Text>;
    const chinese = () => <Text>{t('chineseLanguage.menuItem')}</Text>;

    const buttons = [{ element: english }, { element: chinese }];

    const { selectedIndex } = this.state;

    return (
      <View>
        <Text>{t('home.label')}</Text>
        <ButtonGroup onPress={this.updateIndex} selectedIndex={selectedIndex} buttons={buttons} containerStyle={{ height: 100 }} />
        <Button title="Waitress Mode" onPress={this.props.navigateToPin} />
      </View>
    );
  };
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToPin: () =>
      dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'Pin',
            }),
          ],
        }),
      ),
    goBack: () => dispatch(NavigationActions.back()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Account));
