import { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { DragLine } from './DragLine';
import { Decimal } from "decimal.js"
import NextImage from 'next/image';
import style from './scss/Canvas.module.scss'
import { ActionType, ImageRangeActionType, ImageValue } from './ContextAndReducer/ContextAndReducer';
interface CanvasProps {
    src: string;
}
const Canvas = ({ src }: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [image, setImage] = useState<HTMLImageElement>();
    const { state, dispatch } = useContext(ImageValue);
    const maxScaleFactor = 2;
    const minScaleFactor = 0.1;
    const [isDragging, setIsDragging] = useState(false);


    // draggable
    const [image2, setImage2] = useState<HTMLImageElement>();
    const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
    const [dragImageRangeList, setDragImageRangeList] = useState<{ image: HTMLImageElement, x: number, y: number, width: number, height: number }[]>([]);

    useEffect(() => {
        console.log("render");
    })

    useEffect(() => {
        updateCanvasDimensions()
        window.addEventListener('resize', updateCanvasDimensions);
        return () => {
            window.removeEventListener('resize', updateCanvasDimensions);
        };
    }, [updateCanvasDimensions]);

    function updateCanvasDimensions() {
        const canvas = canvasRef.current;
        if (!canvas) return;
        // 取得瀏覽器的寬度
        canvas.width = window.innerWidth;
        if (window.innerWidth > 768)
            canvas.height = 768
        else
            canvas.height = window.innerWidth / 1.7;

        drawImageOnCanvas();
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const img = new Image();
        img.src = src;
        img.onload = () => {
            setImage(img);
        };
    }, [src]);

    const [imageRange, setImageRange] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0
    });

    const handleWheel = useCallback((e: WheelEvent) => {
        if (!image) return;
        e.preventDefault();
        const delta = -Math.sign(e.deltaY);
        let newScaleFactor = state.zoomValue;
        if ((state.zoomValue < maxScaleFactor && delta > 0) || (state.zoomValue > minScaleFactor && delta < 0)) {
            newScaleFactor = new Decimal(state.zoomValue).plus(delta * 0.1).toNumber();
        }
        if (newScaleFactor !== state.zoomValue) {
            dispatch({
                type: ActionType.SET_ZOOM_VALUE,
                payload: newScaleFactor,
            });

            // 計算圖片的範圍
            ImageRange();
        }
    }, [image, state.zoomValue]);

    canvasRef.current?.addEventListener('wheel', handleWheel);


    //  拖移事件 透過button來判斷是否要拖移
    useEffect(() => {
        const handleCanvasMouseMove = (e: MouseEvent) => {
            // 如果滑鼠按下，且在圖片上，就開始拖移
            if (isDragging && e.buttons === 1) {
                console.log("move")
            }
        }
        canvasRef.current?.addEventListener('mousemove', handleCanvasMouseMove);
        return () => {
            canvasRef.current?.removeEventListener('mousemove', handleCanvasMouseMove);
        };
    }, [isDragging]);

    // 用圖片範圍來判斷 是否要重新繪製圖片 (因為我們所有動作結束都必須要更新圖片範圍)
    useEffect(() => {
        if (!image) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 畫圖
        drawImageOnCanvas();
    }, [imageRange]);


    // 計算圖片範圍
    function ImageRange() {
        if (!image) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 畫圖
        const ratio = Math.min(
            canvas.width / (image.width / 2),
            canvas.height / (image.height / 2)
        );
        const width = `${(ratio * image.width) / 2}px`;
        const height = `${(ratio * image.height) / 2}px`;
        const x = (canvas.width - state.zoomValue * parseInt(width)) / 2;
        const y = (canvas.height - state.zoomValue * parseInt(height)) / 2;
        const w = state.zoomValue * parseInt(width);
        const h = state.zoomValue * parseInt(height);

        // 設置圖片範圍
        setImageRange({
            x: x,
            y: y,
            width: w,
            height: h
        });
    }


    function drawImageOnCanvas() {
        if (!image) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 畫圖
        const ratio = Math.min(
            canvas.width / (image.width / 2),
            canvas.height / (image.height / 2)
        );
        const width = `${(ratio * image.width) / 2}px`;
        const height = `${(ratio * image.height) / 2}px`;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(state.zoomValue, state.zoomValue);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        ctx.drawImage(
            image,
            canvas.width / 2 - parseInt(width) / 2,
            canvas.height / 2 - parseInt(height) / 2,
            parseInt(width),
            parseInt(height)
        );

        // 要想想 這邊要怎麼處理
        if (dragImageRangeList) {
            ctx.restore();
            for (let i = 0; i < dragImageRangeList.length; i++) {
                const item = dragImageRangeList[i];
                ctx.drawImage(
                    item.image,
                    item.x,
                    item.y,
                    item.width,
                    item.height
                );
            }
        }
    }


    function isMouseOverImage(mouseX: number, mouseY: number): boolean {
        const canvas = canvasRef.current;
        if (!canvas) return false;
        const ctx = canvas.getContext("2d");
        if (!ctx) return false;

        // 計算圖形路徑
        ctx.beginPath();
        ctx.rect(imageRange.x, imageRange.y, imageRange.width, imageRange.height);

        // 判斷滑鼠是否在圖形內
        return ctx.isPointInPath(mouseX, mouseY);
    }


    // 當滑鼠在 線 上按下時，就開始拖移
    const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (isMouseOverImage(e.clientX, e.clientY)) {
            setIsDragging(true);
        }
    };

    const handleCanvasMouseUp = () => {
        setIsDragging(false);
    };



    function handleDragOver(event: React.DragEvent<HTMLCanvasElement>) {
        event.preventDefault();
    }

    function handleDrop(event: React.DragEvent<HTMLCanvasElement>) {
        event.preventDefault();
        if (!image2) return;

        // 圖片的位置 = 滑鼠在瀏覽器的位置 - canvas的位置 - 一開始抓取的滑鼠在圖片的位置
        const x = event.clientX - canvasRef.current!.offsetLeft - startCoords.x;
        const y = event.clientY - canvasRef.current!.offsetTop - startCoords.y;
        const width = image2.width;
        const height = image2.height;

        setDragImageRangeList([...dragImageRangeList, { image: image2, x: x, y: y, width: width, height: height }])
        // dragImageRangeListRef.current.push({ image: image2, x: x, y: y, width: width, height: height });
    }


    // draggble
    function handleDragStart(event: React.DragEvent<HTMLImageElement>) {
        const startX = event.clientX - event.currentTarget.offsetLeft;
        const startY = event.clientY - event.currentTarget.offsetTop;
        // setIsDraggable(true);
        setStartCoords({ x: startX, y: startY });
        setImage2(event.currentTarget);
    }

    function handleDragEnd(event: React.DragEvent<HTMLImageElement>) {
        // setIsDraggable(false);
    }


    return (
        <div className={style.result}>
            <canvas
                id="myCanvas"
                className={style.canvas}
                ref={canvasRef}
                onMouseDown={handleCanvasMouseDown}
                onMouseUp={handleCanvasMouseUp}
                onDragOver={handleDragOver}
                onDrop={handleDrop}

            />
            <DragLine />
            <NextImage src="/images/imagelist/01.jpg" width={50} height={50} alt=""
                draggable
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            />
            <NextImage src="/images/imagelist/02.jpg" width={50} height={50} alt=""
                draggable
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            />
        </div>
    );
};

export default Canvas;