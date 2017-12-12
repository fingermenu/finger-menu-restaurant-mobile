// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, ScrollView } from 'react-native';
import { FormLabel, FormInput, Button, CheckBox } from 'react-native-elements';
import Styles from './Styles';
import { ImageUltility } from '../../components/image';
import { Color } from '../../framework/style/DefaultStyles';

const UserFeedback = props => {
  const option1Selected = props.selectedOptions.has('option1');
  const option2Selected = props.selectedOptions.has('option2');
  const option3Selected = props.selectedOptions.has('option3');
  const option4Selected = props.selectedOptions.has('option4');
  const option5Selected = props.selectedOptions.has('option5');
  const option6Selected = props.selectedOptions.has('option6');
  const { onOptionsChanged, onMessageChanged, onSendPress } = props;

  return (
    <ScrollView style={Styles.container}>
      <View style={Styles.topContainer}>
        <Image source={ImageUltility.getImageSource('pencil')} style={Styles.image} />
        <View style={Styles.feedbackIntroTextContainer}>
          <Text style={Styles.feedbackIntroText}>
            <Text>Love to hear from </Text>
            <Text>you. </Text>
            <Text>Please let us know how we can improve the app.</Text>
          </Text>
        </View>
      </View>
      <View style={Styles.bottomContainer}>
        <View>
          <Text style={Styles.feedbackOptionText}>Which features would you love to see in FingerMenuRestaurant?</Text>
          <View>
            <CheckBox
              title="Pack and collect"
              onPress={() => onOptionsChanged('option1', 'pack and collect', option1Selected)}
              checked={option1Selected}
            />
            <CheckBox
              title="Online checkout"
              onPress={() => onOptionsChanged('option2', 'online checkout', option2Selected)}
              checked={option2Selected}
            />
            <CheckBox title="Delivery" onPress={() => onOptionsChanged('option3', 'delivery', option3Selected)} checked={option3Selected} />
            <CheckBox
              title="Price watch/alert"
              onPress={() => onOptionsChanged('option4', 'price watch', option4Selected)}
              checked={option4Selected}
            />
            <CheckBox
              title="Share shopping list with friends and family"
              onPress={() => onOptionsChanged('option5', 'list sharing', option5Selected)}
              checked={option5Selected}
            />
            <CheckBox
              title="Support more retailers"
              onPress={() => onOptionsChanged('option6', 'more retailers', option6Selected)}
              checked={option6Selected}
            />
          </View>
        </View>
        <FormLabel>Any other features or comments</FormLabel>
        <FormInput multiline={true} placeholder="Message" numberOfLines={2} onChangeText={message => onMessageChanged(message)} />
        <View style={Styles.submitButtonContainer}>
          <Button
            title="Send"
            icon={{ name: 'send', type: 'material-community' }}
            raised
            onPress={onSendPress}
            backgroundColor={Color.secondaryColorAction}
          />
        </View>
      </View>
    </ScrollView>
  );
};

UserFeedback.propTypes = {
  onSendPress: PropTypes.func.isRequired,
  onMessageChanged: PropTypes.func.isRequired,
};

export default UserFeedback;
