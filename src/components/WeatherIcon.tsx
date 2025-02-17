import React, {useMemo} from 'react';

import DayClear from 'images/day-clear.svg?react';
import DayCloudy from 'images/day-cloudy.svg?react';
import DayCloudyFog from 'images/day-cloudy-fog.svg?react';
import DayFog from 'images/day-fog.svg?react';
import DayPartiallyClearWithRain from 'images/day-partially-clear-with-rain.svg?react';
import DaySnowing from 'images/day-snowing.svg?react';
import DayThunderstorm from 'images/day-thunderstorm.svg?react';
import NightClear from 'images/night-clear.svg?react';
import NightCloudy from 'images/night-cloudy.svg?react';
import NightCloudyFog from 'images/night-cloudy-fog.svg?react';
import NightFog from 'images/night-fog.svg?react';
import NightPartiallyClearWithRain from 'images/night-partially-clear-with-rain.svg?react';
import NightSnowing from 'images/night-snowing.svg?react';
import NightThunderstorm from 'images/night-thunderstorm.svg?react';


export type Moment = 'day' | 'night';
type WeatherType = 'isThunderstorm' | 'isClear' |
  'isCloudyFog' | 'isCloudy' | 'isFog' | 'isPartiallyClearWithRain' |
  'isSnowing';

/**
 * Map of weather type (key) and weather code (value).
 */
const weatherTypeCodeMap: Record<WeatherType, number[]> = {
  isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
  isClear: [1],
  isCloudyFog: [25, 26, 27, 28],
  isCloudy: [2, 3, 4, 5, 6, 7],
  isFog: [24],
  isPartiallyClearWithRain: [
    8, 9, 10, 11, 12, 13, 14, 19, 20, 29, 30, 31, 32, 38, 39,
  ],
  isSnowing: [23, 37, 42],
} as const;


type WeatherIcons = {
  [k in Moment]: Record<WeatherType, React.JSX.Element>
}
const weatherIconMap = {
  day: {
    isThunderstorm: <DayThunderstorm />,
    isClear: <DayClear />,
    isCloudyFog: <DayCloudyFog />,
    isCloudy: <DayCloudy />,
    isFog: <DayFog />,
    isPartiallyClearWithRain: <DayPartiallyClearWithRain />,
    isSnowing: <DaySnowing />,
  },
  night: {
    isThunderstorm: <NightThunderstorm />,
    isClear: <NightClear />,
    isCloudyFog: <NightCloudyFog />,
    isCloudy: <NightCloudy />,
    isFog: <NightFog />,
    isPartiallyClearWithRain: <NightPartiallyClearWithRain />,
    isSnowing: <NightSnowing />,
  },
} as const satisfies WeatherIcons;

const weatherCode2Type = (weatherCode: number | string): WeatherType | undefined => {
  const [weatherType] = (
    Object.entries(weatherTypeCodeMap) as [WeatherType, number[]][]
  )
    .find(([_, weatherCodes]) =>
      weatherCodes.includes(+weatherCode),
    ) || [];
  return weatherType;
};

type weatherIconProp = {
  weatherCode: number | string,
  moment: keyof WeatherIcons
}
const weatherIcon = ({weatherCode, moment}: weatherIconProp) => {
  const weatherType = useMemo(() => weatherCode2Type(weatherCode), [
    weatherCode,
  ]);
  return weatherType && weatherIconMap[moment][weatherType];
};

export default weatherIcon;
