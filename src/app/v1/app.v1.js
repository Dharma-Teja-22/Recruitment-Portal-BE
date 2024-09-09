import passport from "passport";
import passportJWT from "passport-jwt";
import express from 'express';
import config from "../../../config.js";

const { Strategy: JwtStrategy, ExtractJwt } = passportJWT;

const app = express();

//controllers
import {pingTest, test} from '../v1/controllers/test.controller.js';

//routers
import managerRouter from '../v1/routes/manager.routers.js';
import authRouter from '../v1/routes/test.routes.js'
import candidateRouter  from "../v1/routes/candidate.routers.js";
import dashboardRouter from "./routes/dashboard.routers.js";

//defining the JWT strategy
const passportStrategy = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.SECRET_KEY  // secret key 
}, 
(jwt_payload, next) => {
    console.log(jwt_payload)
    next(null, jwt_payload)
});

//init passport strategy
passport.use(passportStrategy);

//handle browser options Request
const handleOptionsReq = (req, res, next) => {
    if (req.method === 'OPTIONS') { 
        res.send(200);
    } else { 
        next();
    }
}

//test routes
app.get('/test', test);
app.get('/test/ping', pingTest);

//secured routes - auth using user JWT
// app.use('/api', handleOptionsReq, passport.authenticate('jwt', { session: false }));
app.use('/api', authRouter);

app.use('/manager', passport.authenticate('jwt', { session: false }), managerRouter);
app.use('/candidate', passport.authenticate('jwt', { session: false }),  candidateRouter);
app.use('/dashboard', dashboardRouter);

export default app;
