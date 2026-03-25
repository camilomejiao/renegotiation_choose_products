import { Col, Grid, Row, Typography } from "antd";
import styled from "@emotion/styled";

export const HeaderImage = ({
  imageHeader,
  titleHeader,
  bannerIcon,
  backgroundIconColor,
  bannerInformation,
  backgroundInformationColor,
}) => {
  const screens = Grid.useBreakpoint();

  return (
    <HeaderWrapper>
      <HeroSection $isMobile={!screens.md}>
        <HeroBackground src={imageHeader} alt="Fondo" />
        <HeroOverlay>
          <HeroTitle>{titleHeader}</HeroTitle>
        </HeroOverlay>
      </HeroSection>

      {bannerIcon && bannerInformation && (
        <BannerContainer>
          <Row justify="center">
            <Col xs={24} sm={22} md={20} lg={18} xl={16}>
              <BannerWrapper>
                <IconBadge
                  $isMobile={!screens.md}
                  $backgroundColor={backgroundIconColor}
                >
                  <IconImage src={bannerIcon} alt="Icono" />
                </IconBadge>

                <InfoBanner $backgroundColor={backgroundInformationColor}>
                  <BannerText>{bannerInformation}</BannerText>
                </InfoBanner>
              </BannerWrapper>
            </Col>
          </Row>
        </BannerContainer>
      )}
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  padding-inline: 12px;

  @media (min-width: 992px) {
    padding-inline: 20px;
  }
`;

const HeroSection = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  height: ${({ $isMobile }) =>
    $isMobile ? "clamp(130px, 34vw, 180px)" : "clamp(170px, 18vw, 240px)"};
  overflow: hidden;
`;

const HeroBackground = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transform: translateZ(0);
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 0.25) 0%,
    rgba(15, 23, 42, 0.45) 100%
  );
  padding: 0 16px;
  text-align: center;
`;

const HeroTitle = styled.h1`
  margin: 0;
  color: #ffffff;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
  font-weight: 700;
  font-size: clamp(1.15rem, 2.4vw, 2rem);
  line-height: 1.2;
  max-width: min(92vw, 900px);
  white-space: normal;
  overflow-wrap: anywhere;
`;

const BannerContainer = styled.div`
  margin-top: -24px;
  position: relative;
  z-index: 2;
  padding: 0 12px;

  @media (max-width: 1440px) {
    margin-top: -18px;
  }

  @media (max-width: 768px) {
    margin-top: -14px;
    padding: 0 8px;
  }
`;

const BannerWrapper = styled.div`
  position: relative;
`;

const IconBadge = styled.div`
  position: absolute;
  top: ${({ $isMobile }) => ($isMobile ? "-18px" : "-24px")};
  left: 16px;
  width: ${({ $isMobile }) => ($isMobile ? "42px" : "52px")};
  height: ${({ $isMobile }) => ($isMobile ? "42px" : "52px")};
  border-radius: 50%;
  background: ${({ $backgroundColor }) => $backgroundColor || "#1e3a8a"};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    left: 12px;
  }
`;

const IconImage = styled.img`
  width: 60%;
  height: 60%;
  object-fit: contain;
`;

const InfoBanner = styled.div`
  min-height: 54px;
  border-radius: 12px;
  background: ${({ $backgroundColor }) => $backgroundColor || "#1e3a8a"};
  color: #ffffff;
  display: flex;
  align-items: center;
  padding: 10px 16px 10px 72px;

  @media (max-width: 768px) {
    min-height: 48px;
    padding: 8px 12px 8px 60px;
    border-radius: 10px;
  }
`;

const BannerText = styled(Typography.Text)`
  && {
    color: #ffffff;
    font-size: clamp(12px, 1.2vw, 14px);
    line-height: 1.4;
    white-space: normal;
    overflow-wrap: anywhere;
  }
`;
