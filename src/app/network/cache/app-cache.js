var LRU = require("lru-cache");


class AppCache {

  constructor(maxAge) {
    let options = {
      max: 500,

      // for use with tracking overall storage size
      maxSize: 5000,
      sizeCalculation: (value, key) => {
        return 1
      },

      // for use when you need to clean up something when objects
      // are evicted from the cache
      // dispose: (value, key) => {
      //   // freeFromMemoryOrWhatever(value)
      //   this.cache.delete(key)
      // },

      // how long to live in ms
      ttl: maxAge,

      // return stale items before removing from cache?
      allowStale: false,

      updateAgeOnGet: false,
      updateAgeOnHas: false,

      // async method to use for cache.fetch(), for
      // stale-while-revalidate type of behavior
      fetchMethod: async (key, staleValue, { options, signal }) => { }
    }

    this.cache = new LRU(options);
  }
  get (key) {
    return this.cache.get(key);
  }
  set (key, value) {
    return this.cache.set(key, value);
  }
  del (key) {
    this.cache.del(key)
  }

  reset () {
    this.cache.reset()
  }

}

exports.AppCache = AppCache;