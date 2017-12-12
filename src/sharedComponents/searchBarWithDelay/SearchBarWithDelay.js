// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import debounce from 'lodash.debounce';
import Styles from './Styles';
import { Color } from '../../framework/style/DefaultStyles';

class SearchBarWithDelay extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      searchKeyword: props.searchKeyword,
    };

    this.onSearchKeywordChanged = debounce(this.props.onSearchKeywordChanged, 300);
  }

  searchKeywordChanged = searchKeyword => {
    this.setState(
      {
        searchKeyword,
      },
      () => this.onSearchKeywordChanged(searchKeyword),
    );
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      searchKeyword: nextProps.searchKeyword,
    });
  }

  componentWillMount() {
    this.setState({
      searchKeyword: '',
    });
    this.props.onSearchKeywordChanged('');
  }

  render = () => {
    return (
      <View style={Styles.container}>
        <SearchBar
          clearIcon={{ color: Color.headerIconDefaultColor }}
          lightTheme
          noIcon={true}
          autoFocus={this.props.autoFocus}
          containerStyle={Styles.search}
          inputStyle={Styles.searchInput}
          placeholder="Search..."
          textInputRef="textInputRef"
          placeholderTextColor={Color.headerIconDefaultColor}
          value={this.state.searchKeyword}
          onChangeText={this.searchKeywordChanged}
        />
      </View>
    );
  };
}

SearchBarWithDelay.propTypes = {
  searchKeyword: PropTypes.string,
  onSearchKeywordChanged: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool.isRequired,
};

SearchBarWithDelay.defaultProps = {
  searchKeyword: '',
};

export default SearchBarWithDelay;
