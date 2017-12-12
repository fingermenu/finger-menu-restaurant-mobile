import Images from './Images';

const ImageUltility = {
  getImageSource: imageName => {
    const name = imageName.toLowerCase();
    if (Images[name]) {
      return Images[name];
    }

    return Images.defaultItem;
  },
};

export default ImageUltility;
