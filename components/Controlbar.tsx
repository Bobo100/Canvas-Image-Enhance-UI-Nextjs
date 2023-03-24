import Image from 'next/image';
import style from './css/Controlbar.module.scss'
import Scrollbar from './Scrollbar';

interface ControlbarProps {
    width: number;
    height: number;
    zoomMin: number;
    zoomMax: number;
    zoom: number;
    onZoomChange: (zoom: number) => void;
}
const Controlbar = ({ width, height, zoomMin, zoomMax, zoom, onZoomChange }: ControlbarProps) => {

    const handleMinusClick = () => {
        onZoomChange(zoom - 0.1);
    }

    const handlePlusClick = () => {
        onZoomChange(zoom + 0.1);
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
                <Scrollbar className="vertical" min={zoomMin} max={zoomMax} step={0.1} value={zoom} onChange={onZoomChange} />
                <Image className={`${style.icon}`} src="/images/icon_plus.svg" alt="logo" width={100} height={100} onClick={handlePlusClick} />
                <div className={style.window_size_percent}>{(zoom * 100).toFixed(1)}%</div>
                <Image className={`${style.icon}`} src="/images/btn_3lv_bottom_reset_size.svg" alt="logo" width={100} height={100} />
            </div>
            <div className={`${style.upload_btn}`}>Upload New</div>
        </div>
    )
}

export default Controlbar
