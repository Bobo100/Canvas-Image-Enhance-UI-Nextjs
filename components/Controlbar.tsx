import Image from 'next/image';
import style from './css/Controlbar.module.scss'
import Scrollbar from './Scrollbar';

interface ControlbarProps {
    width: number;
    height: number;
    zoom: number;
    onZoomChange: (zoom: number) => void;
}
const Controlbar = ({ width, height, zoom, onZoomChange }: ControlbarProps) => {
    return (
        <div className={`${style.controlbar} flex align-center justify-center`}>
            <div className={`${style.size} flex`}>
                <div>width:</div>
                <div>{width}px</div>
                <div>height</div>
                <div>{height}px</div>
            </div>

            <div className={`zoom_scrollbar flex`}>
                <Image className={`${style.icon}`} src="/images/icon_minus.svg" alt="logo" width={100} height={100} />
                <Scrollbar className="vertical" min={0} max={100} step={0.1} value={zoom} onChange={onZoomChange} />
                <Image className={`${style.icon}`} src="/images/icon_plus.svg" alt="logo" width={100} height={100} />
                <div>%number</div>
                <div>resize(fit)</div>
            </div>
            <div className={`${style.upload_btn}`}>Upload New</div>
        </div>
    )
}

export default Controlbar
