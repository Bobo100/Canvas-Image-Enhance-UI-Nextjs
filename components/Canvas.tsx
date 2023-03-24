import { useEffect, useRef, useState } from 'react';
import { DragLine } from './DragLine';
import { Decimal } from "decimal.js"
import style from './css/Canvas.module.scss'
import Controlbar from './Controlbar';
interface CanvasProps {
    src: string;
}
const Canvas = ({ src }: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [scaleFactor, setScaleFactor] = useState(1);
    const maxScaleFactor = 2;
    const minScaleFactor = 0.1;
    const [isDragging, setIsDragging] = useState(false);

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
        const width = window.innerWidth;

        canvas.width = width;
        if (width > 768)
            canvas.height = 768
        else
            canvas.height = width / 1.7;

        // drawImageOnCanvas();
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


        // 拖移事件 透過button來判斷是否要拖移
        const handleCanvasMouseMove = (e: MouseEvent) => {
            // 如果滑鼠按下，且在圖片上，就開始拖移
            if (isDragging && e.buttons === 1) {
            }
        }
        canvas.addEventListener('mousemove', handleCanvasMouseMove);

        return () => {
            canvas.removeEventListener('wheel', handleWheel);
            canvas.removeEventListener('mousemove', handleCanvasMouseMove);
        }
    }, [image, scaleFactor, isDragging]);


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
        if (!image) return false;
        const canvas = canvasRef.current;
        if (!canvas) return false;
        const ctx = canvas.getContext("2d");
        if (!ctx) return false;

        const ratio = Math.min(
            canvas.width / (image.width / 2),
            canvas.height / (image.height / 2)
        );
        const width = (ratio * image.width) / 2;
        const height = (ratio * image.height) / 2;
        const x = canvas.width / 2 - width / 2;
        const y = canvas.height / 2 - height / 2;

        // 計算圖形路徑
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.closePath();

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

    const handleZoomChange = (newScaleFactor: number) => {
        setScaleFactor(newScaleFactor);
    };

    return (
        <>
            <div className={style.result}>
                <canvas
                    id="myCanvas"
                    className={style.canvas}
                    ref={canvasRef}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseUp={handleCanvasMouseUp}
                />
                <DragLine />
                <div className="absolute">before</div>
                <div className="absolute">after</div>
                <Controlbar width={100} height={100} zoomMin={minScaleFactor} zoomMax={maxScaleFactor} zoom={scaleFactor} onZoomChange={handleZoomChange} />
            </div>
        </>
    );
};

export default Canvas;