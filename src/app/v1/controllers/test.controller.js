import logger from "../../../../logger.js";
import config from "../../../../config.js";
import pkg from 'jsonwebtoken';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import Test from "../models/test.model.js";
import ManagerTest from "../models/manager.model.js"
// import { log } from "winston";
const { sign } = pkg;

export function test(req, res) {
    try {
        Test.create()
        logger.info("inside test");
        const token = sign({ payload: "payload" }, 'superSecret', {
            expiresIn: "1d" // expires in 24 hours
        });
        if (!token) {
            throw { status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Failed to generate token" };
        }
        var time = new Date();
        res.status(StatusCodes.OK).send({ time: time, message: config.API_KEY, token: token });
    } catch (error) {
        console.error("An error occurred in test function:", error);
        if (error.status) {
            res.status(error.status).send(error.message);
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("An error occurred");
        }
    }
}

export function pingTest(req, res) {
    try {
        var time = new Date();
        res.status(StatusCodes.OK).send(time);
    } catch (error) {
        console.error("An error occurred in pingTest function:", error);
        if (error.status) {
            res.status(error.status).send(error.message);
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("An error occurred");
        }
    }
}



// export async function loginForManager(req, res){
//     try{
//         const managerData = req.body;
//         const result = await Manager.login(managerData)
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

export async function registration(req, res){
    try{
        const managerData = req.body;
        const result = await Test.create(managerData)
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


export async function loginForManagerCandidates(req, res){
    try{
        const managerData = req.body;
        const result = await Test.login(managerData)
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


export function disp(req, res){
    ManagerTest.read();
}