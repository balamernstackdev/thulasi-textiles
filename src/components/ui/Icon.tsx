import { FC, SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
    name: 'heart' | 'shopping-bag' | 'shopping-cart' | 'search' | 'user' | 'eye' | 'star' | 'chevron-left' | 'chevron-right' | 'menu' | 'chevron-down' | 'x' | 'credit-card' | 'shield-check' | 'truck' | 'rotate-ccw' | 'zoom-in' | 'zoom-out';
    size?: number | string;
}

const Icon: FC<IconProps> = ({ name, size = 24, className = '', ...props }) => {
    return (
        <svg
            width={size}
            height={size}
            className={`inline-block ${className}`}
            aria-hidden="true"
            {...props}
        >
            <use href={`/icons.svg#icon-${name}`} />
        </svg>
    );
};

export default Icon;
