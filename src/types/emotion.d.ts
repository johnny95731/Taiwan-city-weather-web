import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    name: string,
    bgColor1: string,
    cardGrad: string,
    menuHoverColor: string,
    boxShadow: string,
    titleColor: string,
    textColor1: string,
    textColor2: string,
  }
}
