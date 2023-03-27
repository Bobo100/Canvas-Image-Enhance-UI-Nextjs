
import Image from "next/image"
import { useState, useRef } from "react";

const DragImage = ({ src }: { src: string }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLCanvasElement>(null);

    function handleDragStart(event: React.DragEvent<HTMLImageElement>) {
        const startX = event.clientX - event.currentTarget.offsetLeft;
        const startY = event.clientY - event.currentTarget.offsetTop;
        setIsDragging(true);
        setStartCoords({ x: startX, y: startY });
        setImage(event.currentTarget);
    }

    function handleDragEnd(event: React.DragEvent<HTMLImageElement>) {
        setIsDragging(false);
        setImage(null);
    }

    return (
        <Image src={src} width={50} height={50} alt=""
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        />
    )
}

export default DragImage