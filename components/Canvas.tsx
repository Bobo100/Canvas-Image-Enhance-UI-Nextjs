import { useEffect, useRef, useState } from 'react';
import { DragLine } from './DragLine';
import { Decimal } from "decimal.js"
import style from './css/Canvas.module.scss'
interface CanvasProps {
    src: string;
}
const Canvas = ({ src }: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [scaleFactor, setScaleFactor] = useState(1);
    const maxScaleFactor = 3;
    const minScaleFactor = 0.1;

    useEffect(() => {
        updateCanvasDimensions()
        window.addEventListener('resize', updateCanvasDimensions);
        return () => {
            window.removeEventListener('resize', updateCanvasDimensions);
        };
    }, [updateCanvasDimensions]);


    function updateCanvasDimensions() {
        const canvas = canvasRef.current;
        // 取得瀏覽器的寬度
        const width = window.innerWidth;
        canvas.width = width;
        if (width > 768)
            canvas.height = 768
        else
            canvas.height = width / 1.7;

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


        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = -Math.sign(e.deltaY);
            let newScaleFactor = scaleFactor;
            if ((scaleFactor < maxScaleFactor && delta > 0) || (scaleFactor > minScaleFactor && delta < 0)) {
                newScaleFactor = new Decimal(scaleFactor).plus(delta * 0.1).toNumber();
            }
            if (newScaleFactor !== scaleFactor) {
                setScaleFactor(newScaleFactor);
            }
        }
        canvas.addEventListener('wheel', handleWheel);

        return () => {
            canvas.removeEventListener('wheel', handleWheel);
        }


        // 記錄圖片的範圍
        // const ratio = Math.min(
        //     canvas.width / (image.width / 2),
        //     canvas.height / (image.height / 2)
        // );
        // const width = `${(ratio * image.width) / 2}px`;
        // const height = `${(ratio * image.height) / 2}px`;
        // setImageRange({
        //     left: canvas.width / 2 - parseInt(width) / 2,
        //     right: canvas.width / 2 + parseInt(width) / 2,
        //     top: canvas.height / 2 - parseInt(height) / 2,
        //     bottom: canvas.height / 2 + parseInt(height) / 2,
        // });
    }, [image, scaleFactor]);


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
        ctx.scale(scaleFactor, scaleFactor);
        console.log(scaleFactor)
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        ctx.drawImage(
            image,
            canvas.width / 2 - parseInt(width) / 2,
            canvas.height / 2 - parseInt(height) / 2,
            parseInt(width),
            parseInt(height)
        );


    }


    // drag Canvas
    const [isDragging, setIsDragging] = useState(false);
    const [imageRange, setImageRange] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
    // 紀錄最後一次的滑鼠座標 目的是為了計算滑鼠移動的距離
    const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
    // 確認是第一次拖移
    const [firstDrag, setFirstDrag] = useState(true);

    // useEffect(() => {
    //     const handleMouseMove = (e: MouseEvent) => {
    //         const canvas = canvasRef.current;
    //         if (!canvas) return;
    //         const ctx = canvas.getContext("2d");
    //         if (!ctx) return;

    //         if (isDragging && image) {
    //             // 滑鼠不能超過視窗範圍
    //             if (e.clientX < 0 || e.clientX > window.innerWidth - 1 || e.clientY < 0 || e.clientY > window.innerHeight - 1) {
    //                 return;
    //             }
    //             const canvasRect = canvas.getBoundingClientRect();
    //             // console.log(canvasX, canvasY);
    //             // 滑鼠在 canvas 上的座標
    //             const mouseCanvasX = ((e.clientX - canvasRect.left) / canvasRect.width) * canvas.width;
    //             const mouseCanvasY = ((e.clientY - canvasRect.top) / canvasRect.height) * canvas.height;

    //             // 如果在圖片範圍內，才動
    //             if (mouseCanvasX > imageRange.left && mouseCanvasX < imageRange.right && mouseCanvasY > imageRange.top && mouseCanvasY < imageRange.bottom) {
    //                 // 滑鼠移動的距離
    //                 let deltaX = mouseCanvasX - lastMousePosition.x;
    //                 let deltaY = mouseCanvasY - lastMousePosition.y;

    //                 // 第一次拖移
    //                 if (firstDrag) {
    //                     deltaX = 0;
    //                     deltaY = 0;
    //                     setLastMousePosition({ x: mouseCanvasX, y: mouseCanvasY });
    //                     setFirstDrag(false);
    //                 }

    //                 requestAnimationFrame(() => {
    //                     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //                     // 圖片左上角的座標 + 滑鼠移動的距離
    //                     ctx.drawImage(image, imageRange.left, imageRange.top, imageRange.right - imageRange.left, imageRange.bottom - imageRange.top);
    //                 });

    //                 // 如果 圖片左上角的座標 + 滑鼠移動的距離 < 0 就把滑鼠移動的距離設為 0
    //                 if (imageRange.left + deltaX < 0) {
    //                     deltaX = -imageRange.left;
    //                 }
    //                 if (imageRange.top + deltaY < 0) {
    //                     deltaY = -imageRange.top;
    //                 }
    //                 // 如果 圖片右下角的座標 + 滑鼠移動的距離 > canvas 範圍 就把滑鼠移動的距離設為 canvas 範圍 - 圖片右下角的座標
    //                 // 但說穿了就是圖片不能超過 canvas 範圍
    //                 // 也可以說deltaX 會等於0 
    //                 if (imageRange.right + deltaX > canvas.width) {
    //                     deltaX = 0;
    //                 }
    //                 if (imageRange.bottom + deltaY > canvas.height) {
    //                     deltaY = 0;
    //                 }

    //                 setImageRange({
    //                     left: imageRange.left + deltaX,
    //                     right: imageRange.right + deltaX,
    //                     top: imageRange.top + deltaY,
    //                     bottom: imageRange.bottom + deltaY,
    //                 });
    //                 setLastMousePosition({ x: mouseCanvasX, y: mouseCanvasY });
    //             }
    //         }
    //     };

    //     const handleMouseUp = () => {
    //         setIsDragging(false);
    //         // 重置
    //         setFirstDrag(true);
    //     };

    //     // 如果滑鼠移出視窗，就停止拖移
    //     const handleMouseLeave = () => {
    //         setIsDragging(false);
    //         // 重置
    //         setFirstDrag(true);
    //     };

    //     document.addEventListener("mousemove", handleMouseMove);
    //     document.addEventListener("mouseup", handleMouseUp);
    //     document.addEventListener("mouseleave", handleMouseLeave);

    //     return () => {

    //         document.removeEventListener("mousemove", handleMouseMove);
    //         document.removeEventListener("mouseup", handleMouseUp);
    //         document.removeEventListener("mouseleave", handleMouseLeave);
    //     };
    // }, [firstDrag, image, imageRange, isDragging, lastMousePosition.x, lastMousePosition.y]);


    // 當滑鼠在 線 上按下時，就開始拖移
    const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        // setIsDragging(true);
        // 重製
        // setFirstDrag(true);
        console.log("---------------------------------------------")
    };


    return (
        <div className={style.result}>
            <canvas
                className={style.canvas}
                ref={canvasRef}
                onMouseDown={handleCanvasMouseDown}

            />
            <DragLine />
        </div>
    );
};

export default Canvas;