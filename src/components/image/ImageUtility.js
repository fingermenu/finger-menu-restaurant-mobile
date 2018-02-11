import images from './Images';

export default class ImageUtility {
  static getImageSource = name => images.get(name);
}
