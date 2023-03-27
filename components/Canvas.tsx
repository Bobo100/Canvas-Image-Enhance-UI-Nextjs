import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { DragLine } from './DragLine';
import { Decimal } from "decimal.js"
import NextImage from 'next/image';
import style from './scss/Canvas.module.scss'
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


    // draggable
    const [isDraggable, setIsDraggable] = useState(false);
    const [image2, setImage2] = useState<HTMLImageElement>();
    const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
    const [dragImageRangeList, setDragImageRangeList] = useState<{ image: HTMLImageElement, x: number, y: number, width: number, height: number }[]>([]);


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
        if (image2) {
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

        // const context = canvasRef.current!.getContext("2d");
        // context!.drawImage(image2, x, y, width, height);
        setDragImageRangeList([...dragImageRangeList, { image: image2, x: x, y: y, width: width, height: height }])
    }


    // draggble
    function handleDragStart(event: React.DragEvent<HTMLImageElement>) {
        const startX = event.clientX - event.currentTarget.offsetLeft;
        const startY = event.clientY - event.currentTarget.offsetTop;
        setIsDraggable(true);
        setStartCoords({ x: startX, y: startY });
        setImage2(event.currentTarget);
    }

    function handleDragEnd(event: React.DragEvent<HTMLImageElement>) {
        setIsDraggable(false);
        // setImage2(image2.filter((image) => image !== event.currentTarget))
    }

    // useEffect(() => {
    //     if (!canvasRef.current || !image2 || !isDraggable) return;

    //     const context = canvasRef.current.getContext("2d");
    //     const { x, y } = startCoords;
    //     const width = image2[0].width;
    //     const height = image2[0].height;

    //     context?.drawImage(image2[0], x, y, width, height);
    // }, [isDraggable]);

    console.log("render")



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
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    />
                    <DragLine />
                    <NextImage src="/images/imagelist/01.jpg" width={50} height={50} alt=""
                        draggable
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    />
                </div>
            </ImageRangeProvider>
        </>
    );
};

export default Canvas;