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

export const ceilHour = (date: Date) => {
  date.setHours(date.getHours() + Math.ceil(date.getMinutes()/60));
  date.setMinutes(0, 0, 0);
  return date;
};

/**
 * Get a time string in the opendata API format.
 */
export const getOpenDataTime = () => {
  const date = new Date(ceilHour(new Date()).toUTCString());
  date.setHours(date.getHours() + 8);
  const iso = date.toISOString();
  const idx = iso.indexOf('.');
  return iso.slice(0, idx);
};

export const getMoment = (): Moment => {
  // Get local time and fromat as yyyy-mm-dd
  const now = new Date();
  const nowDate = Intl.DateTimeFormat('zh-TW', {
    month: '2-digit',
    day: '2-digit',
  })
    .format(now)
    .replace(/\//g, '-');
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

export const getLastItem = <T>(arr: T[]) => {
  return arr[arr.length - 1];
};

export const isNullish = (val: unknown) => val == null;

const RGB2GRAY_COEFF = [0.299, 0.587, 0.114] as const;
/**
 * Convert hex rgb color to gray scale number.
 */
export const hex2gray = (hex: string) => {
  if (hex.startsWith('#')) {
    hex = hex.slice(1);
  }
  if (hex.length === 3) {
    const strs = hex.split('');
    const vals = strs.map((str, i) => parseInt(str+str, 16) * RGB2GRAY_COEFF[i]);
    return vals.reduce((cummul, val) => cummul += val, 0);
  } else if ( hex.length === 6 ) {
    return parseInt(hex.slice(0, 2), 16) * RGB2GRAY_COEFF[0]
         + parseInt(hex.slice(2, 4), 16) * RGB2GRAY_COEFF[1]
         + parseInt(hex.slice(4, 6), 16) * RGB2GRAY_COEFF[2];
  }
  return null;
};
