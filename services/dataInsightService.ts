import { logger } from '../helpers/logger';

export async function calculateData(startDate: string, endDate: string, propObj: any = null, propList: any, type: string) {
    try {
        const movies = propList
            .map((user: any) => user.userMovies.filter((generation: any) =>
                generation.movieSearchCriteria &&
                generation.movieGenerationDate > startDate &&
                generation.movieGenerationDate < endDate
            ))
            .reduce((acc: any, value: any) => acc.concat(value), []);

        movies.forEach((movieGen: any) => {
            if (type === 'with_genres' || type === 'with_keywords') {
                const propGenList: string[] = movieGen.movieSearchCriteria && movieGen.movieSearchCriteria[type]
                    ? movieGen.movieSearchCriteria[type].split(",")
                    : [];
                propGenList.forEach((prop: string) => {
                    if (prop !== '') propObj[prop] = (propObj[prop] || 0) + 1;
                });
            } else if (movieGen?.movieSearchCriteria?.release_date?.gte && type === 'release_date.gte') {
                const prop = movieGen.movieSearchCriteria.release_date.gte.split("-")[0];
                propObj[prop] = (propObj[prop] || 0) + 1;
            }
        });

        const data: number[] = [];
const labels: string[] = [];

Object.entries(propObj).map(([key, value]: [string, number]) => {
    data.push(value);
    labels.push(key);
});


        return {
            labels: { labels },
            datasets: [{
                label: 'Number of Selections',
                data,
                backgroundColor: [
                    '#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0', '#ffb3e6', '#c2f0c2',
                    '#ffb366', '#c2e0ff', '#e6c2ff', '#ff6666', '#66ff99', '#ffccff', '#c2c2c2',
                    '#ff9966', '#c2f0ff', '#e6ff66', '#b3b3ff', '#ffb3cc', '#c2f5c2', '#c2c2e6'
                ]
            }]
        };
    } catch (err) {
        logger.error(`Failed to get genre data: ${(err as Error).message}`);
        throw err;
    }
}

export async function calculateDailyGenerations(startDate: string, endDate: string, moviesObj: any) {
    try {
        const movies = moviesObj
            .map((user: any) => user.userMovies.filter((generation: any) =>
                generation.movieGenerationDate > startDate &&
                generation.movieGenerationDate < endDate
            ))
            .reduce((acc: any, value: any) => acc.concat(value), []);
        
        const dates: string[] = [];
        const count: number[] = [];

        let currentStartDate = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();

        while (currentStartDate < end) {
            let futureDate = new Date(currentStartDate + 86400000).toISOString();
            const filteredMovies = movies.filter((generation: any) =>
                generation.movieGenerationDate >= startDate && generation.movieGenerationDate <= futureDate
            );
            dates.push(futureDate);
            count.push(filteredMovies.length);
            currentStartDate = new Date(futureDate).getTime();
        }

        return {
            labels: { labels: dates },
            datasets: [{
                label: 'Number of Selections',
                data: count,
                backgroundColor: [
                    '#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0', '#ffb3e6', '#c2f0c2',
                    '#ffb366', '#c2e0ff', '#e6c2ff', '#ff6666', '#66ff99', '#ffccff', '#c2c2c2',
                    '#ff9966', '#c2f0ff', '#e6ff66', '#b3b3ff', '#ffb3cc', '#c2f5c2', '#c2c2e6'
                ]
            }]
        };
    } catch (err) {
        logger.error(`Failed to get data for daily generations: ${(err as Error).message}`);
        throw err;
    }
}

// Los otros métodos permanecen sin cambios...
