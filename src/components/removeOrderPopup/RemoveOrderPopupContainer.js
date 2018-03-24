// @flow

import React, { Component } from 'react';
import PopupDialog, { SlideAnimation, DialogTitle, DialogButton } from 'react-native-popup-dialog';
import { Text, View } from 'react-native';
import { translate } from 'react-i18next';

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

    const { t } = this.props;

    return (
      <PopupDialog
        width={300}
        height={300}
        dialogTitle={<DialogTitle title="Confirm Remove Order" />}
        dialogAnimation={slideAnimation}
        actions={[
          <DialogButton text={t('no.button')} onPress={this.onRemoveOrderCancelled} key="button-no" />,
          <DialogButton text={t('yes.button')} onPress={this.onRemoveOrderConfirmed} key="button-yes" />,
        ]}
        ref={this.setPopupDialogRef}
      >
        <View>
          <Text>{t('areYouSureToRemoveThisOrder.message')}</Text>
        </View>
      </PopupDialog>
    );
  };
}

export default translate()(RemoveOrderPopupContainer);
