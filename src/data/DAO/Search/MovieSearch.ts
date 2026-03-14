import DatasourceInstance from "../../Datasource/DatasourceInstance";
import config, { oneTimeGet } from "../../Datasource/Config";
import { useQuery } from "react-query";
import MovieDiscover from "../../model/Movie/MovieDiscover";
import MovieOverview from "../../model/Movie/MovieOverview";

import popularMovieIds from "../../popular_movie_ids.json";

export default function MovieSearch(
    query: string,
    enable: boolean,
    year?: number,
    adult: boolean = false,
    page: number = 1,
    language: string = config.language,
    region: string = config.region
) {
    return useQuery(
        ["MovieSearch", query, year, adult, page, language, region],
        () =>
            DatasourceInstance.get(
                `/search/movie?api_key=${
                    config.key
                }&query=${query}&include_adult=${adult}&language=${language}&page=${page}&region=${region}${
                    year ? "&year=" + String(year) : ""
                }`
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
