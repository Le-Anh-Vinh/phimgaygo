import { useQuery } from "react-query";
import DatasourceInstance from "../../Datasource/DatasourceInstance";
import config, { oneTimeGet } from "../../Datasource/Config";
import Movie from "../../model/Movie/Movie";
import popularMovieIds from "../../popular_movie_ids.json";

//https://api.themoviedb.org/3/movie/550?api_key=728e0b4bf88803b54b1b501869064c0e&language=vi&append_to_response=keywords,credits,recommendations,similar,release_dates

export default function getDetail(
    id: number,
    language: string = config.language,
) {
    return useQuery(["MovieDetail", id, language],
        () => DatasourceInstance.get(
            `/movie/${id}?api_key=${config.key}&language=${language}&append_to_response=keywords,credits,recommendations,similar,release_dates`
        ).then((val) => {
            const data = val.data as Movie;
            if (data.recommendations?.results) {
                data.recommendations.results = data.recommendations.results.filter(m => popularMovieIds.includes(m.id));
            }
            if (data.similar?.results) {
                data.similar.results = data.similar.results.filter(m => popularMovieIds.includes(m.id));
            }
            return data;
        }),
        oneTimeGet)
}
