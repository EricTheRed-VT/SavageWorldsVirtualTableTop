import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import config, {defaultEnvironment, developmentEnvironment, localEnvironment} from "./config";
import express from "express";
import logger from "morgan";
import "./mongoose.config";
import passport from "./passport.config";
import path from "path";
import users from "./routes/users";
import PlotPoints from "./routes/PlotPoints";

const environmentsToProduceStackTraceIn = [defaultEnvironment, developmentEnvironment, localEnvironment];

const app = express();


app.use(logger(config.server.logLevel));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require("less-middleware")(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user', users);
app.use('/api/plotpoints', PlotPoints);

if (environmentsToProduceStackTraceIn.includes(config.currentEnvironment)) {
	app.use(function (err, req, res) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
} else {
	app.use(function (req, res, next) {

		const err  = new Error('Not Found');
		err.status = 404;
		next(err);
	});
	app.use(function (err, req, res) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: {}
		});
	});
}


module.exports = app;
