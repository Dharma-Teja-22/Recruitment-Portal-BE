import logger from "../../../../logger.js";
import config from "../../../../config.js";
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import Dashboard from "../models/dashboard.model.js";

export async function appliedJobs(req, res){
    try{
        const data = req.body;
        const result = await Dashboard.jobs(data.candidateId)
        if(result.status == 200){
            console.log(result.msg)
            return res.status(StatusCodes.OK).send(result.msg)
        }
        else{
            return res.status(result.status).send(result.msg)
        }
    }
    catch(err){
        console.log(err)
    }
}
