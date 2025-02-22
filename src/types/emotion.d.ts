import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    name: string,
    cardGrad: string,
    bgColor: string,
    hoverBgColor: string,
    boxShadow: string,
    outline: string,
    textColor1: string,
    textColor2: string,
  }
}
