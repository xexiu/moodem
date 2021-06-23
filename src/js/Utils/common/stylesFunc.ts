import { Dimensions, PixelRatio } from 'react-native';

export function padding(a = 0, b: number, c: number, d: number) {
    return {
        paddingTop: a,
        paddingRight: b || a,
        paddingBottom: c || a,
        paddingLeft: d || a
    };
}

export const widthPercentageToDP = (widthPercent: any) => {
    const screenWidth = Dimensions.get('window').width;
    const elemWidth = parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
};
export const heightPercentageToDP = (heightPercent: any) => {
    const screenHeight = Dimensions.get('window').height;
    const elemHeight = parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
};
export const proportionedPixel = (designPixels: number) => {
    const screenProportion = Dimensions.get('window').width / 180;
    return PixelRatio.roundToNearestPixel(designPixels * screenProportion);
};
