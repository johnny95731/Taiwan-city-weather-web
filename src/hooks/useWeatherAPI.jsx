import { useCallback, useEffect, useState } from 'react';
import { getCode, getGov } from "./../utils/helpers"

const fetchCurrentWeather = ({ authorizationKey, stationID }) => {
  /**
   * 抓取氣象站資料
   */
  const code = stationID.startsWith("C") ? "O-A0001-001" : "O-A0003-001"
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${code}?Authorization=${authorizationKey}&stationId=${stationID}`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (['WDSD', 'TEMP'].includes(item.elementName)) {
            neededElements[item.elementName] = item.elementValue;
          }
          return neededElements;
        },
        {}
      );

      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
      };
    });
};

const fetchWeatherForecast = ({ authorizationKey, cityName }) => {
  /**
   * 抓取縣市天氣預報資料
   */
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
            neededElements[item.elementName] = item.time[0].parameter;
          }
          return neededElements;
        },
        {}
      );

      return {
        cityName: cityName,
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName,
      };
    });
};

const fetchTownWeatherForecast = ({
  authorizationKey,
  cityName,
  townName
}) => {
  /**
   * 抓取鄉鎮市區天氣預報資料
   */
  const code = getCode(cityName);
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-${code}?Authorization=${authorizationKey}&locationName=${townName}`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.locations[0].location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (['Wx', 'PoP6h', 'CI'].includes(item.elementName)) {
            neededElements[item.elementName] = item.time[0].elementValue;
          }
          return neededElements;
        },
        {}
      );

      return {
        cityName: cityName,
        townName: townName,
        description: weatherElements.Wx[0].value,
        weatherCode: weatherElements.Wx[1].value,
        rainPossibility: weatherElements.PoP6h[0].value,
        comfortability: weatherElements.CI[1].value,
      };
    });
};

const fetchWBGT = ({
  authorizationKey,
  cityName,
  townName
}) => {
  /**
   * 抓取熱傷害分級
   */
  const townName_ = townName === "---" ? getGov(cityName) : townName;
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/M-A0085-001?Authorization=${authorizationKey}&CountyName=${cityName}&TownName=${townName_}&sort=IssueTime`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.Locations[0].Location[0].Time[0];
      const temp = {
        heatInjuryIndex: locationData.WeatherElements.HeatInjuryIndex,
        heatInjuryWarning: locationData.WeatherElements.HeatInjuryWarning
      };
      return temp
    });
};


const useWeatherAPI = ({
  locationName: repStationID,
  cityName,
  townName,
  authorizationKey
}) => {
  const [weatherElement, setWeatherElement] = useState(() => {
    return {
      observationTime: new Date(),
      locationName: '',
      cityName: "",
      temperature: 0,
      windSpeed: 0,
      description: '',
      weatherCode: 0,
      rainPossibility: 0,
      comfortability: '',
      heatInjuryIndex: 0,
      heatInjuryWarning: "",
      isLoading: true,
    };
  });

  const fetchData = useCallback(async () => {
    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    const func = townName === "---" ? fetchWeatherForecast : fetchTownWeatherForecast
    const [currentWeather, weatherForecast, heatInjury] = await Promise.all([
      fetchCurrentWeather({ authorizationKey, stationID: repStationID }),
      func({ authorizationKey, cityName, townName }),
      fetchWBGT({ authorizationKey, cityName, townName })
    ]);

    setWeatherElement({
      ...currentWeather,
      ...weatherForecast,
      ...heatInjury,
      isLoading: false,
    });
  }, [cityName, repStationID, townName, authorizationKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [weatherElement, fetchData];
};

export default useWeatherAPI;