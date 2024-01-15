import sunriseSunsetData from "./sunrise-sunset.json";
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

export const cities = Object.keys(locations)
  /**
   * 返回所有城市
   */ 

export const getTowns = (cityName) => {
  /**
   * 返回城市的所有鄉鎮市區
   */
  return locations[cityName].towns
};

export const getMoment = () => {
  // Get local time and fromat as yyyy-mm-dd
  const now = new Date();
  const nowDate = Intl.DateTimeFormat('zh-TW', {
    month: '2-digit',
    day: '2-digit',
  })
    .format(now)
    .replace(/\//g, '-');
  const year = now.getFullYear()
  // Find sunrise-sunset moment of today.
  const locationDate = sunriseSunsetData.find((time) => time.date === nowDate);
  if (!locationDate) {
    throw new Error(`找不到在 ${nowDate} 的日出日落資料`);
  }

  // Convert sunrise, sunset, and nowTime to TimeStamp
  const sunriseTimestamp = new Date(
    `${year}-${locationDate.date} ${locationDate.sunrise}`
  ).getTime();
  const sunsetTimestamp = new Date(
    `${year}-${locationDate.date} ${locationDate.sunset}`
  ).getTime();
  const nowTimeStamp = now.getTime();
  // Verifying current time is day or night.
  return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <= sunsetTimestamp
    ? 'day'
    : 'night';
};

const RGB2GRAY_COEFF = [0.299, 0.587, 0.114];
export const hex2Decimal = (hex) => {
  /**
   * Convert hex rgb color to gray scale number.
   */
  if ( hex.startsWith("#") ) {
    hex = hex.slice(1);
  }
  if ( hex.length === 3 ) {
    const strs = hex.split("");
    const vals = strs.map((str, i) => parseInt(str+str, 16) * RGB2GRAY_COEFF[i]);
    return vals.reduce((cummul, val) => cummul += val, 0);
  } else if ( hex.length === 6 ) {
    return parseInt(hex.substr(0, 2), 16) * RGB2GRAY_COEFF[0]
         + parseInt(hex.substr(2, 2), 16) * RGB2GRAY_COEFF[1]
         + parseInt(hex.substr(4, 2), 16) * RGB2GRAY_COEFF[2]
  }
  return null
};
