import { FC, useState } from "react";
import { Video } from "../../../data/model/Movie/Video";
import LabelAndExpand from "./LabelAndExpand";
import SeeMoreBtn from "../../common/Component/SeeMoreBtn";
import ReactPlayer from "react-player";
import { IconButton, Skeleton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const TrailerSection: FC<{
    videos: Video[];
    movieId: number;
}> = ({ videos, movieId }) => {
    const [expand, setExpand] = useState(false);
    const VideoData = videos
        .filter((value) => value.site === "YouTube")
        .slice(0, !expand ? 3 : videos.length - 1);

    const [showBigPlayer, setShowBigPlayer] = useState(NaN);
    return (
        <section className={"px-4 relative"}>
            {Boolean(showBigPlayer) && (
                <div
                    className='w-screen h-screen backdrop-brightness-50 fixed top-0 left-0 z-50 flex items-center justify-center'
                    onClick={() => {
                        setShowBigPlayer(NaN);
                    }}
                >
                    <IconButton
                        sx={{
                            position: "absolute",
                            padding: "1rem",
                            top: "1rem",
                            right: "1rem",
                        }}
                        onClick={() => setShowBigPlayer(NaN)}
                    >
                        <CloseIcon
                            fontSize='large'
                            htmlColor='white'
                        />
                    </IconButton>
                    <ReactPlayer
                        style={{
                            aspectRatio: "16/9",
                        }}
                        url={
                            "https://www.youtube.com/embed/" +
                            VideoData[showBigPlayer].key
                        }
                        width={"80%"}
                        height={"auto"}
                        fallback={<Skeleton variant='rectangular' />}
                        config={{
                            youtube: {
                                playerVars: {
                                    rel: 0,
                                    controls: 1,
                                },
                            },
                        }}
                        onEnded={() =>
                            setTimeout(() => setShowBigPlayer(NaN), 5000)
                        }
                    />
                </div>
            )}
            <LabelAndExpand
                label='Video:'
                expand={!expand}
                onClick={() => setExpand((old) => !old)}
            />
            {(videos.length ?? 0) > 3 && (
                <>
                    <SeeMoreBtn
                        text={!expand ? "Expand" : "Minimize"}
                        onClick={() => setExpand((old) => !old)}
                    />
                    {!expand && (
                        <div className='absolute bottom-0 z-20 h-48 w-full bg-gradient-to-t from-black pointer-events-none' />
                    )}
                </>
            )}
            {videos.length === 1 ? (
                <div>
                    <div
                        onClick={(e) => {
                            setShowBigPlayer(0);
                        }}
                        className="flex justify-center"
                    >
                        <ReactPlayer
                            className={
                                "aspect-video transition-all duration-500 transition-gpu hover:scale-105 focus:border-0 focus:outline-0 max-w-6xl"
                            }
                            url={
                                "https://www.youtube.com/embed/" + videos[0].key
                            }
                            light
                            pip
                            width={"100%"}
                            height={"auto"}
                            fallback={<Skeleton variant='rectangular' />}
                            config={{
                                youtube: {
                                    playerVars: {
                                        rel: 0,
                                        controls: 1,
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div
                    className={"sm:grid flex flex-col gap-2 overflow-hidden"}
                    style={{
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(380px, 1fr))",
                    }}
                >
                    {VideoData.map((value, index) => (
                        <div
                            id="trailer-player"
                            onClick={(e) => {
                                setShowBigPlayer(index);
                            }}
                        >
                            <ReactPlayer
                                className={
                                    "aspect-video transition-all duration-500 transition-gpu hover:scale-105 focus:border-0 focus:outline-0"
                                }
                                url={
                                    "https://www.youtube.com/embed/" + value.key
                                }
                                light
                                pip
                                width={"auto"}
                                height={"auto"}
                                fallback={<Skeleton variant='rectangular' />}
                                config={{
                                    youtube: {
                                        playerVars: {
                                            rel: 0,
                                            controls: 1,
                                        },
                                    },
                                }}
                            />
                            <div className="tracking-movie-id" id="tracking-movie-id" data-item-id={movieId} style={{ display: 'none' }}>{movieId}</div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default TrailerSection;
