import { FC, useEffect, useRef, useState } from "react";
import { Link, Navigate, useOutletContext, useParams } from "react-router-dom";
import ContextProps from "../SharedLayout/ContextProps";
import CalculateWidth from "../../utils/CalculateWidth";
import getGenres from "../../data/DAO/Detail/getGenres";
import config, { media_type } from "../../data/Datasource/Config";
import ToHrsAndMin from "../../utils/ToHrsAndMin";
import SVG_Play from "../common/SVG/SVG_Play";
import SVG_Favorite from "../common/SVG/SVG_Favorite";
import TitlesRow from "../common/Layout/TitlesRow";
import MapGenreToID from "../../utils/MapGenreToID";
import IconAndLabelWrap from "../common/Component/IconAndLabelWrap";
import LoadingSpinner from "../common/Component/LoadingSpinner";
import getTVDetail from "../../data/DAO/Detail/getTVDetail";
import getTVTrailer from "../../data/DAO/Detail/getTVTrailer";
import getTVSeason from "../../data/DAO/Detail/getTVSeason";
import { Season } from "../../data/model/TVShow/TVShow";
import { Episode } from "../../data/model/TVShow/TVShowSeason";
import SeeMoreBtn from "../common/Component/SeeMoreBtn";
import TraierSection from "./common/TrailerSection";
import LabelAndExpand from "./common/LabelAndExpand";
import { Button, ButtonGroup } from "@mui/material";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import CalcWindowSize from "../../utils/windowSize";
import Screens from "../../utils/Screen";
import { addToHistory } from "../../data/DAO/FireStore/AdditionalUserInfoDAO";

const currentMediaType: media_type = 'tv'

const TVShowDetail: FC = () => {
    const { id } = useParams();
    const { navController, user, handleFavorite } =
        useOutletContext<ContextProps>();

    const itemWidth = CalculateWidth();
    const data = getTVDetail(Number(id));
    const videos = getTVTrailer(Number(id), data.isSuccess);

    const [season, setSeason] = useState(1);
    const [episode, setEpisode] = useState(1);
    const [expand, setExpand] = useState<number | false>(false);
    const [seasonShowAll, setSeasonShowAll] = useState(false);

    const WatchSectionRef = useRef<HTMLDivElement>(null);
    const Recommendations = data.data?.recommendations.results ?? [];
    const Similar = data.data?.similar.results ?? [];
    const tvGenres = getGenres(currentMediaType);
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
                className={"pt-16 sm:min-h-[90vh] w-screen"}
                style={{
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
                        alt={data.data.original_name}
                    />
                    <p className={"font-extrabold text-3xl m-4"}>
                        {data.data.name}
                    </p>
                    <p className={"m-4"}>{data.data.tagline}</p>
                    <div
                        className={
                            "m-4 flex flex-row text-gray-400 tracking-wider"
                        }
                    >
                        <p>{data.data.first_air_date.slice(0, 4)}</p>
                        <p className={"mx-2"}>•</p>
                        <p>
                            {(data.data?.content_ratings.results ?? []).find(
                                (value) => {
                                    return value.iso_3166_1 === "US";
                                }
                            )?.rating ??
                                data.data?.content_ratings.results[0]?.rating}
                        </p>
                        <p className={"mx-2"}>•</p>
                        <p>{ToHrsAndMin(Number(data.data.episode_run_time))}</p>
                        <p className={"mx-2"}>•</p>
                        <p>Rating: {data.data.vote_average.toFixed(1)}</p>
                    </div>
                    <p className={"m-4 text-gray-400 tracking-wider"}>
                        {data.data.number_of_seasons} Seasons •{" "}
                        {data.data.number_of_episodes} Episodes
                    </p>
                    <p className={"text-justify m-4"}>{data.data.overview}</p>
                    <div className={"flex flex-row mx-2"}>
                        <button
                            className='p-2 m-1 rounded bg-main-1000 flex'
                            onClick={() => {
                                WatchSectionRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                });
                            }}
                        >
                            <SVG_Play fill='black' />{" "}
                            <span className={"text-black px-2 play-button-tv"}>Watch</span>
                        </button>
                        <button
                            className='p-2 m-1 rounded secondary flex'
                            onClick={() => handleFavorite(Number(id), currentMediaType)}
                        >
                            <SVG_Favorite fill='black' />{" "}
                            <span className={"text-black px-2"}>Favorite</span>
                        </button>
                    </div>
                </div>
            </section>
            <div className={"z-40 w-screen flex justify-center items-center"}>
                <div className={"max-w-8xl w-full overflow-x-clip"}>
                    <section className={"px-4 relative"}>
                        <LabelAndExpand
                            label={"Seasons & Episodes:"}
                            onClick={() =>
                                setSeasonShowAll(
                                    (old) =>
                                        data.data.number_of_seasons > 2 && !old
                                )
                            }
                            expand={!seasonShowAll}
                        />
                        {data.data.number_of_seasons > 2 && (
                            <>
                                <SeeMoreBtn
                                    text={seasonShowAll ? "Minimize" : "Expand"}
                                    onClick={() =>
                                        setSeasonShowAll((old) => !old)
                                    }
                                />
                                {!seasonShowAll && (
                                    <div className='absolute bottom-0 z-20 h-48 w-full bg-gradient-to-t from-black pointer-events-none' />
                                )}
                            </>
                        )}
                        <div className={"overflow-y-auto w-full"}>
                            {(data.data?.seasons ?? [])
                                .slice(0, seasonShowAll ? undefined : 3)
                                .map((value) => (
                                    <SeasonSectionLazy
                                        season={value.season_number}
                                        id={Number(id)}
                                        value={value}
                                        expand={expand === value.season_number}
                                        onClick={() => {
                                            setExpand((old) =>
                                                old === value.season_number
                                                    ? false
                                                    : value.season_number
                                            );
                                            setSeasonShowAll(true);
                                        }}
                                        onEpClicked={(ep) => {
                                            setSeason(value.season_number);
                                            setEpisode(ep);
                                            WatchSectionRef.current?.scrollIntoView(
                                                {
                                                    behavior: "smooth",
                                                    inline: "center",
                                                }
                                            );
                                        }}
                                    />
                                ))}
                        </div>
                    </section>
                    <section
                        ref={WatchSectionRef}
                        className={"p-4"}
                    >
                        {videos.data?.results &&
                            videos.data?.results.length !== 0 && (
                                <TraierSection videos={videos.data?.results} />
                            )}
                    </section>

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
                                                    to={`${Screens.TVDiscover}?genres=${value.id}`}
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
                                <p className={"text-gray-400 pb-1"}>Network:</p>
                                <div className='flex flex-wrap'>
                                    {data.data.networks
                                        .map((value) => value.name)
                                        .join(", ")}
                                </div>
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
                                    {data.data.keywords.results
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
                            titles={Recommendations.map((value) => value.name)}
                            genres={Recommendations.map((value) =>
                                MapGenreToID(
                                    tvGenres.data?.genres ?? [],
                                    value.genre_ids
                                )
                            )}
                            itemWidth={itemWidth}
                            imagesFullURL={Recommendations.map((value) =>
                                CalcWindowSize() !== "Small"
                                    ? config.backDropUrlSmall +
                                    value.backdrop_path
                                    : config.posterUrl + value.poster_path
                            )}
                            className={""}
                            btn1Icon={
                                <IconAndLabelWrap
                                    icon={<SVG_Play fill='black' />}
                                    label={"Watch"}
                                />
                            }
                            btn1Action={function (
                                id: number,
                                type?: media_type | undefined
                            ): void {
                                navController(`${type}/detail/${id}`);
                            }} // Watch
                            btn2Icon={<SVG_Favorite fill='black' />}
                            btn2Action={handleFavorite} // Add To fav
                            onClickAction={(id, type) => {
                                navController(`${type}/detail/${id}`);
                            }}
                            tags={Recommendations.map((value) =>
                                value.vote_average.toPrecision(2)
                            )}
                            dates={Recommendations.map(
                                (value) => value.first_air_date
                            )}
                            vote_avgs={Recommendations.map((value) =>
                                value.vote_average.toPrecision(2)
                            )}
                            media_type={["tv"]}
                            subtitles={Recommendations.map(
                                (value) => value.original_name
                            )}
                        />
                    )}
                    {Similar.length > 0 && (
                        <TitlesRow
                            name={"Similar"}
                            ids={Similar.map((value) => value.id)}
                            titles={Similar.map((value) => value.name)}
                            genres={Similar.map((value) =>
                                MapGenreToID(
                                    tvGenres.data?.genres ?? [],
                                    value.genre_ids
                                )
                            )}
                            itemWidth={itemWidth}
                            imagesFullURL={Similar.map((value) =>
                                CalcWindowSize() !== "Small"
                                    ? config.backDropUrlSmall +
                                    value.backdrop_path
                                    : config.posterUrl + value.poster_path
                            )}
                            className={""}
                            btn1Icon={
                                <IconAndLabelWrap
                                    icon={<SVG_Play fill='black' />}
                                    label={"Watch"}
                                />
                            }
                            btn1Action={function (
                                id: number,
                                type?: media_type | undefined
                            ): void {
                                navController(`${type}/detail/${id}`);
                            }} // Watch
                            btn2Icon={<SVG_Favorite fill='black' />}
                            btn2Action={handleFavorite} // Add To fav
                            onClickAction={(id, type) => {
                                navController(`${type}/detail/${id}`);
                            }}
                            tags={Similar.map((value) =>
                                value.vote_average.toPrecision(2)
                            )}
                            dates={Similar.map((value) => value.first_air_date)}
                            vote_avgs={Similar.map((value) =>
                                value.vote_average.toPrecision(2)
                            )}
                            media_type={["tv"]}
                            subtitles={Similar.map(
                                (value) => value.original_name
                            )}
                        />
                    )}
                </div>
            </div>
        </div>
    ) : (
        <LoadingSpinner />
    );
};

export default TVShowDetail;

const SeasonSectionLazy: FC<{
    value: Season;
    id: number;
    season: number;
    expand: boolean;
    onClick: () => void;
    onEpClicked: (ep: number) => void;
}> = ({ value, id, season, expand, onClick, onEpClicked }) => {
    const data = getTVSeason(id, season, expand);

    const EPView = () => {
        if (value.episode_count > 50) {
            return (
                <EpisodeViewGrid
                    number_of_episode={value.episode_count}
                    onEpClicked={onEpClicked}
                />
            );
        } else {
            if (data.data) {
                return (
                    <div>
                        {data.data.episodes.map((val) => (
                            <EpisodeViewList
                                data={val}
                                key={
                                    val.season_number * value.episode_count +
                                    val.episode_number
                                }
                                onEPClicked={() =>
                                    onEpClicked(val.episode_number)
                                }
                            />
                        ))}
                    </div>
                );
            } else {
                return (
                    <div>
                        {Array(value.episode_count).map((_, index) => (
                            <EpisodeViewList
                                onEPClicked={() => onEpClicked(index + 1)}
                            />
                        ))}
                    </div>
                );
            }
        }
    };
    return (
        <div>
            <div
                onClick={onClick}
                className={
                    "relative h-48 mt-4 flex flex-row rounded-sm transition-all duration-500 cursor-pointer hover:bg-gray-800 overflow-hidden"
                }
            >
                <img
                    className={"rounded-l"}
                    src={config.posterUrl + value.poster_path}
                    alt={value.name}
                />
                <div className={"m-4 mb-0 flex-grow overflow-hidden"}>
                    <div className={"font-bold justify-between"}>
                        <p className={"text-xl overflow-hidden"}>
                            {value.season_number}. {value.name}
                        </p>
                        <p className={"text-gray-300"}>
                            {value.episode_count} Episodes
                        </p>
                        <p>Air date: {value.air_date}</p>
                    </div>
                    <p
                        className={
                            "hidden sm:block text-justify max-h-[4.5rem] overflow-hidden"
                        }
                    >
                        {value.overview}
                    </p>
                </div>
                {data.isLoading && <LoadingSpinner />}
            </div>
            {expand && EPView()}
        </div>
    );
};

const EpisodeViewList: FC<{ data?: Episode; onEPClicked: () => void }> = ({
    data,
    onEPClicked,
}) => {
    if (data)
        return (
            <div
                onClick={onEPClicked}
                className={
                    "flex m-2 rounded h-24 sm:h-28 overflow-hidden hover:bg-gray-800 cursor-pointer"
                }
            >
                <img
                    className={"rounded h-24 w-36 sm:h-28 sm:aspect-video"}
                    src={config.backDropUrlSmall + data.still_path}
                    alt={data.episode_number.toString()}
                />
                <div className={"w-full mx-4 my-1 overflow-hidden"}>
                    <p className={"font-bold"}>
                        {data.episode_number}. {data.name}
                    </p>
                    <p>Air date: {data.air_date}</p>
                    <p
                        className={
                            "hidden sm:block text-justify h-12 overflow-hidden"
                        }
                    >
                        {data.overview}
                    </p>
                </div>
            </div>
        );
    else
        return (
            <div className={"flex m-2 h-28 rounded hover:bg-gray-800"}>
                <div
                    className={
                        "aspect-video animate-pulse bg-gray-800 rounded h-full cursor-pointer"
                    }
                />
                <div className={"w-full"}>
                    <div
                        className={
                            "my-2 bg-gray-800 rounded animate-pulse h-4 w-1/3"
                        }
                    />
                    <div
                        className={
                            "my-2 bg-gray-800 rounded animate-pulse h-20 w-5/6"
                        }
                    />
                </div>
            </div>
        );
};

const EpisodeViewGrid: FC<{
    number_of_episode: number;
    onEpClicked: (ep: number) => void;
}> = ({ number_of_episode, onEpClicked }) => {
    return (
        <div
            className={"grid gap-1 m-2"}
            style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
            }}
        >
            {[...Array(number_of_episode).keys()].map((index) => (
                <div
                    className={
                        "border-main-400 border-2 hover:border-main-1000 transition-all duration-500 cursor-pointer"
                    }
                    onClick={() => onEpClicked(index + 1)}
                >
                    <p className={"py-2 text-center"}>Ep.{index + 1}</p>
                </div>
            ))}
        </div>
    );
};
