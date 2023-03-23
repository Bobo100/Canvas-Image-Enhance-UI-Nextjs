import { useEffect, useState } from "react";
import Canvas from "../components/Canvas";
import Controlbar from "../components/Controlbar";
import NavBar from "../components/Navbar";

import style from './css/ResultPage.module.scss'

const ResultPage = () => {
    //把圖片放到canvas上
    // 如果沒有圖片，就不顯示canvas 而顯示提示
    // 從 localStorage 取出圖片資料
    const [imageData, setImageData] = useState('');

    useEffect(() => {
        const items = localStorage.getItem("imageData");
        if (items) {
            setImageData(items);
        }
    }, []);

    return (
        <div className="flex">
            <div className={`${style.ResultPage} flex flex-column align-center`}>
                <NavBar />
                {imageData ? <Canvas src={imageData as string} /> : <div className="no-image">請先選擇圖片</div>}
                <Controlbar width={100} height={100} zoom={100} onZoomChange={() => { }} />
            </div>
        </div>
    );
};

export default ResultPage;
