const PQueue = require("p-queue").default;

const loginQueue = new PQueue({
    concurrency: 3
});

module.exports = loginQueue;