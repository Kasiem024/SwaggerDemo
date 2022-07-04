const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Library API",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
		servers: [
			{
				url: "https://swagger--api-demo.herokuapp.com",
				description: "Live Heroku server"
			},
			{
				url: "http://localhost:3000",
				description: "For local testing"
			},
		],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use('/', indexRouter);
app.use('/books', booksRouter);

module.exports = app;
