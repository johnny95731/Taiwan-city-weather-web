import sunriseSunsetData from './sunrise-sunset.json';
import locations from './locations.json';
import type {Moments} from '@/components/WeatherIcon';

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
  return (): Moments => {
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

export const isNullish = (val: unknown) => val == null;

/**
 * Return whether the vale is in the closed interval [`min`, `max`] or not.
 */
export const isInRange = (val: number, min: number, max: number) => {
  return min <= val && val <= max;
};


export type BeaufortScale = {
  /**
   * 蒲福風級
   */
  beaufort_: number,
  /**
   * 描述
   */
  descr_: string,
}
export const getBeaufortScale = (
  /**
   * Wind speed (m/s)
   */
  windSpeed: number
): BeaufortScale => {
  let text: BeaufortScale;
  if (windSpeed < 0.3)
    text = {
      beaufort_: 0,
      descr_: '無風'
    };
  else if (windSpeed <= 1.5)
    text = {
      beaufort_: 1,
      descr_: '軟風'
    };
  else if (windSpeed <= 3.3)
    text = {
      beaufort_: 2,
      descr_: '輕風'
    };
  else if (windSpeed <= 5.4)
    text = {
      beaufort_: 3,
      descr_: '微風'
    };
  else if (windSpeed <= 7.9)
    text = {
      beaufort_: 4,
      descr_: '和風'
    };
  else if (windSpeed <= 10.7)
    text = {
      beaufort_: 5,
      descr_: '清風'
    };
  else if (windSpeed <= 13.8)
    text = {
      beaufort_: 6,
      descr_: '強風'
    };
  else if (windSpeed <= 17.1)
    text = {
      beaufort_: 7,
      descr_: '疾風'
    };
  else if (windSpeed <= 20.7)
    text = {
      beaufort_: 8,
      descr_: '大風'
    };
  else if (windSpeed <= 24.4)
    text = {
      beaufort_: 9,
      descr_: '烈風'
    };
  else if (windSpeed <= 28.4)
    text = {
      beaufort_: 10,
      descr_: '狂風'
    };
  else if (windSpeed <= 32.6)
    text = {
      beaufort_: 11,
      descr_: '狂風'
    };
  else
    text = {
      beaufort_: 12,
      descr_: '狂風'
    };
  return text;
};


export const getWindDirText = (windDir: number) => {
  const dirIdx = Math.round(windDir / 45) % 8; // 8方位
  let result: {dir_: string, text_: string} = {dir_: 'n', text_: '北'};
  switch (dirIdx) {
  case 1:
    result = {dir_: 'ne', text_: '東北'};
    break;
  case 2:
    result = {dir_: 'e', text_: '東'};
    break;
  case 3:
    result = {dir_: 'se', text_: '東南'};
    break;
  case 4:
    result = {dir_: 's', text_: '南'};
    break;
  case 5:
    result = {dir_: 'sw', text_: '西南'};
    break;
  case 6:
    result = {dir_: 'w', text_: '西'};
    break;
  case 7:
    result = {dir_: 'nw', text_: '西北'};
    break;
  }
  return {
    cls_: 'wi wi-wind wi-towards-' + result.dir_,
    text_: result.text_
  };
};
