import { logger } from '../helpers/logger';

// Definir los tipos de datos
interface MovieGeneration {
    movieSearchCriteria?: {
        [key: string]: any;  
        release_date?: {
            gte?: string;
        };
    };
    movieGenerationDate: string;
}

interface User {
    userMovies: MovieGeneration[];
}

export async function calculateData(
    startDate: string, 
    endDate: string, 
    propObj: { [key: string]: number } = {}, 
    propList: User[], 
    type: string
): Promise<any> {
    try {
        const movies = propList
            .map((user: User) => user.userMovies.filter((generation: MovieGeneration) =>
                generation.movieSearchCriteria &&
                generation.movieGenerationDate > startDate &&
                generation.movieGenerationDate < endDate
            ))
            .reduce((acc, value) => acc.concat(value), []);

        movies.forEach((movieGen: MovieGeneration) => {
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

        Object.entries(propObj).forEach(([key, value]) => {
            data.push(value);
            labels.push(key);
        });

        return {
            labels: labels,
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

export async function calculateDailyGenerations(
    startDate: string, 
    endDate: string, 
    moviesObj: User[]
): Promise<any> {
    try {
        const movies = moviesObj
            .map((user: User) => user.userMovies.filter((generation: MovieGeneration) =>
                generation.movieGenerationDate > startDate &&
                generation.movieGenerationDate < endDate
            ))
            .reduce((acc, value) => acc.concat(value), []);
        
        const dates: string[] = [];
        const count: number[] = [];

        let currentStartDate = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();

        while (currentStartDate < end) {
            let futureDate = new Date(currentStartDate + 86400000).toISOString();
            const filteredMovies = movies.filter((generation: MovieGeneration) =>
                generation.movieGenerationDate >= startDate && generation.movieGenerationDate <= futureDate
            );
            dates.push(futureDate);
            count.push(filteredMovies.length);
            currentStartDate = new Date(futureDate).getTime();
        }

        return {
            labels: dates,
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

// Definir y exportar el chartController
export async function chartController(
    startDate: string, 
    endDate: string, 
    chartType: string
): Promise<any> {
    try {
        let result;
        const propObj: { [key: string]: number } = {}; // Inicia un objeto vacío para acumular datos
        const propList: User[] = [];  

        if (chartType === 'daily') {
            result = await calculateDailyGenerations(startDate, endDate, propList);
        } else {
            result = await calculateData(startDate, endDate, propObj, propList, chartType);
        }
        return result;
    } catch (err) {
        logger.error(`Failed to get data for chart: ${(err as Error).message}`);
        throw err;
    }
}
