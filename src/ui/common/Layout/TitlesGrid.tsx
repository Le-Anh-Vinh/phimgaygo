import React, { FC } from "react";
import Title from "../Component/Title";
import { media_type } from "../../../data/Datasource/Config";
import DuplicateStuff from "../../../utils/DuplicateStuff";
import TitlePlaceholder from "../Component/TitlePlaceholder";

const TitlesGrid: FC<
    | {
          titles: string[];
          media_type: media_type[]; //Length = 1 => same type
          ids: number[];
          name: string;
          subtitles: string[];
          genres: string[];
          dates: string[];
          vote_avgs: string[];
          imagesFullURL: string[];
          tags?: string[];
          className?: string;
          style?: React.CSSProperties;
          btn1Action: (id: number, type: media_type) => void;
          btn1Icon: JSX.Element;
          btn2Action: (id: number, type: media_type) => void;
          btn2Icon: JSX.Element;
          onClickAction: (id: number, type: media_type) => void;
          onSeeMore?: () => void;
          itemWidth?: number;
      }
    | {
          placeholder: true;
          name: string;
          itemWidth?: number;
          className?: string;
          style?: React.CSSProperties;
          onSeeMore?: () => void;
      }
> = (props) => {
    if ("placeholder" in props) {
        return (
            <div
                style={props.style}
                className={props.className}
            >
                <p className='font-bold text-3xl p-4 tracking-wider group'>
                    {props.name}
                    {props.onSeeMore && (
                        <span
                            className={
                                "text-sm font-normal px-4 h-full tracking-normal text-right hidden sm:inline-block opacity-0 transition-all group-hover:opacity-100 cursor-pointer"
                            }
                            onClick={props.onSeeMore}
                        >
                            See More...
                        </span>
                    )}
                </p>
                <div
                    className={"grid gap-2"}
                    style={{
                        gridTemplateColumns: `repeat(auto-fit, ${
                            props.itemWidth
                                ? `${props.itemWidth}px`
                                : `minmax(${
                                      window.innerWidth > 640
                                          ? "320px"
                                          : "170px"
                                  }, 1fr)`
                        }`,
                    }}
                >
                    {DuplicateStuff(
                        <TitlePlaceholder itemWidth={props.itemWidth} />,
                        5
                    )}
                    {props.onSeeMore && (
                        <div
                            className={
                                "flex items-center justify-center hover:scale-105 transition-all duration-500 transform-gpu rounded-sm bg-transparent hover:bg-gray-600 group"
                            }
                        >
                            <p
                                className={
                                    "group-hover:tracking-widest text-xl font-bold transition-all duration-500"
                                }
                            >
                                See More
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    } else
        return (
            <div
                style={props.style}
                className={props.className}
            >
                <p className='font-bold text-3xl p-4 tracking-wider group'>
                    {props.name}
                    {props.onSeeMore && (
                        <span
                            className={
                                "text-sm font-normal px-4 h-full tracking-normal text-right hidden sm:inline-block opacity-0 transition-all group-hover:opacity-100 cursor-pointer"
                            }
                            onClick={props.onSeeMore}
                        >
                            See More...
                        </span>
                    )}
                </p>
                <div
                    className={"grid gap-2"}
                    style={{
                        gridTemplateColumns: `repeat(auto-fit, ${
                            props.itemWidth
                                ? `${props.itemWidth}px`
                                : `minmax(${
                                      window.innerWidth > 640
                                          ? "320px"
                                          : "170px"
                                  }, 1fr)`
                        }`,
                    }}
                >
                    {props.ids.map((val, index) => {
                        let currentType =
                            props.media_type.at(index) ?? props.media_type[0];
                        return (
                            <Title
                                key={props.name + currentType + val}
                                id={val}
                                title={props.titles[index]}
                                tag={props.tags?.at(index)}
                                imageFullURL={props.imagesFullURL[index]}
                                type={currentType}
                                subtitle={props.subtitles[index]}
                                genre={props.genres[index]}
                                date={props.dates[index]}
                                vote_avg={props.vote_avgs[index]}
                                btn1Icon={props.btn1Icon}
                                btn1Action={() =>
                                    props.btn1Action(val, currentType)
                                }
                                btn2Icon={props.btn2Icon}
                                btn2Action={() =>
                                    props.btn2Action(val, currentType)
                                }
                                onClickAction={() =>
                                    props.onClickAction(val, currentType)
                                }
                            />
                        );
                    })}
                    {props.onSeeMore && (
                        <div
                            className={
                                "flex items-center justify-center hover:scale-105 transition-all duration-500 transform-gpu rounded-sm bg-transparent hover:bg-gray-600 group"
                            }
                        >
                            <p
                                className={
                                    "group-hover:tracking-widest text-xl font-bold transition-all duration-500"
                                }
                            >
                                See More
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
};

export default TitlesGrid;
