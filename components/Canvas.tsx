import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { DragLine } from './DragLine';
import { Decimal } from "decimal.js"
import style from './css/Canvas.module.scss'
import { ActionType, ZoomValueContext } from './ZoomValue/ZoomValueReducer';
import ImageRangeProvider, { ImageRangeActionType, ImageRangeContext } from './ImageRange/ImageRangeReducer';
interface CanvasProps {
    src: string;
}

const Canvas = ({ src }: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const { state, dispatch } = useContext(ZoomValueContext);
    const maxScaleFactor = 2;
    const minScaleFactor = 0.1;
    const [isDragging, setIsDragging] = useState(false);

    const { imageRange, imageRange_Dispatch } = useContext(ImageRangeContext);

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


    useEffect(() => {
        if (!image) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        // 畫圖
        drawImageOnCanvas();

        // 畫圖
        const ratio = Math.min(
            canvas.width / (image.width / 2),
            canvas.height / (image.height / 2)
        );
        const width = `${(ratio * image.width) / 2}px`;
        const height = `${(ratio * image.height) / 2}px`;

        const x = (canvas.width - state.zoomValue * parseInt(width)) / 2
        const y = (canvas.height - state.zoomValue * parseInt(height)) / 2
        const w = state.zoomValue * parseInt(width)
        const h = state.zoomValue * parseInt(height)

        // imageRange_Dispatch({
        //     type: ImageRangeActionType.SET_IMAGE_RANGE,
        //     payload: {
        //         x: x,
        //         y: y,
        //         width: w,
        //         height: h
        //     }
        // })

        const handleWheel = (e: WheelEvent) => {
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
            }
        }
        canvas.addEventListener('wheel', handleWheel);


        // 拖移事件 透過button來判斷是否要拖移
        const handleCanvasMouseMove = (e: MouseEvent) => {
            // 如果滑鼠按下，且在圖片上，就開始拖移
            if (isDragging && e.buttons === 1) {
                console.log("dragging")
            }
        }
        canvas.addEventListener('mousemove', handleCanvasMouseMove);

        return () => {
            canvas.removeEventListener('wheel', handleWheel);
            canvas.removeEventListener('mousemove', handleCanvasMouseMove);
        }
    }, [image, state.zoomValue, isDragging]);


    console.log("r")


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
    return (
        <>
            <ImageRangeProvider>
                <div className={style.result}>
                    <canvas
                        id="myCanvas"
                        className={style.canvas}
                        ref={canvasRef}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseUp={handleCanvasMouseUp}
                    />
                    <DragLine />
                </div>
            </ImageRangeProvider>
        </>
    );
};

export default Canvas;