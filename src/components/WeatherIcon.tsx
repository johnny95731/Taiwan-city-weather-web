import {useMemo} from 'react';
import type { WeatherElement } from '@/hooks/useWeatherAPI';


export type Moments = 'day' | 'night';
type WeatherTypes = 'isClear' | 'isCloudy' | 'isFog' |
'isPartiallyClearWithRain' | 'isThunderstorm' |
  'isSnowing';

/**
 * Map of weather type (key) and weather code (value).
 */
const weatherTypeCodeMap = Object.entries({
  isClear: [1],
  isCloudy: [2, 3, 4, 5, 6, 7],
  isFog: [24, 25, 26, 27, 28],
  isPartiallyClearWithRain: [
    8, 9, 10, 11, 12, 13, 14, 19, 20, 29, 30, 31, 32, 38, 39,
  ],
  isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
  isSnowing: [23, 37, 42],
} as const) as [WeatherTypes, number[]][];

const weatherCode2Type = (
  weatherCode: WeatherElement['weatherCode']
): WeatherTypes | undefined => {
  const [weatherType] = weatherTypeCodeMap
    .find(([_, weatherCodes]) =>
      weatherCodes.includes(+weatherCode),
    ) || [];
  return weatherType;
};

type WeatherIcons = {
  [k in Moments]: Record<WeatherTypes, string>
}
const weatherIconMap = {
  day: {
    isClear: 'wi-day-sunny',
    isCloudy: 'wi-day-cloudy',
    isFog: 'wi-day-fog',
    isThunderstorm: 'wi-day-thunderstorm',
    isPartiallyClearWithRain: 'wi-day-shower',
    isSnowing: 'wi-day-snow',
  },
  night: {
    isClear: 'wi-night-clear',
    isCloudy: 'wi-night-cloudy',
    isFog: 'wi-night-fog',
    isThunderstorm: 'wi-thunderstorm',
    isPartiallyClearWithRain: 'wi-night-shower',
    isSnowing: 'wi-night-snow',
  },
} as const satisfies WeatherIcons;

export type WeatherIconProps = {
  weatherCode: WeatherElement['weatherCode']
  moment: keyof WeatherIcons
}
const WeatherIcon = ({weatherCode, moment}: WeatherIconProps) => {
  const weatherClass = useMemo(() => {
    const type = weatherCode2Type(weatherCode);
    return type && ('wi ' + weatherIconMap[moment][type]);
  }, [
    weatherCode, moment
  ]);
  return <i className={weatherClass} />;
};

export default WeatherIcon;
