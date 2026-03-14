import { useQuery } from "react-query";
import config, { oneTimeGet } from "../../Datasource/Config";
import DatasourceInstance from "../../Datasource/DatasourceInstance";
import TVShowDiscover from "../../model/TVShow/TVShowDiscover";
import TVShowOverview from "../../model/TVShow/TVShowOverview";
import popularMovieIds from "../../popular_movie_ids.json";

export default function TVSearch(
    query: string,
    page: number = 1,
    enable: boolean = false,
    adult: boolean = false,
    year: number | undefined = undefined,
    language: string = config.language
) {
    return useQuery(["TVSearch", query, page, adult, year, language], () =>
        DatasourceInstance.get(
            `/search/tv?api_key=${config.key}&query=${query}&page=${page}&adult=${adult}${year ? "&first_air_date_year=" + year : ""}&language=${language}`
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
            enabled: enable
        }
    )
}