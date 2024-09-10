//model file 
import { CONFLICT, StatusCodes } from "http-status-codes";
import { poolPromise } from "../utils/dbConnection.js";
import config from "../../../../config.js";

import pkg from 'jsonwebtoken';

const { sign } = pkg;

class Candidate {
    // static async create(data) 
    // {
    //     const pool = await poolPromise;
    //     try 
    //     {
    //         const sql = `INSERT INTO ${config.TABLENAME2} (first_name, last_name, email, resume_url, password) VALUES (?, ?, ?, ?, ?)`;
    //         const result = await pool.query(sql, [data.first_name, data.last_name, data.email, data.resume_url, data.password]);
    //     } 
    //     catch (err) 
    //     {
    //         console.error(err)
    //         return { status: StatusCodes.CONFLICT, msg: "Duplicate entry found" };
    //     }
    //     return { status: StatusCodes.OK, msg: "Successfully Candidate Registered" };
    // }

    static async jobs() {
        try {
            const pool = await poolPromise;
            const [result] = await pool.query(`SELECT job_id, title, salary, location, job_type, experience_level, skills, status from ${config.TABLENAME3}`);
            // console.log(txt);
            return { status: StatusCodes.OK, msg : result};
        } catch (err) {
            throw err;
        }
    }

    static async applyForJob(data) 
    {
        const pool = await poolPromise;
        try 
        {
            // const candidate_id = pkg.verify(token, 'superSecret')
            // console.log(candidate_id)
            const sql = `INSERT INTO ${config.TABLENAME4} (candidate_id, job_id, resume_url, application_date) VALUES (?, ?, ?, ?)`;
            const result = await pool.query(sql, [data.candidate_id, data.job_id, data.resume_url, new Date()]);
        } 
        catch (err) 
        {
            console.log(err)
            return { status: StatusCodes.CONFLICT, msg: "Duplicate entry found" };
        }
        return { status: StatusCodes.OK, msg: "Successfully Candidate Applied for JOb." };
    }

    static async jobStatus(data) 
    {
        console.log(data)
        const pool = await poolPromise;
        try 
        {
            const sql = `SELECT status from ${config.TABLENAME4} where candidate_id = ? and job_id = ?`;
            const [result] = await pool.query(sql, [data.candidate_id, data.job_id]);
            console.log(result)
            console.log(result[0].status);
            if(result[0].status == "Pending")
            {
                return { status : StatusCodes.OK, msg : `Pending`}
            }
            else if(result[0].status == "Interview" || result[0].status == "In-Progress" || result[0].status == "Selected")
            {
                return { status : StatusCodes.OK, msg : result[0].status}
            }
            else
            {
                console.log('Application is Rejected!')
                return { status : StatusCodes.OK, msg: `Rejected` }
            }
        } 
        catch (err) 
        {
            console.log(err)
            return { status: StatusCodes.NOT_FOUND, msg: "Status Not Found" };
        }
    }

    static async interviewStatusCheck(data) 
    {
        const pool = await poolPromise;
        try 
        {
            const sql = `SELECT interview_date, Duration, interview_result from ${config.TABLENAME5} where candidate_id = ? and job_id = ?`;
            const [result] = await pool.query(sql, [data.candidate_id, data.job_id]);
            console.log(result[0])
            if(result[0].interview_result === "Pending")
            {
                return { status : StatusCodes.OK, msg : result[0] }
            }
            else if(result[0].interview_result === "Selected")
            {
                return { status : StatusCodes.OK, msg : result[0]}
            }
            else
            {
                return { Status : StatusCodes.OK, msg: "Not Assigned with Interview Date" }
            }
        } 
        catch (err)     
        {
            console.error(err)
            return { status: StatusCodes.CONFLICT, msg: "Candidate is not yet assigned with the result!" };
        }
    }
}

export default Candidate;
