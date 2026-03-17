import { FC, useEffect, useRef, useState } from "react";
import getDetail from "../../data/DAO/Detail/getDetail";
import { Link, Navigate, useOutletContext, useParams } from "react-router-dom";
import getTrailer from "../../data/DAO/Detail/getTrailer";
import config, { media_type } from "../../data/Datasource/Config";
import ToHrsAndMin from "../../utils/ToHrsAndMin";
import ContextProps from "../SharedLayout/ContextProps";
import SVG_Play from "../common/SVG/SVG_Play";
import AddSpaceToNumber from "../../utils/AddSpaceToNumber";
import LoadingSpinner from "../common/Component/LoadingSpinner";
import SVG_Favorite from "../common/SVG/SVG_Favorite";
import TitlesRow from "../common/Layout/TitlesRow";
import CalculateWidth from "../../utils/CalculateWidth";
import getGenres from "../../data/DAO/Detail/getGenres";
import MapGenreToID from "../../utils/MapGenreToID";
import IconAndLabelWrap from "../common/Component/IconAndLabelWrap";
import TrailerSection from "./common/TrailerSection";
import CalcWindowSize from "../../utils/windowSize";
import Screens from "../../utils/Screen";
import { addToHistory } from "../../data/DAO/FireStore/AdditionalUserInfoDAO";

const currentMediaType: media_type = 'movie'

const MovieDetail: FC<{}> = () => {
    const { id } = useParams();
    const { navController, user, handleFavorite } = useOutletContext<ContextProps>();
    const data = getDetail(Number(id));
    const videos = getTrailer(Number(id), data.isSuccess);
    const WatchSectionRef = useRef<HTMLDivElement>(null);
    const itemWidth = CalculateWidth();
    const Recommendations = data.data?.recommendations.results ?? [];
    const Similar = data.data?.similar.results ?? [];
    const movieGenres = getGenres();

    //Add to history
    useEffect(() => {
        user && addToHistory(user.uid, { id: Number(id), media_type: currentMediaType })
    }, [user, id])

    if (data.error) {
        return <Navigate to={"*"} />;
    }
    return data.data ? (
        <div className={"relative"}>
            <section
                style={{
                    paddingTop: "64px",
                    minHeight: "90vh",
                    width: "100vw",
                    backgroundImage: `${window.innerWidth > 750
                        ? "linear-gradient(to top, #000, transparent 10%), linear-gradient(to right, #000, #222222 20%, #42424200), "
                        : ""
                        } url(${config.backDropUrl + data.data.backdrop_path})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right top",
                }}
            >
                <div className={"p-3 sm:p-20 max-w-3xl"}>
                    <img
                        className={"w-1/3 rounded-2xl m-4 shadow-2xl"}
                        src={config.posterUrl + data.data.poster_path}
                        alt={data.data.original_title}
                    />
                    <p className={"font-extrabold text-3xl m-4"}>
                        {data.data.title}
                    </p>
                    <p className={"m-4"}>{data.data.tagline}</p>
                    <div
                        className={
                            "m-4 flex flex-row text-gray-400 tracking-wider"
                        }
                    >
                        <p>{data.data.release_date.slice(0, 4)}</p>
                        <p className={"mx-2"}>•</p>
                        <p>
                            {data.data.release_dates.results.length > 0
                                ? data.data.release_dates.results.find(
                                    (value) => {
                                        return value.iso_3166_1 === "US";
                                    }
                                )?.release_dates[0].certification ??
                                data.data.release_dates.results[0]
                                    .release_dates[0].certification
                                : ""}
                        </p>
                        <p className={"mx-2"}>•</p>
                        <p>{ToHrsAndMin(Number(data.data.runtime))}</p>
                        <p className={"mx-2"}>•</p>
                        <p>Rating: {data.data.vote_average.toFixed(1)}</p>
                    </div>
                    <p className={"text-justify m-4"}>{data.data.overview}</p>
                    <div className={"flex flex-row mx-2"}>
                        <button
                            className='p-2 m-1 rounded bg-main-1000 flex button-movie'
                            onClick={() => {
                                WatchSectionRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                });
                            }}
                        >
                            <SVG_Play fill="black" />{" "}
                            <span className={"text-black px-2 "}></span>
                        </button>
                        <button
                            className='p-2 m-1 rounded secondary flex button-fav-movie'
                            onClick={() => handleFavorite(Number(id), currentMediaType)}
                        >
                            <SVG_Favorite fill="black" />{" "}
                            <span className={"text-black px-2"}>Notice</span>
                        </button>
                    </div>
                </div>
            </section>
            <div
                className={
                    "z-40 w-screen flex justify-center items-center px-8"
                }
            >
                <div className={"max-w-8xl w-full overflow-x-clip"}>
                    <section
                        ref={WatchSectionRef}
                        className={""}
                    >
                        {/* <h2
                            className={
                                "font-bold subpixel-antialiased text-3xl py-4"
                            }
                        >
                            Watch:
                        </h2>
                        <div className={"w-full flex justify-center"}>
                            <iframe
                                src={
                                    import.meta.env.PROD
                                        ? `https://www.2embed.to/embed/tmdb/movie?id=${id}`
                                        : ""
                                }
                                allowFullScreen
                                className={"max-w-6xl aspect-video w-full"}
                            />
                            // <p className="font-medium subpixel-antialiased text-2xl py-4">You know this is illegal</p>
                        </div> */}
                    </section>
                    {videos.data && videos.data?.results.length !== 0 && (
                        <TrailerSection videos={videos.data.results} movieId={Number(id)} />
                    )}
                    <section className={"p-4"}>
                        <h2
                            className={
                                "font-bold subpixel-antialiased text-3xl py-4"
                            }
                        >
                            More Details:
                        </h2>
                        <section
                            className={"grid gap-4"}
                            style={{
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(320px, 1fr))",
                            }}
                        >
                            <div>
                                <p className={"text-gray-400 pb-1"}>Genres:</p>
                                <p>
                                    {data.data.genres.map((value, index) => {
                                        return (
                                            <>
                                                <Link
                                                    className={
                                                        "cursor-pointer hover:text-main-1000"
                                                    }
                                                    to={`${Screens.MovieDiscover}?genres=${value.id}`}
                                                >
                                                    {value.name}
                                                </Link>
                                                <span>
                                                    {index !==
                                                        data.data.genres.length - 1
                                                        ? ", "
                                                        : ""}
                                                </span>
                                            </>
                                        );
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className={"text-gray-400 pb-1"}>
                                    Spoken Language:
                                </p>
                                <p>
                                    {data.data.spoken_languages
                                        .map((value) => {
                                            return value.english_name;
                                        })
                                        .join(", ")}
                                </p>
                            </div>
                            <div>
                                <p className={"text-gray-400 pb-1"}>Country:</p>
                                <p>
                                    {data.data.production_countries
                                        .map((value) => {
                                            return value.name;
                                        })
                                        .join(", ")}
                                </p>
                            </div>
                            <div>
                                <p className={"text-gray-400 pb-1"}>Revenue:</p>
                                <p>{AddSpaceToNumber(data.data.revenue)}$</p>
                            </div>
                            <div className={"max-w-2xl"}>
                                <p className={"text-gray-400 pb-1"}>Company:</p>
                                <div>
                                    {data.data.production_companies
                                        .map((value) => {
                                            return value.name;
                                        })
                                        .join(", ")}
                                </div>
                            </div>
                            <div className={"max-w-2xl"}>
                                <p className={"text-gray-400 pb-1"}>
                                    Keywords:
                                </p>
                                <p>
                                    {data.data.keywords.keywords
                                        .map((value) => {
                                            return (
                                                value.name[0].toUpperCase() +
                                                value.name.slice(1)
                                            );
                                        })
                                        .join(", ")}
                                </p>
                            </div>
                            <div className={"col-span-full"}>
                                <p className={"text-gray-400 pb-1"}>Cast:</p>
                                <div
                                    className={"grid gap-x-2"}
                                    style={{
                                        gridTemplateColumns:
                                            "repeat(auto-fit, minmax(320px, 1fr))",
                                    }}
                                >
                                    {data.data.credits.cast
                                        .slice(0, 8)
                                        .map((val) => {
                                            return <p>{val.name}</p>;
                                        })}
                                </div>
                            </div>
                        </section>
                    </section>
                    {Recommendations.length > 0 && (
                        <TitlesRow
                            name={"Recommendation"}
                            ids={Recommendations.map((value) => value.id)}
                            titles={Recommendations.map((value) => value.title)}
                            genres={Recommendations.map((value) =>
                                MapGenreToID(
                                    movieGenres.data?.genres ?? [],
                                    value.genre_ids
                                )
                            )}
                            itemWidth={itemWidth}
                            imagesFullURL={Recommendations.map(
                                (value) => (CalcWindowSize() !== 'Small' ? config.backDropUrlSmall + value.backdrop_path : config.posterUrl + value.poster_path)
                            )}
                            className={""}
                            btn1Icon={
                                <IconAndLabelWrap
                                    icon={<SVG_Play fill="black" />}
                                    label={"Watch"}
                                />
                            }
                            btn1Action={function (
                                id: number,
                                type?: media_type | undefined
                            ): void {
                                navController(`${type}/detail/${id}`);
                            }} // Watch
                            btn2Icon={<SVG_Favorite fill="black" />}
                            btn2Action={handleFavorite} // Share
                            onClickAction={(id, type) => {
                                navController(`${type}/detail/${id}`);
                            }} // Add to favorite
                            tags={Recommendations.map((value) =>
                                value.vote_average.toPrecision(2)
                            )}
                            dates={Recommendations.map(
                                (value) => value.release_date
                            )}
                            vote_avgs={Recommendations.map((value) =>
                                value.vote_average.toPrecision(2)
                            )}
                            media_type={[currentMediaType]}
                            subtitles={Recommendations.map(
                                (value) => value.original_title
                            )}
                        />
                    )}
                    {Similar.length > 0 && (
                        <TitlesRow
                            name={"Similar"}
                            ids={Similar.map((value) => value.id)}
                            titles={Similar.map((value) => value.title)}
                            genres={Similar.map((value) =>
                                MapGenreToID(
                                    movieGenres.data?.genres ?? [],
                                    value.genre_ids
                                )
                            )}
                            itemWidth={itemWidth}
                            imagesFullURL={Similar.map(
                                (value) => (CalcWindowSize() !== 'Small' ? config.backDropUrlSmall + value.backdrop_path : config.posterUrl + value.poster_path)
                            )}
                            className={""}
                            btn1Icon={
                                <IconAndLabelWrap
                                    icon={<SVG_Play fill="black" />}
                                    label={"Watch"}
                                />
                            }
                            btn1Action={function (
                                id: number,
                                type?: media_type | undefined
                            ): void {
                                navController(`${type}/detail/${id}`);
                            }} // Watch
                            btn2Icon={<SVG_Favorite fill="black" />}
                            btn2Action={function (
                                id: number,
                                type?: media_type | undefined
                            ): void {
                                throw new Error("Function not implemented.");
                            }} // Share
                            onClickAction={(id, type) => {
                                navController(`${type}/detail/${id}`);
                            }} // Add to favorite
                            tags={Similar.map((value) =>
                                value.vote_average.toPrecision(2)
                            )}
                            dates={Similar.map((value) => value.release_date)}
                            vote_avgs={Similar.map((value) =>
                                value.vote_average.toPrecision(2)
                            )}
                            media_type={[currentMediaType]}
                            subtitles={Similar.map(
                                (value) => value.original_title
                            )}
                        />
                    )}
                </div>
            </div>
        </div>
    ) : data.error ? (
        <>Error</>
    ) : (
        <LoadingSpinner />
    );
};

export default MovieDetail;
