import {useEffect, useMemo, useRef, useState} from 'react';
import {getCode, getFirstTown} from '../utils/helpers';
import {REFRESH_CD} from '../utils/constants';
import type {City} from '../utils/helpers';

// Constants
const AUTHORIZATION_KEY = 'CWA-150C2D4A-E612-4AC4-BD27-3D0A604C69AA';


export type WeatherElement = {
  observationTime: Date,
  locationName: string,
  cityName: string,
  temperature: number,
  windSpeed: number,
  description: string,
  weatherCode: string,
  rainPossibility: string,
  comfortability: string,
  heatInjuryIndex: number,
  heatInjuryWarning: string,
  isLoading: boolean,
}


/**
 * Filtered city weather forcast API data.
 */
type StationData = {
  observationTime: Date,
  locationName: string,
  temperature: number,
  windSpeed: number,
}
/**
 * 抓取氣象站資料
 */
const fetchCurrentWeather = async (stationID: string): Promise<StationData | void> => {
  const isUnmanned = stationID.startsWith('C'); // 無人站
  const code = isUnmanned ? 'O-A0001-001' : 'O-A0003-001';
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${code}?Authorization=${AUTHORIZATION_KEY}&StationId=${stationID}`,
  )
    .then((response) => response.json())
    .then((data: UnmannedWeatherStationAPIStructure | MannedWeatherStationAPIStructure) => {
      const locationData = data.records.Station[0];
      const weatherElement = locationData.WeatherElement;

      return {
        observationTime: new Date(locationData.ObsTime.DateTime),
        locationName: locationData.StationName,
        temperature: weatherElement.AirTemperature,
        windSpeed: weatherElement.WindSpeed,
      };
    })
    .catch((e) => console.error('氣象站資料下載失敗', e));
};


/**
 * Temporary saved city weather forcast API data.
 */
type CityForcastTemp = {
  PoP: Record<string, string>,
  Wx: Record<string, string>,
  CI: Record<string, string>,
}
/**
 * Filtered city weather forcast API data.
 */
type CityForcastData = {
  cityName: City,
  description: string,
  weatherCode: string,
  rainPossibility: string,
  comfortability: string,
}
/**
 * 抓取縣市天氣預報資料
 */
const fetchWeatherForecast = async (
  city: City
): Promise<CityForcastData | void> => {
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KEY}&locationName=${city}`,
  )
    .then((response) => response.json())
    .then((data: CityForecastAPIStructure) => {
      const locationData = data.records.location[0];
      const weatherEl = locationData.weatherElement.reduce(
        (neededEl, {elementName, time}) => {
          if (['Wx', 'PoP', 'CI'].includes(elementName)) {
            // @ts-expect-error Already checked.
            neededEl[elementName] = time[0].parameter;
          }
          return neededEl;
        },
        {} as CityForcastTemp,
      );

      return {
        cityName: city,
        description: weatherEl.Wx.parameterName,
        weatherCode: weatherEl.Wx.parameterValue,
        rainPossibility: weatherEl.PoP.parameterName,
        comfortability: weatherEl.CI.parameterName,
      };
    })
    .catch((e) => console.error('縣市天氣預報下載失敗', e));
};


/**
 * Temporary saved town-forcast API data.
 */
type TownForcastTemp = {
  pop3h: Record<string, string>,
  Wx: Record<string, string>,
  CI: Record<string, string>,
}
/**
 * Filtered town-forcast API data.
 */
type TownForcastData = {
  cityName: City,
  townName: string,
  description: string,
  weatherCode: string,
  rainPossibility: string,
  comfortability: string,
}
const townWeatherKeyLabel = {
  '3小時降雨機率': 'pop3h',
  '天氣現象': 'Wx',
  '舒適度指數': 'CI',
} as const;
// &timeTo=2025-02-17T11%3A00%3A00'
/**
 * 抓取鄉鎮市區天氣預報資料
 */
const fetchTownWeatherForecast = async (
  city: City,
  town: string,
): Promise<TownForcastData | void> => {
  const code = getCode(city);
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-${code}?Authorization=${AUTHORIZATION_KEY}&LocationName=${town}`,
  )
    .then((response) => response.json())
    .then((data: TownForecastAPIStructure) => {
      const locations = data.records.Locations[0].Location[0]
        .WeatherElement;
      const weatherElements = locations.reduce(
        (neededEl, {ElementName, Time}) => {
          if (ElementName in townWeatherKeyLabel) {
            // @ts-expect-error Already checked.
            neededEl[townWeatherKeyLabel[ElementName]] =
              Time[0].ElementValue[0];
          }
          return neededEl;
        },
        {} as TownForcastTemp,
      );
      return {
        cityName: city,
        townName: town,
        description: weatherElements.Wx.Weather,
        weatherCode: weatherElements.Wx.WeatherCode,
        rainPossibility: weatherElements.pop3h.ProbabilityOfPrecipitation,
        comfortability: weatherElements.CI.ComfortIndexDescription,
      } as const;
    })
    .catch((e) => console.error('鄉鎮市區天氣預報下載失敗', e));
};


/**
 * 抓取熱傷害分級
 */
const fetchWBGT = async (
  city: City,
  town: string,
) => {
  const townName_ = town === '---' ? getFirstTown(city) : town;
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/M-A0085-001?Authorization=${AUTHORIZATION_KEY}&CountyName=${city}&TownName=${townName_}&sort=IssueTime`,
  )
    .then((response) => response.json())
    .then((data: WBGTAPIStructure) => {
      const locationData = data.records.Locations[0].Location[0].Time[0];
      return {
        heatInjuryIndex: locationData.WeatherElements.HeatInjuryIndex,
        heatInjuryWarning: locationData.WeatherElements.HeatInjuryWarning,
      };
    })
    .catch((e) => console.error('熱傷害下載失敗', e));
};

const useWeatherAPI = (
  repStationID: string,
  city: City,
  town: string,
) => {
  const [weatherElement, setWeatherElement] = useState<WeatherElement>(() => {
    return {
      observationTime: new Date(),
      locationName: '',
      cityName: '',
      temperature: 0,
      windSpeed: 0,
      description: '',
      weatherCode: '0',
      rainPossibility: '0',
      comfortability: '',
      heatInjuryIndex: 0,
      heatInjuryWarning: '',
      isLoading: true,
    };
  });

  // Timeout for
  const refreshTimeoutId = useRef<number>(null);
  const [isRefreshCD, setIsRefreshCD] = useState(false);
  const fetchData = useMemo(() => {
    // reset
    if (refreshTimeoutId.current !== null) {
      clearTimeout(refreshTimeoutId.current);
      refreshTimeoutId.current = null;
    }
    let isCd = false;
    setIsRefreshCD(isCd);
    return async () => {
      if (isCd) return;
      setWeatherElement((prevState) => ({
        ...prevState,
        isLoading: true,
      }));
      const fetchTownForecast = town === '---' ?
        fetchWeatherForecast : fetchTownWeatherForecast;
      const [currentWeather, weatherForecast, heatInjury] = await Promise.all([
        fetchCurrentWeather(repStationID),
        fetchTownForecast(city, town),
        fetchWBGT(city, town),
      ]);

      setWeatherElement({
        ...currentWeather!,
        ...weatherForecast!,
        ...heatInjury!,
        isLoading: false,
      });
      setIsRefreshCD(isCd = true);
      refreshTimeoutId.current = window.setTimeout(() => {
        isCd = false;
        setIsRefreshCD(isCd);
        refreshTimeoutId.current = null;
      }, REFRESH_CD);
    };
  }, [repStationID, town]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [weatherElement, fetchData, isRefreshCD] as const;
};

export default useWeatherAPI;
