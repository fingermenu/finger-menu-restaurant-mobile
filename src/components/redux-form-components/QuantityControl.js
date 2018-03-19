// @flow

import React from 'react';
import { QuantityControl as ExistingQuantityControl } from '../quantityControl';

const QuantityControl = ({ input: { initial, value, onChange, name }, ...rest }) => (
  <ExistingQuantityControl name={name} value={value} defaultValue={initial} onChange={onChange} {...rest} />
);

export default QuantityControl;
