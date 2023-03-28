import { createContext, useReducer } from "react";

export type State = {
    zoomValue: number;
};

export const initialState = {
    zoomValue: 1,
};

export enum ActionType {
    SET_ZOOM_VALUE = 'SET_ZOOM_VALUE',
}

export type Action = {
    type: ActionType;
    payload: number;
}

export const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case ActionType.SET_ZOOM_VALUE:
            return {
                ...state,
                zoomValue: action.payload,
            };
        default:
            return state;
    }
}



///
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
export const ImageValue = createContext({
    state: initialState,
    dispatch: (action: Action) => { },
    imageRange: imageRangeInitialState,
    imageRange_Dispatch: (action: ImageAction) => { },
})

const ImageValueProvider = ({ children }: IProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [imageRange, imageRange_Dispatch] = useReducer(imageRange_reducer, imageRangeInitialState);
    return (
        <ImageValue.Provider value={{ state, dispatch, imageRange, imageRange_Dispatch }}>
            {children}
        </ImageValue.Provider>
    )
}

export default ImageValueProvider;