import sunriseAndSunsetData from './sunrise-sunset.json'; // sunrise-sunset data


export const availableLocations = [
  /**
   * Available city for weather API.
   * cityName: string
   *    Available city name.
   * locationName: string
   *    Observation station name. The choosed station is the representative of
   * city.
   */
  {
    cityName: '宜蘭縣',
    locationName: '宜蘭',
  },
  {
    cityName: '嘉義市',
    locationName: '嘉義',
  },
  {
    cityName: '屏東縣',
    locationName: '恆春',
  },
  {
    cityName: '苗栗縣',
    locationName: '國一N142K', // 銅鑼鄉
  },
  {
    cityName: '雲林縣',
    locationName: '國一N234K',
  },
  {
    cityName: '臺東縣',
    locationName: '臺東',
  },
  {
    cityName: '臺北市',
    locationName: '臺北',
  },
  {
    cityName: '金門縣',
    locationName: '金門',
  },
  {
    cityName: '桃園市',
    locationName: '新屋',
  },
  {
    cityName: '彰化縣',
    locationName: '彰師大',
  },
  {
    cityName: '嘉義縣',
    locationName: '國一N250K', // 大林鎮
  },
  {
    cityName: '高雄市',
    locationName: '高雄',
  },
  {
    cityName: '基隆市',
    locationName: '基隆',
  },
  {
    cityName: '臺南市',
    locationName: '臺南',
  },
  {
    cityName: '南投縣',
    locationName: '國三N223K',
  },
  {
    cityName: '臺中市',
    locationName: '臺中',
  },
  {
    cityName: '新竹縣',
    locationName: '新竹',
  },
  {
    cityName: '花蓮縣',
    locationName: '花蓮',
  },
  {
    cityName: '連江縣',
    locationName: '馬祖',
  },
  {
    cityName: '澎湖縣',
    locationName: '澎湖',
  },
  {
    cityName: '新北市',
    locationName: '新北',
  },
];

export const findLocation = (cityName) => {
  /**
   * Return an object with three attributes:
   * {
   *  cityName, locationName,
   * }
   * locationName: string
   *    Observation station name. For sending request to weather API.
   */
  return availableLocations.find((location) => location.cityName === cityName);
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
