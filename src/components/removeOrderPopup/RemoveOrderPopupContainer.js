// @flow

import React, { Component } from 'react';
import PopupDialog, { SlideAnimation, DialogTitle, DialogButton } from 'react-native-popup-dialog';
import { Text, View } from 'react-native';

class RemoveOrderPopupContainer extends Component {
  onRemoveOrderConfirmed = () => {
    this.popupDialog.dismiss();
    this.props.onRemoveOrderPressed(this.props.orderItemIdToRemove);
  };

  onRemoveOrderCancelled = () => this.popupDialog.dismiss();

  setPopupDialogRef = popupDialog => {
    this.popupDialog = popupDialog;
  };

  render = () => {
    const slideAnimation = new SlideAnimation({
      slideFrom: 'bottom',
    });

    return (
      <PopupDialog
        width={300}
        height={300}
        dialogTitle={<DialogTitle title="Confirm Remove Order" />}
        dialogAnimation={slideAnimation}
        actions={[
          <DialogButton text="No" onPress={this.onRemoveOrderCancelled} key="button-no" />,
          <DialogButton text="Yes" onPress={this.onRemoveOrderConfirmed} key="button-yes" />,
        ]}
        ref={this.setPopupDialogRef}
      >
        <View>
          <Text>Are you sure to remove this order?</Text>
        </View>
      </PopupDialog>
    );
  };
}

export default RemoveOrderPopupContainer;
