"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMatcher = listMatcher;
var movieGenreOBJ = {
    '37': 'Western',
    '28': 'Action',
    '12': 'Adventure',
    '16': 'Animation',
    '35': 'Comedy',
    '80': 'Crime',
    '99': 'Documentary',
    '18': 'Drama',
    '10751': 'Family',
    '14': 'Fantasy',
    '36': 'History',
    '27': 'Horror',
    '10402': 'Music',
    '9648': 'Mystery',
    '10749': 'Romance',
    '878': 'Sci-Fi',
    '10770': 'TV Movie',
    '53': 'Thriller',
    '10752': 'War'
};
function genreMatcher(genres) {
    return genres
        .map(function (genre) { return movieGenreOBJ[genre]; })
        .filter(Boolean) // Filtra los valores undefined o null
        .join(', ');
}
function listMatcher(movieGenres) {
    if (!movieGenres) {
        return '';
    }
    var genres = movieGenres.map(String);
    return genreMatcher(genres);
}
//# sourceMappingURL=genreMatcher.js.map