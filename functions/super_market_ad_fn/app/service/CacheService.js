class CacheService {
  constructor(catalystApp, segmentId) {
    this.cache = catalystApp.cache();
    this.segment = this.cache.segment(segmentId);
  }

  async getCache(key) {
    try {
      const response = await this.segment.get(key);
      console.log(response);
      if (response["cache_value"]) {
        console.log(`Cache hit for key: ${key}`);
        return response["cache_value"];
      }
      console.log(`Cache miss for key: ${key}`);
      return null;
    } catch (error) {
      console.error(`Error retrieving cache for key ${key}:`, error);
      return null;
    }
  }

  async setCache(key, value, expiryInHours = 1) {
    try {
      await this.segment.put(key, value, expiryInHours);
      console.log(
        `Cache set for key: ${key} with expiry: ${expiryInHours} hour(s)`
      );
    } catch (error) {
      console.error(`Error setting cache for key ${key}:`, error);
    }
  }
}

module.exports = CacheService;
