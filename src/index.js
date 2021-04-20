const fastify = require("fastify");
const fastifyHelmet = require("fastify-helmet");

const Reddit = require("./lib/reddit");
const { Logger, LOG_LEVELS } = require("./lib/log");

const logging = require("./hooks/logging");

const api = require("./routes/api");

Logger.setLogLevel(LOG_LEVELS[process.env.LOG_LEVEL || "DEBUG"]);

const Server = fastify({
    ajv: {
        customOptions: {
            removeAdditional: true,
            useDefaults: true,
            coerceTypes: true,
            allErrors: true,
            nullable: true,
        },
    },
});

Server.register(fastifyHelmet);

Server.addHook("preHandler", logging);

// In production, this will be handled by the proxy. But in development, this enables a stable frontend api endpoint without using a proxy.
if (process.env.NODE_ENV !== "production") {
    Logger.log("Running in development environment... adding /api prefix");
    Server.register(api, { prefix: "/api" });
} else {
    Server.register(api);
}

Reddit.initialize(
    // process.env.REDDIT_USERNAME,
    // process.env.REDDIT_PASSWORD,
    process.env.REDDIT_CLIENT_ID,
    process.env.REDDIT_CLIENT_SECRET
);

Reddit.connect().then(() => {
    Server.listen(process.env.PORT || 9999, "0.0.0.0", function (err, address) {
        if (err) {
            Logger.error(err);
            process.exit(1);
        }
        Logger.log(`Server is listening on ${address}`);
    });
});
