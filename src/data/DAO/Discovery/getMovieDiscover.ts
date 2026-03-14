import DatasourceInstance from "../../Datasource/DatasourceInstance";
import config, { SortedBy, oneTimeGet } from "../../Datasource/Config";
import MovieDiscover from "../../model/Movie/MovieDiscover";
import { useQuery } from "react-query";
import MovieOverview from "../../model/Movie/MovieOverview";
import popularMovieIds from "../../popular_movie_ids.json";

interface getMovieDiscoverProps {
    genres?: number[];
    enable?: boolean;
    page?: number;
    sortedBy?: SortedBy;
    includeAdult?: boolean;
    year?: number;
    keywords?: number[];
    people?: string;
    language?: string;
}

export default function getMovieDiscover({
    genres,
    enable = true,
    page = 1,
    sortedBy = {
        option: "popularity",
        order: "desc",
    },
    includeAdult = false,
    year,
    keywords,
    people,
    language = config.language,
}: getMovieDiscoverProps) {
    let withYear = year !== undefined ? `&year=${year}` : "";
    let withGenre =
        genres !== undefined ? `&with_genres=${genres.join(",")}` : "";
    let withPeople = people !== undefined ? `&with_people=${people}` : "";
    let withKeyword =
        keywords !== undefined ? `&with_keywords=${keywords.join(",")}` : "";
    return useQuery(
        [
            "MovieDiscover",
            page,
            sortedBy,
            includeAdult,
            language,
            year,
            genres,
            keywords,
            people,
        ],
        () =>
            DatasourceInstance.get(
                `/discover/movie?api_key=${config.key}&sort_by=${sortedBy.option}.${sortedBy.order}&include_adult=${includeAdult}&page=${page}&language=${language}${withYear}${withPeople}${withGenre}${withKeyword}`
            ).then((val) => {
                return {
                    ...val.data,
                    results: val.data.results.map((value: MovieOverview) => {
                        return {
                            ...value,
                            media_type: "movie",
                        };
                    }).filter((value: MovieOverview) => popularMovieIds.includes(value.id)),
                } as MovieDiscover;
            }),
        {
            ...oneTimeGet,
            enabled: enable,
        }
    );
}
