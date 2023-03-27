
interface InputFileProps {
    labelId: string;
    placeholderText: string;
}

import { useRouter } from 'next/router';

const InputImage: React.FC<InputFileProps> = ({ labelId, placeholderText }) => {
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target && e.target.result) {
                // 存入圖片資料
                localStorage.setItem('imageData', e.target.result as string);

                // 跳轉頁面
                router.push('/ResultPage');
            }
        };
        if (e.target.files && e.target.files[0])
            reader.readAsDataURL(e.target.files[0]);
    };

    return (
        <input className='border' type="file" accept='image/*' id={labelId} placeholder={placeholderText} onChange={handleFileChange} />
    );
};

export default InputImage;
