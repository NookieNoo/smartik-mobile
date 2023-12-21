import dev from './dev';
import pro from './pro';

class config {
  constructor() {
    let tmp;
    if (__DEV__) {
      tmp = dev;
    } else {
      tmp = pro;
    }

    for (let key in tmp) {
      this[key] = tmp[key];
    }
  }
}

export default new config();
