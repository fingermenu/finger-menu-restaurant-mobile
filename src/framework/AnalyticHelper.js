// @flow

import { Platform } from 'react-native';
import packageInfo from '../../package.json';

export const eventPrefix = `${Platform.OS}-${packageInfo.version}-`;
export const screenNamePrefix = `${Platform.OS}-${packageInfo.version}-`;
