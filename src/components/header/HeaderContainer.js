// @flow

import React from 'react';
import { translate } from 'react-i18next';
import HeaderView from './HeaderView';

const HeaderContainer = ({ i18n: { changeLanguage } }) => <HeaderView changeLanguage={changeLanguage} />;

export default translate()(HeaderContainer);
