import { useContext, useEffect, useState } from "react";
import Canvas from "../components/Canvas";
import Controlbar from "../components/Controlbar";
import ImageList from "../components/ImageList/ImageList";
import NavBar from "../components/Navbar";
import ZoomProvider, { ZoomValueContext } from "../components/ZoomValue/ZoomValueReducer";

import style from './css/ResultPage.module.scss'

const ResultPage = () => {
    //把圖片放到canvas上
    // 如果沒有圖片，就不顯示canvas 而顯示提示
    // 從 localStorage 取出圖片資料
    const [imageData, setImageData] = useState('');

    const [getImageSize, setImageSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const items = localStorage.getItem("imageData");
        if (items) {
            setImageData(items);
            const img = new Image();
            img.src = items;
            img.onload = () => {
                setImageSize({ width: img.width, height: img.height });
            }
        }
    }, []);

    return (
        <ZoomProvider>
            <div className="flex">
                <div className={`${style.ResultPage} flex flex-column align-center`}>
                    <NavBar />
                    {imageData ? <Canvas src={imageData as string} /> : <div className="no-image">請先選擇圖片</div>}
                    <div className="absolute">before</div>
                    <div className="absolute">after</div>
                    <Controlbar width={getImageSize.width} height={getImageSize.height} zoomMin={0.1} zoomMax={2} />
                    <ImageList />
                </div>
            </div>
        </ZoomProvider>
    );
};

export default ResultPage;
