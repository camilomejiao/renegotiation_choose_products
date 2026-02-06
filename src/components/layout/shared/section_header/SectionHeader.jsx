import React from "react";

export const SectionHeader = ({
    icon: Icon,
    title,
    subtitle = "",
    color = "#2148c0",
    iconColor,
}) => {
    const resolvedIconColor = iconColor || color;
    return (
        <div className="section-header">
            <div className="section-header__title">
                {Icon && (
                    <Icon className="section-header__icon" style={{ color: resolvedIconColor }} />
                )}
                <h4 className="section-header__text" style={{ color }}>{title}</h4>
            </div>
            {subtitle ? <p className="section-header__subtitle">{subtitle}</p> : null}
        </div>
    );
};
