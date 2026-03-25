import styled from "@emotion/styled";

export const FooterShell = styled.footer({
    padding: "var(--space-5) var(--space-6) calc(var(--space-7) + var(--space-5))",
    textAlign: "center",
});

export const FooterImage = styled.img(({theme}) => ({
    display: "block",
    width: "min(100%, 1100px)",
    height: "auto",
    marginInline: "auto",
    borderRadius: "var(--radius-md)",
    boxShadow: theme.colors.shadowSm,
    maxHeight: 260,
    objectFit: "contain",
}));
