import { createContext, useReducer } from "react";

export type ImageRangeState = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export const imageRangeInitialState = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
};

export enum ImageRangeActionType {
    SET_IMAGE_RANGE = 'SET_IMAGE_RANGE',
}

type ImageAction = {
    type: ImageRangeActionType;
    payload: ImageRangeState;
}


export const imageRange_reducer = (state: ImageRangeState, action: ImageAction) => {
    switch (action.type) {
        case ImageRangeActionType.SET_IMAGE_RANGE:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}

interface IProps {
    children: React.ReactNode;
}

// 定義一個 Context
export const ImageRangeContext = createContext({
    imageRange: imageRangeInitialState,
    imageRange_Dispatch: (action: ImageAction) => { },
})

const ImageRangeProvider = ({ children }: IProps) => {
    const [imageRange, imageRange_Dispatch] = useReducer(imageRange_reducer, imageRangeInitialState);
    return (
        <ImageRangeContext.Provider value={{ imageRange, imageRange_Dispatch }}>
            {children}
        </ImageRangeContext.Provider>
    )
}

export default ImageRangeProvider;