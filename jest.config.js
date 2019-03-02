module.exports = {
    testEnvironment: "node",
    roots: ["test"],
    collectCoverageFrom: [
        "index.js",
        "!<rootDir>/node_modules/",
    ],
};
