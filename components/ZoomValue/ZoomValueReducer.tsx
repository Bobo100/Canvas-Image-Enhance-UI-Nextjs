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

// export function reducer(state: State, action: Action): State {
//     switch (action.type) {
//         case ActionType.SET_ZOOM_VALUE:
//             return {
//                 ...state,
//                 zoomValue: action.payload,
//             };
//         default:
//             return state;
//     }
// }


interface IProps {
    children: React.ReactNode;
}

// 定義一個 Context
export const ZoomValueContext = createContext({
    state: initialState,
    dispatch: (action: Action) => { },
})


// 定義一個組件，包裹所有需要使用全局狀態的子組件
const ZoomProvider = ({ children }: IProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        // 把useReducer的state和dispatch放在context中，讓子組件可以取得它們
        <ZoomValueContext.Provider value={{ state, dispatch }}>
            {children}
        </ZoomValueContext.Provider>
    );
};

export default ZoomProvider;