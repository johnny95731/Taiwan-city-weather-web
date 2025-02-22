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
 * Update every 12 hours.
 */
declare type CityForecastAPIStructure = {
  records: {
    location: {
      locationName: string,
      weatherElement: {
        elementName: 'Wx' | 'PoP' | 'CI' | 'MinT' | 'MaxT',
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
 * Data structure of town weather forcast API.
 * Update every 3 hour.
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
          ElementName: '溫度' | '露點溫度' | '相對濕度' | '體感溫度' |
              '舒適度指數' | '風速' | '風向' | '3小時降雨機率' | '天氣現象' |
              '天氣預報綜合描述',
          Time: {
            DataTime: string,
            ElementValue: Record<string, string>[]
          }[]
        }[]
      }[]
    }[]
  }
}
