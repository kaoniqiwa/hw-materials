import { PicturesUrl } from '../network/url/garbage_profiles/garbage_profiles_pictures.url';

export class Medium {
  constructor() {}

  static default = '/assets/img/timg-pic.jpg';

  static binary() {
    return PicturesUrl.binary();
  }

  static jpg(id?: string) {
    if (!id) return this.default;
    return PicturesUrl.jpg(id);
  }
  static data(id?: string) {
    if (!id) return this.default;
    return PicturesUrl.data(id);
  }

  static img(url?: string): Promise<string> {
    return new Promise((resolve) => {
      let img = url ? Medium.jpg(url) : '';
      var image = new Image();
      image.src = img;
      image.onerror = () => {
        resolve('/assets/img/timg-pic.jpg');
      };
      image.onload = () => {
        resolve(img);
      };
    });
  }
  // static image(url?: string): Promise<ImageResult> {
  //   return new Promise((resolve) => {
  //     let img = '';
  //     if (url) {
  //       if (url.includes('http') || url.includes('/')) {
  //         img = url;
  //       } else {
  //         img = Medium.jpg(url);
  //       }
  //     }

  //     var image = new Image();
  //     image.src = img;
  //     image.onerror = () => {
  //       resolve({
  //         url: '/assets/img/timg-pic.png',
  //         error: true,
  //       });
  //     };
  //     image.onload = () => {
  //       resolve({
  //         url: img,
  //         error: false,
  //       });
  //     };
  //   });
  // }
}
