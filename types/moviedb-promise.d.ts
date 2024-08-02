// types/moviedb-promise.d.ts

declare module 'moviedb-promise' {
    interface Movie {
        title: string;
        id: number;
        overview?: string;
        release_date?: string;
        vote_average?: number;
    }

    interface MovieResponse {
        results: Movie[];
    }

    class MovieDb {
        constructor(apiKey: string);
        moviePopular(): Promise<MovieResponse>;
        movieSearch(query: { query: string }): Promise<MovieResponse>;
        movieInfo(query: { id: number }): Promise<Movie>;
    }

    export default MovieDb;
}
