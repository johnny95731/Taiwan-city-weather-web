/**
 * Data structure of unmanned weather station API
 */
declare type UnmannedWeatherStationAPIStructure = {
  records: {
    Station: {
      StationName: string,
      StationId: string,
      ObsTime: {
        DateTime: string,
      },
      WeatherElement: {
        /**
         * 天氣現象
         */
        Weather: string,
        Now: {
          /**
           * 當日降水量 (毫米)
           */
          Precipitation: number
        },
        /**
         * 平均風風向 (度)
         */
        WindDirection: number,
        /**
         * 平均風風速 (公尺/秒)
         */
        WindSpeed: number,
        /**
         * 氣溫 (攝氏度)
         */
        AirTemperature: number,
        /**
         * 相對濕度 (百分率 %)
         */
        RelativeHumidity: number,
        /**
         * 氣壓 (百帕 hPa)
         */
        AirPressure: number,
        GustInfo: {
          /**
           * 最大瞬間風風速 (公尺/秒)
           */
          PeakGustSpeed: number,
          /**
           * 最大瞬間風發生發生在
           */
          Occurred_at: {
            /**
             * 最大瞬間風發生風向 (度)
             */
            WindDirection: number,
            /**
             * 紀錄時間
             */
            DateTime: string,
          },
          /**
           * 當日極值
           */
          DailyExtreme: {
            /**
             * 當日高點
             */
            DailyHigh: {
              TemperatureInfo: {
                /**
                 * 當日最低溫
                 */
                AirTemperature: number,
                /**
                 * 紀錄時間
                 */
                Occurred_at: {
                  DateTime: string
                }
              }
            },
            /**
             * 當日低點
             */
            DailyLow: {
              TemperatureInfo: {
                /**
                 * 當日最低溫
                 */
                AirTemperature: number,
                /**
                 * 紀錄時間
                 */
                Occurred_at: {
                  DateTime: string
                }
              }
            }
          }
        },
      };
    }[];
  };
};

/**
 * Data structure of manned weather station API
 */
declare type MannedWeatherStationAPIStructure =
  UnmannedWeatherStationAPIStructure & {
  records: {
    Station: {
      WeatherElement: {
        /**
         * 紫外線指數
         */
        UVIndex: number,
        /**
         * 最大10分鐘平均風
         */
        Max10MinAverage: {
          /**
           * 最大10分鐘平均風速 (公尺/秒)
           */
          WindSpeed: number,
          /**
           * 最大10分鐘平均風發生在
           */
          Occurred_at: {
            /**
             * 最大10分鐘平均風風向
             */
            WindDirection: number,
            /**
             * 紀錄時間
             */
            DateTime: string
          }
        },
      };
    }[];
  };
};


/**
 * Data structure of city weather forcast API
 */
declare type CityForecastAPIStructure = {
  records: {
    location: {
      locationName: string,
      weatherElement: {
        elementName: string,
        time: {
          startTime: string,
          string: string,
          parameter: {
            parameterName: string,
            parameterUnit: string
          }
        }[]
      }[]
    }[]
  }
}

/**
 * Data structure of town weather forcast API
 */
declare type TownForecastAPIStructure = {
  records: {
    Locations: {
      Location: {
        LocationName: string,
        Geocode: string,
        Latitude: string,
        Longitude: string,
        WeatherElement: {
          ElementName: string,
          Time: {
            DataTime: string,
            ElementValue: Record<string, string>[]
          }[]
        }[]
      }[]
    }[]
  }
}


/**
 * Data structure of WBGT API
 * WBGT: Wet Bulb Globe Temperature 綜合溫度熱指數(
 */
declare type WBGTAPIStructure = {
  records: {
    Locations: {
      CountyName: string,
      Location: {
        TownName: string,
        Geocode: string,
        Latitude: string,
        Longitude: string,
        Time: {
          IssueTime: string,
          WeatherElements: {
            HeatInjuryIndex: number,
            HeatInjuryWarning: string
          }
        }[]
      }[]
    }[]
  }
}
