const fs = require("fs");
const path = require("path");

const { Logger } = require("../lib/log");
const Reddit = require("../lib/reddit");

const api = function (instance, opts, done) {
    instance.get("/echo/:echo", (request, reply) => {
        reply.send({
            echo: request.params.echo || opts.echo || "received... something",
        });
    });

    let denySubreddits = null;

    try {
        const data = fs.readFileSync(path.join(process.cwd(), "subreddit-denylist.txt"), { encoding: "utf-8"});
        data.replace("\r", "");
        denySubreddits = data.split("\n");
    } catch (err) {
        Logger.error(err.message);
        denySubreddits = [];
    }

    instance.get("/newgame", async () => {
        let response;
        try {
            response = await Reddit.getRandomSubredditWithAuth();
        } catch (err) {
            Logger.warn("Reddit API call with Auth failed... falling back to no auth");
            response = await Reddit.getRandomSubreddit();
        }

        while (denySubreddits.indexOf(response.data.children[0].data.subreddit) > -1) {
            try {
                response = await Reddit.getRandomSubredditWithAuth();
            } catch (err) {
                Logger.warn("Reddit API call with Auth failed... falling back to no auth");
                response = await Reddit.getRandomSubreddit();
            }
        }

        return {
            subreddit: response.data.children[0].data.subreddit,
            posts: response.data.children.map((post) => ({
                title: post.data.title,
                image: (
                    post.data.preview
                        ? post.data.preview.images[0].source.url
                        : null
                )
            })),
        };
    });

    instance.all("/*", (request, reply) => {
        reply.code(404);
        reply.send();
    });

    done();
};

module.exports = api;
