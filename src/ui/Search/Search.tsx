import { FC, useMemo, useState } from "react";
import MovieSearch from "../../data/DAO/Search/MovieSearch";
import TVSearch from "../../data/DAO/Search/TVSearch";
import { useLocation, useOutletContext } from "react-router-dom";
import ContextProps from "../SharedLayout/ContextProps";
import SVG_Search from "../common/SVG/SVG_Search";
import TitlesGrid from "../common/Layout/TitlesGrid";
import getGenres from "../../data/DAO/Detail/getGenres";
import MapGenreToID from "../../utils/MapGenreToID";
import config from "../../data/Datasource/Config";
import SVG_Favorite from "../common/SVG/SVG_Favorite";
import IconAndLabelWrap from "../common/Component/IconAndLabelWrap";
import SVG_Play from "../common/SVG/SVG_Play";

import {
    Autocomplete,
    Button,
    Pagination,
    Switch,
    TextField,
} from "@mui/material";
import MovieOverview from "../../data/model/Movie/MovieOverview";
import TVShowOverview from "../../data/model/TVShow/TVShowOverview";
import LoadingSpinner from "../common/Component/LoadingSpinner";
import CalcWindowSize from "../../utils/windowSize";
import CalculateWidth from "../../utils/CalculateWidth";

interface SearchParams {
    query: string;
    adult: boolean;
    year: number | "All";
    page: number;
}

const Search: FC = () => {
    const { navController, handleFavorite } = useOutletContext<ContextProps>();
    const { query, page, adult, year } = useUrlParams();

    const [_query, _setQuery] = useState(query);
    const [_page, _setPage] = useState(page);
    const [_adult, _setAdult] = useState(adult);
    const [_year, _setYear] = useState<number | "All">(year);

    const movieGenres = getGenres();
    const tvShowGenres = getGenres("tv");

    const MovieData = MovieSearch(
        query ?? "",
        query.length > 0,
        year === "All" ? undefined : year,
        adult,
        page
    );

    const TVShowData = TVSearch(
        query ?? "",
        page,
        query.length > 0,
        adult,
        year === "All" ? undefined : year
    );
    const searchHandle = (change: SearchParams) => {
        navController(
            `search?query=${encodeURIComponent(change.query ?? "")}&page=${change.page
            }&adult=${change.adult}&year=${change.year}`,
            {
                replace: true,
            }
        );
    };

    const SearchResult = useMemo<(MovieOverview | TVShowOverview)[]>(
        () => [
            ...(MovieData.data?.results ?? []),
            ...(TVShowData.data?.results ?? []),
        ],
        [MovieData.data, TVShowData.data]
    );

    const MaxPage = useMemo(
        () =>
            Math.max(
                MovieData.data?.total_pages ?? 0,
                TVShowData.data?.total_pages ?? 0
            ),
        [MovieData.data, TVShowData.data]
    );

    const yearOptions = useMemo(() => {
        const currYear = new Date().getFullYear();
        return [
            "All",
            ...[...Array(currYear - 1990 + 1).keys()].map((value) =>
                String(currYear - value)
            ),
        ];
    }, []);

    return (
        <div className='mt-48 w-full'>
            <div className='p-4 flex items-center h-16 rounded-lg border-2 border-main-1000 w-[80%] mx-auto'>
                <input
                    className='flex-grow bg-transparent placeholder placeholder-white underline-offset-1 text-xl text-white focus:outline-none focus:underline seach-input'
                    type={"text"}
                    placeholder='Looking for something'
                    value={_query}
                    onChange={(e) => _setQuery(e.currentTarget.value)}
                    onKeyDown={(e) =>
                        e.key === "Enter" &&
                        Boolean(_query) &&
                        searchHandle({
                            query: _query,
                            page: 1,
                            adult: adult,
                            year: "All",
                        })
                    }
                />

                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        Boolean(_query) &&
                            searchHandle({
                                query: _query,
                                page: 1,
                                adult: adult,
                                year: "All",
                            });
                    }}
                    className='cursor-pointer'
                >
                    <SVG_Search />
                </div>
            </div>
            <div className='relative p-4 mt-8 border-2 border-gray-700 rounded-sm w-fit mx-auto'>
                <p className='text-xl'>Filter:</p>
                <div className='grid grid-cols-2 gap-4 place-items-center w-max'>
                    <p>Include Adult Results</p>
                    <Switch
                        checked={_adult}
                        onChange={() => _setAdult((old) => !old)}
                    />
                    <p>Only look for result in</p>
                    <Autocomplete
                        autoHighlight
                        autoComplete
                        size='small'
                        options={yearOptions}
                        onInputChange={(e) =>
                            _setYear(
                                (e?.currentTarget?.textContent ?? "All") as
                                | number
                                | "All"
                            )
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label='Year'
                                inputMode='numeric'
                            />
                        )}
                    />
                </div>

                <Button
                    sx={{
                        margin: ".5rem",
                        marginTop: "1rem",
                    }}
                    variant='contained'
                    onClick={() =>
                        searchHandle({
                            query: query,
                            page: 1,
                            adult: _adult,
                            year: _year,
                        })
                    }
                >
                    Apply
                </Button>
            </div>
            {MovieData.isLoading && TVShowData.isLoading ? (
                <div className='absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2'>
                    <LoadingSpinner />
                </div>
            ) : SearchResult.length > 0 ? (
                <TitlesGrid
                    className='mx-2'
                    name={`Movies and shows related to \"${query}\"`}
                    ids={SearchResult.map((value) => value.id)}
                    titles={SearchResult.map((value) =>
                        "title" in value ? value.title : value.name
                    )}
                    subtitles={SearchResult.map((value) =>
                        "original_title" in value
                            ? value.original_title
                            : value.original_name
                    )}
                    genres={SearchResult.map((value) =>
                        value.media_type === "movie"
                            ? MapGenreToID(
                                movieGenres.data?.genres ?? [],
                                value.genre_ids
                            )
                            : MapGenreToID(
                                tvShowGenres.data?.genres ?? [],
                                value.genre_ids
                            )
                    )}
                    media_type={SearchResult.map((value) => value.media_type)}
                    dates={SearchResult.map((value) =>
                        "release_date" in value
                            ? value.release_date
                            : value.first_air_date
                    )}
                    vote_avgs={SearchResult.map((value) =>
                        value.vote_average.toFixed(1)
                    )}
                    tags={SearchResult.map((value) =>
                        value.vote_average.toFixed(1)
                    )}
                    imagesFullURL={SearchResult.map((value) =>
                        CalcWindowSize() !== "Small"
                            ? config.backDropUrlSmall + value.backdrop_path
                            : config.posterUrl + value.poster_path
                    )}
                    btn1Icon={
                        <IconAndLabelWrap
                            icon={<SVG_Play fill="black" />}
                            label={"Watch"}
                        />
                    }
                    btn1Action={(id, type) => {
                        navController(`${type}/detail/${id}`);
                    }} // Watch
                    btn2Icon={<SVG_Favorite fill="black" />}
                    btn2Action={handleFavorite}
                    onClickAction={(id, type) => {
                        navController(`${type}/detail/${id}`);
                    }}
                />
            ) : (
                Boolean(query) && (
                    <p className='text-center text-2xl'>
                        Sorry, we can't find anything related to "{query}"
                    </p>
                )
            )}
            {Boolean(query) && (
                <div className='p-4 flex justify-center'>
                    <Pagination
                        count={MaxPage}
                        page={page}
                        onChange={(_, page) =>
                            searchHandle({
                                query,
                                adult,
                                year,
                                page: page,
                            })
                        }
                    />
                </div>
            )}
            <p className="font-bold text-3xl p-4 tracking-wider group">More recommendation
                <p className="rec-search-div"></p>
            </p>
        </div>
    );
};

export default Search;

function useUrlParams() {
    const { search } = useLocation();
    let tmp = new URLSearchParams(search);
    return useMemo(() => {
        return {
            query: tmp.get("query") ?? "",
            adult: tmp.get("adult") === "true",
            year:
                Number(tmp.get("year")) > 1990
                    ? "All"
                    : Number(tmp.get("year")),
            page: Number(tmp.get("page")) > 0 ? Number(tmp.get("page")) : 1,
        } as SearchParams;
    }, [search]);
}
