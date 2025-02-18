import {useEffect, useMemo, useState} from 'react';
import {getLocation, isNullish, getOpenDataTime} from '../utils/helpers';
import {REFRESH_CD} from '../utils/constants';
import type {City} from '../utils/helpers';

// Constants
const AUTHORIZATION_KEY = 'CWA-150C2D4A-E612-4AC4-BD27-3D0A604C69AA';


export type WeatherElement = {
  observationTime: Date,
  locationName: string,
  city: string,
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
type StationData =  Pick<
  WeatherElement,
  'observationTime' | 'locationName' | 'temperature' | 'windSpeed'
>;
/**
 * 抓取氣象站資料
 */
const fetchWeatherStation = async (stationID: string): Promise<StationData | void> => {
  const isUnmanned = stationID.startsWith('C'); // 無人站
  const code = isUnmanned ? 'O-A0001-001' : 'O-A0003-001';
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${code}?Authorization=${AUTHORIZATION_KEY}&StationId=${stationID}&WeatherElement=WindSpeed,AirTemperature&GeoInfo=CountyCode`,
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
      } as const satisfies StationData;
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
type CityForcastData =  Pick<
  WeatherElement,
  'description' | 'weatherCode' | 'rainPossibility' | 'comfortability'
>;
/**
 * 抓取縣市天氣預報資料
 */
const fetchWeatherForecast = async (
  timeTo: string,
  _: string,
  city: City,
): Promise<CityForcastData | void> => {
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KEY}&locationName=${city}&timeTo=${timeTo}`,
  )
    .then((response) => response.json())
    .then((data: CityForecastAPIStructure) => {
      const locationData = data.records.location[0];
      const weatherEl = locationData.weatherElement.reduce(
        (neededEl, {elementName, time}) => {
          if (['Wx', 'PoP', 'CI'].includes(elementName)) {
            neededEl[elementName as keyof CityForcastTemp] =
            time[0].parameter;
          }
          return neededEl;
        },
        {} as CityForcastTemp,
      );

      return {
        description: weatherEl.Wx.parameterName,
        weatherCode: weatherEl.Wx.parameterValue,
        rainPossibility: weatherEl.PoP.parameterName,
        comfortability: weatherEl.CI.parameterName,
      } as const satisfies CityForcastData;
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
type TownForcastData = Pick<
  WeatherElement,
  'description' | 'weatherCode' | 'rainPossibility' | 'comfortability'
>;
const townWeatherKeyLabel = {
  '3小時降雨機率': 'pop3h',
  '天氣現象': 'Wx',
  '舒適度指數': 'CI',
} as const;

/**
 * 抓取鄉鎮市區天氣預報資料
 */
const fetchTownWeatherForecast = async (
  timeFrom: string,
  timeTo: string,
  city: City,
  town: string,
): Promise<TownForcastData | void> => {
  const code = getLocation(city).code;
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-${code}?Authorization=${AUTHORIZATION_KEY}&LocationName=${town}&timeFrom=${timeFrom}&timeTo=${timeTo}`,
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
        description: weatherElements.Wx.Weather,
        weatherCode: weatherElements.Wx.WeatherCode,
        rainPossibility: weatherElements.pop3h.ProbabilityOfPrecipitation,
        comfortability: weatherElements.CI.ComfortIndexDescription,
      } as const satisfies TownForcastData;
    })
    .catch((e) => console.error('鄉鎮市區天氣預報下載失敗', e));
};


type WBGTData = Pick<WeatherElement, 'heatInjuryIndex' | 'heatInjuryWarning'>;
/**
 * 抓取熱傷害分級
 */
const fetchWBGT = async (
  timeFrom: string,
  timeTo: string,
  city: City,
  town: string,
): Promise<WBGTData | void> => {
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/M-A0085-001?Authorization=${AUTHORIZATION_KEY}&CountyName=${city}&TownName=${town}&sort=IssueTime&timeFrom=${timeFrom}&timeTo=${timeTo}`,
  )
    .then((response) => response.json())
    .then((data: WBGTAPIStructure) => {
      const locationData = data.records.Locations[0].Location[0];
      const weatherElement = locationData.Time[0].WeatherElements;
      return {
        heatInjuryIndex: weatherElement.HeatInjuryIndex,
        heatInjuryWarning: weatherElement.HeatInjuryWarning,
      } as const satisfies WBGTData;
    })
    .catch((e) => console.error('熱傷害下載失敗', e));
};

const useWeatherAPI = (
  repStationID: string,
  city: City,
  townValue: string,
) => {
  const [weatherElement, setWeatherElement] = useState<WeatherElement>(() => {
    return {
      observationTime: new Date(),
      locationName: '',
      city: '',
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

  const town = useMemo(
    () => townValue === '---' ? getLocation(city).towns[0] : townValue,
    [townValue]
  );

  // Timeout for refresh
  let refreshTimeoutId: null | number = null;
  const [isRefreshCD, setIsRefreshCD] = useState<boolean>(false);
  const fetchData = useMemo(() => {
    // reset
    if (!isNullish(refreshTimeoutId)) {
      clearTimeout(refreshTimeoutId);
      refreshTimeoutId = null;
    }
    let isCd = false;
    setIsRefreshCD(isCd);
    return async () => {
      if (isCd) return;
      setWeatherElement((prevState) => ({
        ...prevState,
        isLoading: true,
      }));

      const {nextHour_, next3Hour_} = getOpenDataTime();

      const fetchForecast = townValue === '---' ?
        fetchWeatherForecast : fetchTownWeatherForecast;
      const [currentWeather, weatherForecast, heatInjury] = await Promise.all([
        fetchWeatherStation(repStationID),
        fetchForecast(nextHour_, next3Hour_, city, town),
        fetchWBGT(nextHour_, next3Hour_, city, town),
      ]);

      setWeatherElement({
        ...currentWeather!,
        ...weatherForecast!,
        ...heatInjury!,
        city,
        isLoading: false,
      });
      setIsRefreshCD(isCd = true);
      refreshTimeoutId = window.setTimeout(() => {
        isCd = false;
        setIsRefreshCD(isCd);
        refreshTimeoutId = null;
      }, REFRESH_CD);
    };
  }, [repStationID, townValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [weatherElement, fetchData, isRefreshCD] as const;
};

export default useWeatherAPI;
