import Image from "next/image"
import style from './css/Navbar.module.scss'
const NavBar = () => {

    // canvas.tsx

    function downloadCanvas() {
        const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'canvas.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        // <nav className={`navbar ${visible ? 'navbar--visible' : 'navbar--hidden'}`}>
        <nav className={`${style.navbar} height-100`}>
            <div className="flex align-center">
                <Image className={style.logo} src="/images/YCE_Black_Logo.svg" alt="logo" width={100} height={100} priority/>
            </div>
            <div className={`flex align-center ${style.navbar_container}`}>
                <div className={style.faq_text}>FAQ</div>

                <div className={`${style.free_trail_btn} ${style.button_style}`}>
                    <Image className={`${style.icon}`} src="/images/icon_free.trial.svg" alt="logo" width={100} height={100} />
                    <div className={`${style.font_display_none}`}>Free trail</div>
                </div>

                <div className={`${style.button_style} ${style.login_btn}`}>Log in / Sign up</div>

                <div className={`${style.button_style} ${style.download_btn} ${style.icon_font_none_size}`}>
                    <Image className={style.icon} src="/images/icon_download.svg" alt="logo" width={100} height={100} />
                    <div className={`${style.font_display_none}`} onClick={downloadCanvas}>Download</div>
                </div>

                <div className={`${style.button_style} ${style.share_btn} ${style.icon_font_none_size}`}>
                    <Image className={style.icon} src="/images/icon_share.svg" alt="logo" width={100} height={100} />
                    <div className={`${style.font_display_none}`}>Share</div>
                </div>

                <div className={`${style.langugae_btn}`}>
                    <Image className={style.language_icon} src="/images/icon_language.svg" alt="logo" width={100} height={100} />
                    <Image className={style.language_icon} src="/images/icon_down.svg" alt="logo" width={100} height={100} />
                </div>
            </div>
        </nav>
    )
}

export default NavBar