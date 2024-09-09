import { appliedJobs } from "../controllers/dashboard.controller.js"
import express from 'express'
const dashboardRouter = express.Router();

dashboardRouter.route('/get-jobs')
	.post(appliedJobs);

export default dashboardRouter;