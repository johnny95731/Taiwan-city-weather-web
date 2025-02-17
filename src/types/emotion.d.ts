import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    backgroundColor: string,
    headerColor: string,
    foregroundColor: string,
    menuHoverColor: string,
    optionMenuColor: string,
    optionMenuHoverColor: string,
    optionMenuShadow: string,
    boxShadow: string,
    titleColor: string,
    temperatureColor: string,
    textColor: string,
  }
}
