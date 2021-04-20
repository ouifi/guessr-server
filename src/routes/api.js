const { Logger } = require("../lib/log");
const Reddit = require("../lib/reddit");

const api = function (instance, opts, done) {
    instance.get("/echo/:echo", (request, reply) => {
        reply.send({
            echo: request.params.echo || opts.echo || "received... something",
        });
    });

    // instance.get("/connect", async () => {
    //     await Reddit.connect();
    //     return {};
    // });

    instance.get("/newgame", async () => {
        let response;
        try {
            response = await Reddit.getRandomSubredditWithAuth();
        } catch (err) {
            Logger.warn("Reddit API Call with Auth failed... falling back to no auth")

            response = await Reddit.getRandomSubreddit();
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
