import sunriseSunsetData from './sunrise-sunset.json';
import locations from './locations.json';
import type {Moment} from '@/components/WeatherIcon';

export type City = keyof typeof locations;
/**
 * 取得所有縣市
 */
export const cities = Object.keys(locations) as City[];

/**
 * 取得縣市代表觀測站
 */
export const getLocation = (city: City) => {
  return locations[city];
};

const addHour = (date: Date, hours: number) => {
  date.setHours(date.getHours() + hours);
  return date;
};

/**
 * Get a time string in the opendata API format.
 * yyyy-mm-ddThh-mm-ss
 */
export const getOpenDataTime = (): {
  nextHour_: string,
  next3Hour_: string,
} => {
  let date = addHour(new Date(), 1);
  // To UTC+8. The string '.000T' in ISO format will be removed later.
  date = new Date(date.toISOString());
  addHour(date, 8);

  const from = date.toISOString();
  addHour(date, 3);
  const to = date.toISOString();
  const idx = from.indexOf('.');
  return {
    nextHour_: from.slice(0, idx),
    next3Hour_: to.slice(0, idx),
  };
};

export const getMoment = (() => {
  const dateFormater = Intl.DateTimeFormat('zh-TW', {
    month: '2-digit',
    day: '2-digit',
  });
  return (): Moment => {
    // Get local time and fromat as yyyy-mm-dd
    const now = new Date();
    const nowDate = dateFormater.format(now).replace(/\//g, '-');
    const year = now.getFullYear();
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
})();

export const getLastItem = <T>(arr: T[]) => {
  return arr[arr.length - 1];
};

export const isNullish = (val: unknown) => val == null;

const RGB2GRAY_COEFF = [0.299, 0.587, 0.114] as const;
/**
 * Convert hex to grayscale and check the number is greater than 127 or not.
 * Default to be true.
 */
export const isHexLight = (hex: string): boolean => {
  hex = hex.replace(/[^0-9A-F]/ig, '');
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length === 6) {
    const num = parseInt(hex, 16);
    const grayscale = [num >> 16, (num >> 8) & 255, num & 255]
      .reduce((prev, val, i) => {
        return prev + RGB2GRAY_COEFF[i] * val;
      }, 0);
    return grayscale > 127;
  }
  return true;
};
