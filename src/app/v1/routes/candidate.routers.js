
import {jobPosts, jobApplication, statusCheck, interviewStatus } from "../controllers/candidate.contorller.js"
import express from 'express'
const candidateRouter = express.Router();

candidateRouter.route('/fetch-jobs')
    .get(jobPosts);

candidateRouter.route('/apply-job')
    .put(jobApplication);

candidateRouter.route('/job-status-check')
    .post(statusCheck);

candidateRouter.route('/interview-status-check')
    .put(interviewStatus);

export default candidateRouter;
