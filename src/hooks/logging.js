const { Logger } = require("../lib/log");

const logging = (request, reply, done) => {
    Logger.debug(`Method=${request.method};Path=${request.url};RoutedTo=${request.routerPath}`);

    done();
};

module.exports = logging;
