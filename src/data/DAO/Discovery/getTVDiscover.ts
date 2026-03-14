import DatasourceInstance from "../../Datasource/DatasourceInstance";
import config, { SortedBy, oneTimeGet } from "../../Datasource/Config";
import { useQuery } from "react-query";
import TVShowDiscover from "../../model/TVShow/TVShowDiscover";
import TVShowOverview from "../../model/TVShow/TVShowOverview";
import popularMovieIds from "../../popular_movie_ids.json";

interface getTvDiscoverProps {
    page?: number;
    sortedBy?: SortedBy;
    enable?: boolean;
    first_air_date_year?: number;
    genres?: number[];
    keywords?: number[];
    language?: string;
    adult?: boolean;
}

export default function getTVDiscover({
    page = 1,
    sortedBy = {
        option: "popularity",
        order: "desc",
    },
    enable = true,
    first_air_date_year,
    genres,
    keywords,
    language = config.language,
}: getTvDiscoverProps) {
    let withYear =
        first_air_date_year !== undefined
            ? `&first_air_date_year=${first_air_date_year}`
            : "";
    let withGenre =
        genres !== undefined ? `&with_genres=${genres.join(",")}` : "";
    let withKeyword =
        keywords !== undefined ? `&with_keywords=${keywords.join(",")}` : "";
    return useQuery(
        [
            "TVDiscover",
            page,
            sortedBy,
            language,
            first_air_date_year,
            genres,
            keywords,
        ],
        () =>
            DatasourceInstance.get(
                `/discover/tv?api_key=${config.key}&sort_by=${sortedBy.option}.${sortedBy.order}&page=${page}&language=${language}${withYear}${withGenre}${withKeyword}`
            ).then((val) => {
                return {
                    ...val.data,
                    results: val.data.results.map((value: TVShowOverview) => {
                        return {
                            ...value,
                            media_type: "tv",
                        };
                    }).filter((value: TVShowOverview) => popularMovieIds.includes(value.id)),
                } as TVShowDiscover;
            }),
        {
            ...oneTimeGet,
            enabled: enable,
        }
    );
}
