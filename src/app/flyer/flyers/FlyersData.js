export function GetFlyers() {
  const baseImageUrl = 'https://firebasestorage.googleapis.com/v0/b/smart-grocery-modern.appspot.com/o/Flyers%2F';
  const stores = [
    {
      id: '1',
      storeName: 'briscoes',
      storeDisplayName: 'Briscoes',
      expiryDate: '25/9/2017',
      thumbnailImageUrl: '',
      slides: [],
    },
    {
      id: '2',
      storeName: 'farmers',
      storeDisplayName: 'Farmers',
      expiryDate: '25/9/2017',
      thumbnailImageUrl: '',
      slides: [],
    },
    {
      id: '3',
      storeName: 'rebel',
      storeDisplayName: 'Rebel',
      expiryDate: '25/9/2017',
      thumbnailImageUrl: '',
      slides: [],
    },
  ];

  stores.forEach(_ => {
    const slideUrl = baseImageUrl + _.storeName + '%2F' + _.storeName + '_';
    _.thumbnailImageUrl = slideUrl + 'thumb.jpg?alt=media';

    for (let i = 1; i <= 10; i++) {
      _.slides.push({
        uri: slideUrl + i + '.jpg?alt=media',
      });
    }
  });

  return stores;
}
