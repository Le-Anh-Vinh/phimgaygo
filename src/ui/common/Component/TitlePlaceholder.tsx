import { FC } from "react";

const TitlePlaceholder: FC<{
    itemWidth?: number
}> = ({ itemWidth }) => {
    return <div
        className={'shadow-xl bg-gray-900 animate-pulse hover:scale-105 transition-all duration-500 transform-gpu rounded-sm relative cursor-pointer aspect-potrait sm:aspect-video'}
        style={{
            width: itemWidth,
        }}
    >

    </div>
}

export default TitlePlaceholder