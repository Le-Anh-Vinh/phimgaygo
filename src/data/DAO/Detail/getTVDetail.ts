import { useQuery } from "react-query";
import config, { oneTimeGet } from "../../Datasource/Config";
import DatasourceInstance from "../../Datasource/DatasourceInstance";
import TVShow from "../../model/TVShow/TVShow";
import popularMovieIds from "../../popular_movie_ids.json";

//https://api.themoviedb.org/3/tv/1399?api_key=728e0b4bf88803b54b1b501869064c0e&language=en-US&append_to_response=content_ratings,credits,recommendations,similar,videos,keywords

export default function getTVDetail(
    id: number,
    language: string = config.language
) {
    return useQuery(["TVDetail", id, language], () =>
        DatasourceInstance.get(`/tv/${id}?api_key=${config.key}&language=${language}&append_to_response=content_ratings,credits,recommendations,similar,videos,keywords`)
            .then(value => {
                const data = value.data as TVShow;
                if (data.recommendations?.results) {
                    data.recommendations.results = data.recommendations.results.filter(m => popularMovieIds.includes(m.id));
                }
                if (data.similar?.results) {
                    data.similar.results = data.similar.results.filter(m => popularMovieIds.includes(m.id));
                }
                return data;
            }),
        oneTimeGet
    )
}