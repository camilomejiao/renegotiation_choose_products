export const HeaderImage = ({
    imageHeader,
    titleHeader,
    bannerIcon,
    backgroundIconColor,
    bannerInformation,
    backgroundInformationColor,
}) => {
    return (
        <>
            <div className="media-hero">
                <img src={imageHeader} className="media-hero__image" alt="Fondo" />
                <div className="media-hero__overlay">
                    <h1 className="media-hero__title">{titleHeader}</h1>
                </div>
            </div>

            {bannerIcon && bannerInformation && (
                <div className="info-banner">
                    <div
                        className="info-banner__inner"
                        style={{ backgroundColor: backgroundInformationColor }}
                    >
                        <span
                            className="info-banner__icon"
                            style={{ backgroundColor: backgroundIconColor }}
                        >
                            <img src={bannerIcon} alt="Icono" />
                        </span>
                        <span>{bannerInformation}</span>
                    </div>
                </div>
            )}
        </>
    );
};
