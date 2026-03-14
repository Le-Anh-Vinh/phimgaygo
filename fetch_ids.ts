const axios = require("axios");
const fs = require("fs");

const API_KEY = "728e0b4bf88803b54b1b501869064c0e";
const BASE_URL = "https://api.themoviedb.org/3";

async function fetchPopularMovieIds() {
    const ids: number[] = [];
    console.log("Starting to fetch popular movies...");
    
    // TMDB returns 20 results per page, so we need 100 pages for 2000 movies
    for (let page = 1; page <= 100; page++) {
        try {
            const response = await axios.get(`${BASE_URL}/movie/popular`, {
                headers: {
                    "Accept-Encoding": "identity" // Instruct API NOT to compress the response
                },
                params: {
                    api_key: API_KEY,
                    language: "en-US",
                    page: page,
                },
            });
            
            const data = response.data;
            if (page === 1) {
                console.log("\nDEBUG - First page response data:", JSON.stringify(data).substring(0, 500));
            }
            const results = data.results || [];
            for (const movie of results) {
                ids.push(movie.id);
            }
            
            process.stdout.write(`\rFetched page ${page}/100 [Total IDs so far: ${ids.length}]`);
            
            // Be polite to the API rate limit (although v3 has soft limits, it's good practice)
            await new Promise(resolve => setTimeout(resolve, 50)); 
            
        } catch (error) {
            console.error(`\nFailed to fetch page ${page}:`, (error as Error).message);
        }
    }
    
    console.log(`\n\nFinished fetching! Total IDs collected: ${ids.length}`);
    
    // Save to file
    const outputPath = "popular_movie_ids.json";
    fs.writeFileSync(outputPath, JSON.stringify(ids, null, 2));
    console.log(`Saved IDs to ${outputPath}`);
}

fetchPopularMovieIds();
