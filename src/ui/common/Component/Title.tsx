import React, { FC, useState } from "react";
import { media_type } from "../../../data/Datasource/Config";

const Title: FC<{
    id: number;
    title: string;
    subtitle: string;
    genre: string;
    date: string;
    vote_avg: string;
    imageFullURL: string;
    type: media_type;
    tag?: string;
    btn1Action: () => void;
    btn1Icon: JSX.Element;
    btn2Action: () => void;
    btn2Icon: JSX.Element;
    onClickAction: () => void;
    className?: string;
    style?: React.CSSProperties;
}> = (props) => {
    let [hover, setHover] = useState(false);
    return (
        <div
            className={
                "hover:scale-105 transition-all duration-500 transform-gpu"
            }
            style={props.style}
        >
            <div id="tracking-movie-id" data-item-id={props.id} style={{ display: 'none' }}>{props.id}</div>
            <div
                className={`shadow-xl rounded-sm relative cursor-pointer aspect-potrait sm:aspect-video ${props.className ?? ""
                    }`}
                style={{
                    backgroundImage: `${window.innerWidth > 640 ? 'linear-gradient(to top, #000000bb, transparent 30%), ' : ''}url(${props.imageFullURL})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    // aspectRatio: '2/3',
                }}
                onMouseEnter={() => {
                    setHover(true);
                }}
                onMouseLeave={() => {
                    setHover(false);
                }}
                onClick={(event) => {
                    event.stopPropagation();
                    props.onClickAction();
                }}
            >
                <div
                    style={{
                        opacity: hover ? "0" : "100",
                        visibility: hover ? "hidden" : "visible",
                    }}
                    className={
                        "text-black absolute z-30 top-0 right-0 m-2 p-1 font-bold text-sm bg-amber-300 rounded hidden sm:block"
                    }
                >
                    {props.tag}
                </div>
                <div
                    className={
                        "w-full h-full relative rounded-sm transition-all duration-500"
                    }
                    style={{
                        backgroundColor: "#00000077",
                        opacity: hover ? "100%" : "0%",
                        // display: "none"
                    }}
                >
                    <p
                        className={
                            "p-4 pt-3 pb-0 font-bold text-lg max-h-[4.25rem]  overflow-hidden text-white"
                        }
                    >
                        {props.title}
                    </p>
                    <p
                        className={
                            "px-4 text-sm max-h-10 overflow-hidden text-gray-300"
                        }
                    >
                        {props.subtitle} - {props.vote_avg}
                    </p>
                    <p
                        className={
                            "px-4 text-sm overflow-hidden max-h-10 text-gray-300"
                        }
                    >
                        Genres: {props.genre}
                    </p>

                    <div className={"absolute flex gap-2 bottom-0 p-4 "}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                props.btn1Action()
                            }}
                            className='w-fit h-fit p-2 rounded bg-main-1000 play-play'

                        >
                            {props.btn1Icon}
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                props.btn2Action()
                            }}
                            className='w-fit h-fit p-2 rounded secondary'
                        >
                            {props.btn2Icon}
                        </button>
                    </div>
                </div>
                <p
                    className={
                        "absolute box-content max-w-max h-8 m-3 font-bold text-xl overflow-hidden text-white bottom-0 left-0 right-0 transition-all hidden sm:block"
                    }
                    style={{
                        opacity: hover ? "0" : "100",
                        visibility: hover ? "hidden" : "visible",
                    }}
                >
                    {props.title}
                </p>
            </div>
        </div>
    );
};

export default Title;
