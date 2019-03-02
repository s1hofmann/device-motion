module.exports = {
    testEnvironment: "node",
    roots: ["test"],
    collectCoverageFrom: [
        "src/index.js",
        "!<rootDir>/node_modules/",
    ],
};
