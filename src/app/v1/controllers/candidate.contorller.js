import logger from "../../../../logger.js";
import config from "../../../../config.js";
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import Candidate from '../models/candidate.model.js'

// export async function candidateRegistration(req, res){
//     try{
//         const candidateData = req.body;
//         const result = await Candidate.create(candidateData)
//         if(result.status == 200){
//             return res.status(StatusCodes.OK).send(result.msg)
//         }
//         else{
//             return res.status(result.status).send(result.msg)
//         }
//     }
//     catch(err){
//         console.log(err)
//     }
// }

export async function jobPosts(req, res){
    try{
        const result = await Candidate.jobs()
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

export async function jobApplication(req, res){
    try{
        const applicationData = req.body;
        const result = await Candidate.applyForJob(applicationData)
        if(result.status == 200){
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

export async function statusCheck(req, res){
    try{
        const StatusCheckData = req.body;
        
        const result = await Candidate.jobStatus(StatusCheckData)
        if(result.status == 200){
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

export async function interviewStatus(req, res){
    try{
        const StatusCheckData = req.body;
        console.log(StatusCheckData);
        
        const result = await Candidate.interviewStatusCheck(StatusCheckData)
        if(result.status == 200){
            return res.status(StatusCodes.OK).send(result.msg)
        }
        else{
            return res.status(StatusCodes.CONFLICT).send(result.msg)
        }
    }
    catch(err){
        console.log(err)
    }
}