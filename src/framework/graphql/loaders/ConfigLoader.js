// @flow

import Dataloader from 'dataloader';

const configLoaderByKey = new Dataloader(async keys =>
  Promise.all(
    keys.map(async key => {
      if (key.localeCompare('fallbackLanguage') === 0) {
        return 'en_NZ';
      }

      throw new Error(`Failed to retrieve configuration for key: ${key}`);
    }),
  ),
);

export default configLoaderByKey;
