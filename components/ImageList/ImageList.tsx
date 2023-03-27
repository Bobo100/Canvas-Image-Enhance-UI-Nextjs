// show 小image list 讓使用者可以去drag into canvas
import DragImage from "./DragImage.tsx/DragImage";

const ImageList = () => {
    return (
        <div className="flex align-center">
            <DragImage src="/images/imagelist/01.jpg" />
            <DragImage src="/images/imagelist/02.jpg" />
            <DragImage src="/images/imagelist/03.jpg" />
        </div>
    )
}

export default ImageList