if (process.env["NODE_ENV"] == "production"){
    require("./configuration.prod")
} else {
    require("./configuration.dev")
}