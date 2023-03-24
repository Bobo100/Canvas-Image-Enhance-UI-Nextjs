import Image from 'next/image';
import { useContext, useReducer } from 'react';
import style from './css/Controlbar.module.scss'
import Scrollbar from './Scrollbar';
import { reducer, initialState, ActionType, ZoomValueContext } from './ZoomValue/ZoomValueReducer';

interface ControlbarProps {
    width: number;
    height: number;
    zoomMin: number;
    zoomMax: number;
}
const Controlbar = ({ width, height, zoomMin, zoomMax }: ControlbarProps) => {

    const { state, dispatch } = useContext(ZoomValueContext);

    const handleMinusClick = () => {
        dispatch({
            type: ActionType.SET_ZOOM_VALUE,
            payload: state.zoomValue - 0.1,
        });
    }

    const handlePlusClick = () => {
        dispatch({
            type: ActionType.SET_ZOOM_VALUE,
            payload: state.zoomValue + 0.1,
        });
    }

    return (
        <div className={`${style.controlbar} flex align-center justify-center`}>
            <div className={`${style.size} flex`}>
                <div>width:</div>
                <div>{width}px</div>
                <div>height</div>
                <div>{height}px</div>
            </div>

            <div className={`zoom_scrollbar flex`}>
                <Image className={`${style.icon}`} src="/images/icon_minus.svg" alt="logo" width={100} height={100} onClick={handleMinusClick} />
                <Scrollbar className="vertical" min={zoomMin} max={zoomMax} step={0.1} />
                <Image className={`${style.icon}`} src="/images/icon_plus.svg" alt="logo" width={100} height={100} onClick={handlePlusClick} />
                <div className={style.window_size_percent}>{(state.zoomValue * 100).toFixed(1)}%</div>
                <Image className={`${style.icon}`} src="/images/btn_3lv_bottom_reset_size.svg" alt="logo" width={100} height={100} />
            </div>
            <div className={`${style.upload_btn}`}>Upload New</div>
        </div>
    )
}

export default Controlbar
