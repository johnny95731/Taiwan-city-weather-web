import {useEffect, useMemo, useRef, useState} from "react";
import {getCode, getFirstTown} from "./../utils/helpers";
import {REFRESH_CD} from "./../utils/constants";

// Constants
const AUTHORIZATION_KEY = "CWA-150C2D4A-E612-4AC4-BD27-3D0A604C69AA";


/**
 * 抓取氣象站資料
 */
const fetchCurrentWeather = async ({stationID}) => {
  const isUnmanned = stationID.startsWith("C"); // 無人站
  const code = isUnmanned ? "O-A0001-001" : "O-A0003-001";
  return fetch(
      `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${code}?Authorization=${AUTHORIZATION_KEY}&StationId=${stationID}`,
  )
      .then((response) => response.json())
      .then((data) => {
        // console.log(code, stationID);
        const locationData = data.records.Station[0];
        const weatherElement = locationData.WeatherElement;
        const windSpeed = isUnmanned ?
          weatherElement.WindSpeed : weatherElement.Max10MinAverage.WindSpeed;

        return {
          observationTime: locationData.ObsTime.DateTime,
          locationName: locationData.StationName,
          temperature: weatherElement.AirTemperature,
          windSpeed,
        };
      })
      .catch((e) => console.error("氣象站資料下載失敗", e));
};

/**
 * 抓取縣市天氣預報資料
 */
const fetchWeatherForecast = async ({cityName}) => {
  return fetch(
      `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KEY}&locationName=${cityName}`,
  )
      .then((response) => response.json())
      .then((data) => {
        const locationData = data.records.location[0];
        const weatherElements = locationData.weatherElement.reduce(
            (neededElements, item) => {
              if (["Wx", "PoP", "CI"].includes(item.elementName)) {
                neededElements[item.elementName] = item.time[0].parameter;
              }
              return neededElements;
            },
            {},
        );

        return {
          cityName: cityName,
          description: weatherElements.Wx.parameterName,
          weatherCode: weatherElements.Wx.parameterValue,
          rainPossibility: weatherElements.PoP.parameterName,
          comfortability: weatherElements.CI.parameterName,
        };
      })
      .catch((e) => console.error("縣市天氣預報下載失敗", e));
};

/**
 * 抓取鄉鎮市區天氣預報資料
 */
const fetchTownWeatherForecast = async ({
  cityName,
  townName,
}) => {
  const code = getCode(cityName);
  return fetch(
      `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-${code}?Authorization=${AUTHORIZATION_KEY}&locationName=${townName}`,
  )
      .then((response) => response.json())
      .then((data) => {
        const locationData = data.records.locations[0].location[0];
        const weatherElements = locationData.weatherElement.reduce(
            (neededElements, item) => {
              if (["Wx", "PoP6h", "CI"].includes(item.elementName)) {
                neededElements[item.elementName] = item.time[0].elementValue;
              }
              return neededElements;
            },
            {},
        );

        return {
          cityName: cityName,
          townName: townName,
          description: weatherElements.Wx[0].value,
          weatherCode: weatherElements.Wx[1].value,
          rainPossibility: weatherElements.PoP6h[0].value,
          comfortability: weatherElements.CI[1].value,
        };
      })
      .catch((e) => console.error("鄉鎮市區天氣預報下載失敗", e));
};

/**
 * 抓取熱傷害分級
 */
const fetchWBGT = async ({
  cityName,
  townName,
}) => {
  const townName_ = townName === "---" ? getFirstTown(cityName) : townName;
  return fetch(
      `https://opendata.cwa.gov.tw/api/v1/rest/datastore/M-A0085-001?Authorization=${AUTHORIZATION_KEY}&CountyName=${cityName}&TownName=${townName_}&sort=IssueTime`,
  )
      .then((response) => response.json())
      .then((data) => {
        const locationData = data.records.Locations[0].Location[0].Time[0];
        const temp = {
          heatInjuryIndex: locationData.WeatherElements.HeatInjuryIndex,
          heatInjuryWarning: locationData.WeatherElements.HeatInjuryWarning,
        };
        return temp;
      })
      .catch((e) => console.error("熱傷害下載失敗", e));
};


const useWeatherAPI = ({
  repStationID,
  cityName,
  townName,
}) => {
  const [weatherElement, setWeatherElement] = useState(() => {
    return {
      observationTime: new Date(),
      locationName: "",
      cityName: "",
      temperature: 0,
      windSpeed: 0,
      description: "",
      weatherCode: 0,
      rainPossibility: 0,
      comfortability: "",
      heatInjuryIndex: 0,
      heatInjuryWarning: "",
      isLoading: true,
    };
  });

  // Timeout for
  const refreshTimeoutId = useRef(null);
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
      const fetchTownForecast = townName === "---" ?
        fetchWeatherForecast : fetchTownWeatherForecast;
      const [currentWeather, weatherForecast, heatInjury] = await Promise.all([
        fetchCurrentWeather({stationID: repStationID}),
        fetchTownForecast({cityName, townName}),
        fetchWBGT({cityName, townName}),
      ]);

      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        ...heatInjury,
        isLoading: false,
      });
      setIsRefreshCD(isCd = true);
      refreshTimeoutId.current = setTimeout(() => {
        isCd = false;
        setIsRefreshCD(isCd);
        refreshTimeoutId.current = null;
      }, REFRESH_CD);
    };
  }, [repStationID, townName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [weatherElement, fetchData, isRefreshCD];
};

export default useWeatherAPI;
