import { useContext, useReducer } from "react";
import { reducer, initialState, ActionType, ZoomValueContext } from "./ZoomValue/ZoomValueReducer";

// Scrollbar
interface ScrollbarProps {
    className?: string;
    min: number;
    max: number;
    step: number;
}

const Scrollbar: React.FC<ScrollbarProps> = ({ className, min, max, step }) => {

    const { state, dispatch } = useContext(ZoomValueContext);

    const handleScroll = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: ActionType.SET_ZOOM_VALUE,
            payload: Number(e.target.value),
        });
    }

    return (
        <input placeholder="range" className={className} type="range" min={min} max={max} step={step} value={state.zoomValue} onChange={handleScroll} />
    );
};

export default Scrollbar;
