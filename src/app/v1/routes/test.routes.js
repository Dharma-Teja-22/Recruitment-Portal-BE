
import { disp, loginForManagerCandidates, registration } from "../controllers/test.controller.js"
import express from 'express'
const authRouter = express.Router();

authRouter.route('/test')
	.get(disp);

authRouter.route('/login')
	.post(loginForManagerCandidates);

authRouter.route('/registration')
    .post(registration);

export default authRouter;