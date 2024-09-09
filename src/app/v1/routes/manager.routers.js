
import { managerJobPost, fetchCandidates, updateApplicationStatus, fetchCandidatesInterview, assignInterview, updateInterviewStatus, GetCandidate } from "../controllers/manager.controller.js"
import express from 'express'
const managerRouter = express.Router();

managerRouter.route('/manager-post')
	.post(managerJobPost);

managerRouter.route('/fetch-candidates')
	.put(fetchCandidates)

managerRouter.route('/fetch-candidates-info')
	.put(fetchCandidatesInterview)
	
managerRouter.route('/update-status')
	.put(updateApplicationStatus)

managerRouter.route('/assign-interview')
	.post(assignInterview);

managerRouter.route('/update-interview-status')
	.put(updateInterviewStatus);

managerRouter.route('/getCandidate').put(GetCandidate);

export default managerRouter;