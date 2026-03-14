import { FC, useEffect, useMemo, useRef, useState } from "react";
import getTrending from "../../data/DAO/Discovery/getTrending";
import getMovieDiscover from "../../data/DAO/Discovery/getMovieDiscover";
import { NavigateFunction, useOutletContext } from "react-router-dom";
import ContextProps from "../SharedLayout/ContextProps";
import BigBanner from "../common/Layout/BigBanner";
import MovieOverview from "../../data/model/Movie/MovieOverview";
import config, { media_type } from "../../data/Datasource/Config";
import getGenres from "../../data/DAO/Detail/getGenres";
import MapGenreToID from "../../utils/MapGenreToID";
import SVG_Play from "../common/SVG/SVG_Play";
import SVG_Favorite from "../common/SVG/SVG_Favorite";
import IconAndLabelWrap from "../common/Component/IconAndLabelWrap";
import CalculateWidth from "../../utils/CalculateWidth";
import TitlesRow from "../common/Layout/TitlesRow";
import { UseQueryResult } from "react-query";
import MovieDiscover from "../../data/model/Movie/MovieDiscover";
import useIntersection from "../../utils/ElementInViewObseve";
import Genre from "../../data/model/Movie/Genre";
import CalcWindowSize from "../../utils/windowSize";
import { User } from "firebase/auth";
import Screens from "../../utils/Screen";

const Home: FC = () => {
    const { navController, footerInView, handleFavorite, user } = useOutletContext<ContextProps>();

    const [noFooterHit, setNoFooterHit] = useState(0)
    useEffect(() => {
        footerInView && setNoFooterHit(old => old + 1)
    }, [footerInView])

    // get Genres
    const movieGenres = getGenres();
    // get Trending
    const movieTrending = getTrending();

    // Now strictly handles movies
    const trendingData: MovieOverview[] = useMemo(
        () =>
            [...(movieTrending.data?.results ?? [])]
                // The 'value is MovieOverview' tells TS to narrow the type if it returns true
                .filter((value): value is MovieOverview =>
                    "title" in value && !!value.backdrop_path && !!value.poster_path
                )
                .sort((a, b) => b.vote_average - a.vote_average),
        [movieTrending.isSuccess]
    );

    const itemWidth = CalculateWidth({ padding: 0 });

    const displayData = useMemo<[media_type, Genre][]>(() => {
        return (movieGenres.data?.genres ?? [])
            .map<[media_type, Genre]>((value) => ["movie", value])
            .slice(0, noFooterHit * 3);
    }, [movieGenres.isSuccess, noFooterHit]);

    return (
        <>
            <BigBanner
                ids={trendingData.map((value) => value.id)}
                media_type={trendingData.map((value) => value.media_type || 'movie')}
                titles={trendingData.map((value) => value.title)}
                subTitles={trendingData.map((value) => value.original_title)}
                descriptions={trendingData.map((value) => value.overview)}
                date={trendingData.map((value) => value.release_date)}
                vote_avgs={trendingData.map((value) => value.vote_average)}
                genres={trendingData.map((value) =>
                    MapGenreToID(movieGenres.data?.genres ?? [], value.genre_ids)
                )}
                postersFullURL={trendingData.map(
                    (value) => config.posterUrl + value.poster_path
                )}
                backDropsFullURL={trendingData.map(
                    (value) => config.backDropUrlSmall + value.backdrop_path
                )}
                bannerFullURL={trendingData.map(
                    (value) => config.backDropUrlOriginal + value.backdrop_path
                )}
                btn1Icon={
                    <IconAndLabelWrap
                        icon={<SVG_Play fill="black" />}
                        label={"Watch"}
                    />
                }
                btn1Action={(id, type) => {
                    navController(`${type}/detail/${id}`);
                }}
                btn2Icon={<SVG_Favorite fill="black" />}
                btn2Action={handleFavorite}
                onClickAction={(id, type) => {
                    navController(`${type}/detail/${id}`);
                }}
                itemWidth={itemWidth}
            />
            <div className="overflow-x-hidden">
                {displayData.map(([type, { name, id }]) => {
                    return (
                        <TitleRowLazyLoadWrapper
                            media_type={type}
                            user={user}
                            handleFavorite={handleFavorite}
                            navController={navController}
                            key={type + id}
                            name={`${name} Movies`}
                            genreID={id}
                            loaderFn={(enable) => getMovieDiscover({ genres: [id], enable })}
                            genres={movieGenres.data?.genres ?? []}
                            itemWidth={itemWidth}
                        />
                    );
                })}
            </div>
        </>
    );
};

export default Home;

const TitleRowLazyLoadWrapper: FC<{
    media_type: media_type,
    name: string;
    genreID: number;
    loaderFn: (enable: boolean) => UseQueryResult<MovieDiscover, unknown>;
    genres: Genre[];
    itemWidth?: number;
    navController: NavigateFunction;
    user: User | null,
    handleFavorite: (filmID: number, media_type: media_type) => void
}> = ({
    name,
    loaderFn,
    itemWidth,
    genres,
    genreID,
    navController,
    user,
    handleFavorite,
    media_type
}) => {
        const ref = useRef<HTMLDivElement | null>(null);
        const visible = useIntersection(ref, 0);
        const displayData = loaderFn(visible);
        const data = [...(displayData.data?.results ?? [])].filter(
            (value) => value.backdrop_path && value.poster_path
        );

        if (data.length === 0) {
            return (
                <div ref={ref}>
                    <TitlesRow
                        placeholder
                        name={name}
                        className={"p-4"}
                        onSeeMore={() => { }}
                        itemWidth={itemWidth}
                    />
                </div>
            );
        } else {
            return (
                <div ref={ref}>
                    <TitlesRow
                        ids={data.map((value) => value.id)}
                        name={name}
                        media_type={data.map((value) => value.media_type || 'movie')}
                        titles={data.map((value) => value.title)}
                        subtitles={data.map((value) => value.original_title)}
                        genres={data.map((value) => MapGenreToID(genres, value.genre_ids))}
                        dates={data.map((value) =>
                            new Date(value.release_date).getFullYear().toString()
                        )}
                        vote_avgs={data.map((value) =>
                            value.vote_average.toPrecision(2)
                        )}
                        tags={data.map((value) =>
                            value.vote_average.toPrecision(2)
                        )}
                        imagesFullURL={data.map(
                            (value) => (CalcWindowSize() !== 'Small' ? config.backDropUrlSmall + value.backdrop_path : config.posterUrl + value.poster_path)
                        )}
                        className={"py-4"}
                        btn1Icon={
                            <IconAndLabelWrap
                                icon={<SVG_Play fill="black" />}
                                label={"Watch"}
                            />
                        }
                        btn1Action={(id, type) => {
                            navController(`${type}/detail/${id}`);
                        }}
                        btn2Icon={<SVG_Favorite fill="black" />}
                        btn2Action={handleFavorite}
                        onClickAction={(id, type) => {
                            navController(`${type}/detail/${id}`);
                        }}
                        itemWidth={itemWidth}
                        onSeeMore={() => navController(`${Screens.MovieDiscover}?genres=${genreID}`)}
                    />
                </div>
            );
        }
    };