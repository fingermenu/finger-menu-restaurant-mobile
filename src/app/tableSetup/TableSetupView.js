// @flow

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TableProp } from '../tables/PropTypes';
import Styles from './Styles';
import NumberPad from '../../components/numberPad/NumberPad';
import { DefaultColor, DefaultStyles } from '../../style';
import FormTextInput from '../../components/FormTextInput/FormTextInput';

class TableSetupView extends Component {
  render = () => {
    const { handleSubmit } = this.props;

    return (
      <View style={Styles.container}>
        <View style={DefaultStyles.rowContainer}>
          <Text style={Styles.headerText}>Setup table {this.props.table.name}</Text>
        </View>
        <View>
          <View style={Styles.tableTextContainer}>
            <View style={Styles.labelContainer}>
              <Icon name="human-handsdown" size={35} type="material-community" />
            </View>
            <View style={Styles.valueContainer}>
              <Field
                name="numberOfAdults"
                component={props => (
                  <NumberPad
                    isHorizontal={true}
                    maxNumber={16}
                    initialValue={2}
                    onNumberPressed={param => {
                      props.input.onChange(param);
                    }}
                    onOkPressed={() => {}}
                    onClearPressed={() => {}}
                  />
                )}
              />
            </View>
            {/*<Text style={Styles.numberText}>{this.props.table.numberOfAdults}</Text>*/}
          </View>
          <View style={Styles.tableTextContainer}>
            <View style={Styles.labelContainer}>
              <Icon name="human-child" size={35} type="material-community" />
            </View>
            <View style={Styles.valueContainer}>
              <Field
                name="numberOfChildren"
                component={props => (
                  <NumberPad
                    isHorizontal={true}
                    maxNumber={10}
                    initialValue={0}
                    onNumberPressed={param => {
                      props.input.onChange(param);
                    }}
                    onOkPressed={() => {}}
                    onClearPressed={() => {}}
                  />
                )}
              />
            </View>
            {/*<Text style={Styles.numberText}>{this.props.table.numberOfAdults}</Text>*/}
          </View>
          <View style={Styles.tableTextContainer}>
            <View style={Styles.labelContainer}>
              <Text style={Styles.numberText}>Name</Text>
            </View>
            <View style={Styles.valueContainer}>
              {/*<Text style={Styles.numberText}>{this.props.table.customerName}</Text>*/}
              <Field name="name" component={FormTextInput} />
            </View>
          </View>
          <View style={Styles.tableTextContainer}>
            <View style={Styles.labelContainer}>
              <Text style={Styles.numberText}>Reservation</Text>
            </View>
            <View style={Styles.valueContainer}>
              {/*<Text style={Styles.numberText}>{this.props.table.customerName}</Text>*/}
              <Field name="notes" component={FormTextInput} />
            </View>
          </View>
        </View>
        {/*<Button title={t('setupTable.label')} onPress={this.props.onSetupTablePressed} />*/}
        <View style={DefaultStyles.rowContainer}>
          <Button
            title="Give to Guest"
            backgroundColor={DefaultColor.defaultButtonColor}
            icon={{ name: 'ios-body-outline', type: 'ionicon' }}
            buttonStyle={Styles.button}
            onPress={handleSubmit(this.props.onSetupTablePressed)}
          />
          <Button
            title="Reserve"
            backgroundColor="orange"
            icon={{ name: 'ios-clock-outline', type: 'ionicon' }}
            buttonStyle={Styles.button}
            onPress={handleSubmit(this.props.onReserveTablePressed)}
          />
        </View>
      </View>
    );
  };
}

TableSetupView.propTypes = {
  onSetupTablePressed: PropTypes.func.isRequired,
  onReserveTablePressed: PropTypes.func.isRequired,
  table: TableProp,
};

function mapStateToProps() {
  return {
    initialValues: { numberOfAdults: 2, numberOfChildren: 0 },
  };
}

export default connect(mapStateToProps)(reduxForm({ form: 'setupTable', enableReinitialize: true })(TableSetupView));
