const axios = require('axios').default;
import { Igdb_url, Igdb_auth_url } from "./constants"; 


export async function get_token() {
    const resp = await axios({
        "method": "POST",
        "url": Igdb_auth_url,
        "params": {
            "client_id": process.env.IGDB_CLIENT_ID,
            "client_secret": process.env.IGDB_CLIENT_SECRET,
            "grant_type": "client_credentials"
        }
    })
    return resp.data.access_token;
};

export async function get_game(id: string) {
    let game = await axios({
        "method": "POST",
        "url": Igdb_url,
        "headers": {
            "Authorization": "Bearer " + await get_token(),
            "Client-ID": process.env.IGDB_CLIENT_ID,
            "Accept": "application/json",
            "Content-Type": "text/plain; charset=utf-8"
        },
        "data": "where id = "+ id +"; fields id, cover.*, name, platforms.*, genres.*, total_rating, release_dates.*, summary;\n"
    })

    if (!game.data){
        return null
    }

    return game.data[0]
};

// export const get_games = (ids: [string]) => {
    
//     return ;
// };

// export const search_game = (searchTerm: string) => {
    
//     return ;
// };