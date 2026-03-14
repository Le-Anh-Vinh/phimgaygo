import DatasourceInstance from "../../Datasource/DatasourceInstance"
import config, { media_type, oneTimeGet } from "../../Datasource/Config"
import { useQuery } from "react-query"
import TVShowDiscover from "../../model/TVShow/TVShowDiscover";
import MovieDiscover from "../../model/Movie/MovieDiscover";
import MovieOverview from "../../model/Movie/MovieOverview";
import TVShowOverview from "../../model/TVShow/TVShowOverview";
import popularMovieIds from "../../popular_movie_ids.json";

export default function getTrending(
    type: media_type = "movie",
    timeWindow: 'day' | 'week' = config.timeWindow,
    language: string = config.language,
    page: number = 1,
) {
    return useQuery(["Trending", type, page, timeWindow, language], () =>
        DatasourceInstance
            .get(
                `/trending/${type}/${timeWindow}?api_key=${config.key}&language=${language}`
            ).then((val) => {
                if (type === "movie")
                    return {
                        ...val.data,
                        results: val.data.results.map((value: MovieOverview) => {
                            return {
                                ...value,
                                media_type: 'movie'
                            }
                        }).filter((value: MovieOverview) => popularMovieIds.includes(value.id))
                    } as MovieDiscover
                else
                    return {
                        ...val.data,
                        results: val.data.results.map((value: TVShowOverview) => {
                            return {
                                ...value,
                                media_type: 'tv'
                            }
                        }).filter((value: TVShowOverview) => popularMovieIds.includes(value.id))
                    } as TVShowDiscover
            })
        , oneTimeGet)
}