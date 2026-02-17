const crypto = require("crypto");
const axios = require("axios");
const HttpProxyAgent = require("http-proxy-agent");
const HttpsProxyAgent = require("https-proxy-agent");

const API_KEY = process.env.CF_API_KEY;
const API_SECRET = process.env.CF_API_SECRET;

function generateApiSig(methodName, params) {
    const rand = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
    const time = Math.floor(Date.now() / 1000);

    const allParams = {
        ...params,
        apiKey: API_KEY,
        time: time
    };

    // Sort params lexicographically
    const sortedKeys = Object.keys(allParams).sort();

    const paramString = sortedKeys
        .map(key => `${key}=${allParams[key]}`)
        .join("&");

    const toHash = `${rand}/${methodName}?${paramString}#${API_SECRET}`;

    const hash = crypto
        .createHash("sha512")
        .update(toHash)
        .digest("hex");

    const apiSig = rand + hash;

    return { apiSig, time };
}

async function fetchStandings(contestId) {
    try {
        const { apiSig, time } = generateApiSig("contest.standings", {contestId, from: 1, count: 5});
        // Set proxy from environment variable or use null
        const proxyUrl = process.env.PROXY_URL; // e.g., "http://proxy.university.edu:8080"
        
        const axiosConfig = {
            params: {
                contestId,
                from: 1,
                count: 5,
                apiKey: API_KEY,
                time,
                apiSig
            }
        };

        // Add proxy agents if proxy URL is provided
        if (proxyUrl) {
            axiosConfig.httpAgent = new HttpProxyAgent.HttpProxyAgent(proxyUrl);
            axiosConfig.httpsAgent = new HttpsProxyAgent.HttpsProxyAgent(proxyUrl);
        }

        const response = await axios.get(
            "https://codeforces.com/api/contest.standings",
            axiosConfig
        );

        return response.data.result;
    } catch (error) {
        console.error("Error fetching standings:", error.message);
        throw error;
    }
}

module.exports = { fetchStandings };
