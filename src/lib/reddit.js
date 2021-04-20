const axios = require("axios").default;
const url = require("url");

const { Logger } = require("../lib/log");

const creds = {
    username: null, 
    password: null, 
    id: null, 
    secret: null
}

let auth = null;

let user_agent = `node.js:guessr.io:v1.0.0 (by u/${process.env.REDDIT_USERNAME})`;

class RedditClient {

    static initialize(id, secret) {
        creds.id = id;
        creds.secret = secret;
    }

    static async connect() {
        return axios.request({
            method: "POST",
            baseURL: "https://www.reddit.com/api/v1/access_token",
            params: new url.URLSearchParams({ 
                grant_type: "client_credentials",
            }),
            auth: {
                username: creds.id,
                password: creds.secret
            }
        }).then(
            (response) => {
                if (response.status === 200) {
                    auth = response.data;
                    return response.data;
                }
            }
        ).catch(
            (err) => {
                Logger.error(err.message);
            }
        )
    }

    static async getRandomSubreddit() {
        return axios.request({
            method: "POST",
            url: "https://www.reddit.com/r/random/top/.json?t=week",
        })
        .then(
            (response) => {
                if (response.status === 200) {
                    return response.data;
                }
            }
        ).catch(
            (err) => {
                Logger.error(err.message);
            }
        )
    }

    static async getRandomSubredditWithAuth() {
        return RedditClient.requestWithAuth({
            method: "GET",
            url: "https://oauth.reddit.com/r/random/top?t=week&raw_json=1"
        })
        .then(
            (response) => {
                if (response.status === 200) {
                    const clean_headers = Object.entries(response.headers)
                        .map(
                            ([hkey, hval]) => {
                                return [hkey.toLowerCase(), hval];
                            }
                        ).reduce(
                            (acc, [hkey, hval]) => {
                                return {
                                    ...acc, 
                                    [hkey]: hval
                                };
                            },
                            {}
                        );
                    if (clean_headers["x-ratelimit-used"]) {
                        Logger.warn("Reddit API is warning of usage for /u/" + process.env.REDDIT_USERNAME);
                        if (clean_headers["x-ratelimit-remaining"] < 20) {
                            Logger.error("< 20 requests remaining for /u/" + process.env.REDDIT_USERNAME);
                        }
                    } 
                    return response.data;
                }
            }
        )
        .catch(
            (err) => {
                Logger.error(err);
            }
        )
    }

    static async requestWithAuth(config) {
        return axios.request({
            ...config,
            headers: {
                Authorization: `bearer ${auth.access_token}`,
                "User-Agent": user_agent,
                ...config.headers
            }
        })
    }
}

setInterval(
    () => {
        RedditClient.connect();
    },
    1000 * 60 * 5
)

module.exports = RedditClient;