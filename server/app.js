import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import config, {defaultEnvironment, developmentEnvironment, localEnvironment} from "./config";
import express from "express";
import logger from "morgan";
import "./mongoose.config";
import passport from "./passport.config";
import path from "path";
import PlotPoint from "./routes/PlotPoint";
import PlotPoints from "./routes/PlotPoints";
import users from "./routes/users";

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
app.use('/api/plotpoint', PlotPoint);
app.use('/api/plotpoints', PlotPoints);


module.exports = app;
