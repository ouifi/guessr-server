const { Logger } = require("./log");

class Histogram {

    constructor(newHistogram) {
        this.histogram = newHistogram || {};
    }

    tick(key) {
        if (this.histogram[key]) {
            this.histogram[key]++;
        } else {
            this.histogram[key] = 1;
        }
        return this.histogram[key];
    }

    out(level) {
        Logger.log(level, this.histogram);
    }
}

module.exports = Histogram;