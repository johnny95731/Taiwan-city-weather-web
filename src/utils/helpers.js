import sunriseAndSunsetData from './sunrise-sunset.json';
import locations from './locations.json';

export const getLocation = (cityName) => {
  return locations[cityName];
};

export const getCode = (cityName) => {
  /**
   * 返回鄉鎮預報之代碼
   */
  return locations[cityName].code
};

export const getGov = (cityName) => {
  /**
   * 返回地方政府所在之區域
   */
  return locations[cityName].towns[0]
};

export const getCities = Object.keys(locations)
  /**
   * 返回所有城市
   */ 

export const getTowns = (cityName) => {
  /**
   * 返回城市的所有鄉鎮市區
   */
  return locations[cityName].towns
};

export const getMoment = (locationName) => {
  /**
   * Return current time is day or night in a districts.
   */
  // From sunrise-sunset data get local data.
  const location = sunriseAndSunsetData.find(
    (data) => data.locationName === locationName
  );
  if (!location) {
    throw new Error(`找不到 ${location} 的日出日落資料`);
  }

  // Get local time and fromat as yyyy-mm-dd
  const now = new Date();
  const nowDate = Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(now)
    .replace(/\//g, '-');

  // Find sunrise-sunset moment of today.
  const locationDate = location?.time.find((time) => time.dataTime === nowDate);
  if (!locationDate) {
    throw new Error(`找不到 ${locationName} 在 ${nowDate} 的日出日落資料`);
  }

  // Convert sunrise, sunset, and nowTime to TimeStamp
  const sunriseTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunrise}`
  ).getTime();
  const sunsetTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunset}`
  ).getTime();
  const nowTimeStamp = now.getTime();

  // Verifying current time is day or night.
  return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <= sunsetTimestamp
    ? 'day'
    : 'night';
};

const rgbScale = [0.299, 0.587, 0.114];

export const hex2Decimal = (hex) => {
  /**
   * Convert hex rgb color to gray scale number.
   */
  if ( hex.startsWith("#") ) {
    hex = hex.slice(1);
  }
  if ( hex.length == 3 ) {
    const strs = hex.split("");
    const vals = strs.map((str, i) => parseInt(str+str, 16) * rgbScale[i]);
    return vals.reduce((cummul, val) => cummul += val, 0);
  } else if ( hex.length == 6 ) {
    return parseInt(hex.substr(0, 2), 16) * rgbScale[0]
         + parseInt(hex.substr(2, 2), 16) * rgbScale[1]
         + parseInt(hex.substr(4, 2), 16) * rgbScale[2]
  }
  return null
};
