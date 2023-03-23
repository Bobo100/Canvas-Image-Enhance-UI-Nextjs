import Image from "next/image"
import style from './css/Navbar.module.scss'
const NavBar = () => {
    // const [prevScrollPos, setPrevScrollPos] = useState(0);
    // const [visible, setVisible] = useState(true);

    // useEffect(() => {
    //     const handleScroll = () => {
    //         const currentScrollPos = window.scrollY;
    //         if (currentScrollPos === 0) return;
    //         const visible = prevScrollPos > currentScrollPos;

    //         setPrevScrollPos(currentScrollPos);
    //         setVisible(visible);
    //     };

    //     window.addEventListener('scroll', handleScroll);

    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //     };
    // }, [prevScrollPos, visible]);

    return (
        // <nav className={`navbar ${visible ? 'navbar--visible' : 'navbar--hidden'}`}>
        <nav className={`${style.navbar} height-100`}>
            <div className="flex align-center">
                <Image className={style.logo} src="/images/YCE_Black_Logo.svg" alt="logo" width={100} height={100} />
            </div>
            <div className={`flex align-center ${style.navbar_container}`}>
                <div className={style.faq_text}>FAQ</div>
                <div className={`${style.free_trail_btn} ${style.button_style}`}>
                    <Image className={`${style.icon}`} src="/images/icon_free.trial.svg" alt="logo" width={100} height={100} />
                    Free trail</div>
                <div className={`${style.button_style} ${style.login_btn}`}>Log in / Sign up</div>
                <div className={`${style.button_style} ${style.download_btn}`}>
                    <Image className={style.icon} src="/images/icon_download.svg" alt="logo" width={100} height={100} />
                    Download
                </div>
                <div className={`${style.button_style} ${style.share_btn}`}>
                    <Image className={style.icon} src="/images/icon_share.svg" alt="logo" width={100} height={100} />
                    Share
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