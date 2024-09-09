import logger from "../../../../logger.js";
import config from "../../../../config.js";
import pkg from 'jsonwebtoken';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import Manager from '../models/manager.model.js'

// export async function managerRegistration(req, res){
//     try{
//         const managerData = req.body;
//         const result = await Manager.create(managerData)
//         if(result.status == 200){
//             return res.status(200).send(result.msg)
//         }
//         else{
//             return res.status(result.status).send(result.msg)
//         }
//     }
//     catch(err){
//         console.log(err)
//     }
// }

export async function managerJobPost(req, res){
    try{
        const managerJobData = req.body;
        console.log(req)
        const result = await Manager.postJob(managerJobData, req.user.manager_id)
        if(result.status == 200){
            return res.status(200).send(result.msg)
        }
        else{
            return res.status(result.status).send(result.msg)
        }
    }
    catch(err){
        console.log(err)
    }
}

export async function fetchCandidates(req, res){
    try{
        const managerId = req.body;
        console.log(managerId)
        const result = await Manager.getCandidateInfo(managerId)
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

export async function fetchCandidatesInterview(req, res){
    try{
        const managerId = req.body;
        console.log(managerId)
        const result = await Manager.getCandidateInfoForInterview(managerId)
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


export async function updateApplicationStatus(req, res){
    try{
        const CandidateStatus = req.body;
        const result = await Manager.update(CandidateStatus)
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

export async function assignInterview(req, res){
    try{
        const InterviewData = req.body;
        const result = await Manager.interview(InterviewData)
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

export async function updateInterviewStatus(req, res){
    try{
        const InterviewData = req.body;
        const result = await Manager.updateInterview(InterviewData)
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


export async function GetCandidate(req, res){
    try{
        const data = req.body;
        const result = await Manager.Candidate(data)
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