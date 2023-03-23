// 可以拖移的線，請一定要搭配 css/DragLine.scss 使用
import { useEffect, useRef, useState } from "react";
import style from "./css/DragLine.module.scss";
export const DragLine = () => {
    const lineRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [transform, setTransform] = useState("translate3d(100vw, 0, 0)");

    useEffect(() => {
        setTransform("translate3d(858px, 0px, 0px)");
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const lineWidth = lineRef.current?.offsetWidth || 0;
                const deltaX = e.clientX - lineWidth / 2;

                // 如果超過左邊界，就不動
                if (deltaX < 0) {
                    return;
                }
                // 如果超過右邊界，就不動
                if (deltaX > window.innerWidth - 1) {
                    return;
                }

                // const newTransform = `translate3d(${deltaX}px, 0, 0)`;
                // setTransform(newTransform);

                requestAnimationFrame(() => {
                    const newTransform = `translate3d(${deltaX}px, 0, 0)`;
                    setTransform(newTransform);
                });

            }
        };

        const handleMouseUp = () => {
            // console.log("mouse up")
            setIsDragging(false);
        };

        // 如果滑鼠移出視窗，就停止拖移
        const handleMouseLeave = () => {
            // console.log("mouse leave")
            setIsDragging(false);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mouseleave", handleMouseLeave);

        };
    }, [isDragging]);

    // 當滑鼠在 線 上按下時，就開始拖移
    const handleLineMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        // console.log("line mouse down")
        setIsDragging(true);
        if (lineRef.current) {
            lineRef.current.style.transition = 'none'; // 移除 transition 效果
        }
    };
   

    return (
        <div
            className={style.line}
            ref={lineRef}
            style={{ transform }}
            onMouseDown={handleLineMouseDown}
        ></div>
    );
};
