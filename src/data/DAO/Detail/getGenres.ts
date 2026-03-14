import DatasourceInstance from "../../Datasource/DatasourceInstance"
import config, { media_type, oneTimeGet } from "../../Datasource/Config"
import { useQuery } from "react-query"
import Genre from "../../model/Movie/Genre"

export default function getGenres(
    type: media_type = 'movie',
    language: string = config.language
) {
    return useQuery(["genres", type, language], () =>
        DatasourceInstance
            .get(
                `/genre/${type}/list?api_key=${config.key}&language=${language}`
            ).then((val) => (val.data as { "genres": Genre[] }))
        , {
            ...oneTimeGet,
            cacheTime: config.timeLong * 96,
            staleTime: config.timeLong * 96,

        })
}