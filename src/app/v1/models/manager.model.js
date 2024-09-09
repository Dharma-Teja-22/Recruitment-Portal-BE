//model file 
import { CONFLICT, StatusCodes } from "http-status-codes";
import { poolPromise } from "../utils/dbConnection.js";
import config from "../../../../config.js";

class Manager {
    // static async create(data) {
    //     const pool = await poolPromise;
    //     try 
    //     {
    //         const sql = `INSERT INTO ${config.M_TABLENAME} (first_name, last_name, email, password) VALUES (?, ?, ?, ?)`;
    //         const result = await pool.query(sql, [data.first_name, data.last_name, data.email, data.password]);
    //         console.log(result)
    //     } 
    //     catch (err) 
    //     {
    //         console.error(err)
    //         return { status: StatusCodes.CONFLICT, msg: "Duplicate entry found" };
    //     }
    //     return { status: StatusCodes.OK, msg: "Successfully  Manager Registered" };
    // }

    static async postJob(data, manager_id) {
        const pool = await poolPromise;
        try 
        {
            console.log(new Date(data.application_deadline));
            // console.log(new Date());
            if((new Date(data.application_deadline) >  new Date()))
            {
                const sql = `INSERT INTO ${config.TABLENAME3} (title, description, salary, location, job_type, experience_level, skills, application_deadline, status, manager_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const result = await pool.query(sql, [data.title, data.description , data.salary, data.location, data.job_type, data.experience_level, data.skills, new Date(data.application_deadline), data.status, manager_id]);
                return { status: StatusCodes.OK, msg: "Successfully Job Posted" };
            }
            else
            {
                console.log("Check date once It's in past!")
                return { status: StatusCodes.ACCEPTED, msg: "Date is in the past!" };
            }
        } 
        catch (err) 
        {
            console.log(err)
            return { status: StatusCodes.CONFLICT, msg: "Duplicate entry found" };
        }
    }

    static async getCandidateInfo(data) 
    {
        const pool = await poolPromise;
        try 
        {
            console.log(data,";ljnj,nm")
            // const sql = `SELECT * FROM ${config.TABLENAME2} WHERE candidate_id IN (SELECT a.candidate_id FROM ${config.TABLENAME4} a JOIN ${config.TABLENAME3} j ON a.job_id = j.job_id WHERE j.manager_id = ?);`;
            const sql = `
                    SELECT c.*, a.job_id, j.title, a.status
                    FROM ${config.TABLENAME2} c 
                    JOIN ${config.TABLENAME4} a ON c.candidate_id = a.candidate_id 
                    JOIN ${config.TABLENAME3} j ON a.job_id = j.job_id 
                    WHERE j.manager_id = ?`

            const [result] = await pool.query(sql, [data.manager_id]);
            console.log(result)
            if(result.length != null)
            {
                console.log(result)
                return { status: StatusCodes.OK, msg: result };
            }
            else
            {
                return { status: StatusCodes.NOT_FOUND, msg: "Candidate details not found for the given manager_id." }
            }
        } 
        catch (err) 
        {
            return { status: StatusCodes.CONFLICT, msg: "Invalid Credentials, check your email and password once." };
        }
    }


    static async getCandidateInfoForInterview(data) 
    {
        const pool = await poolPromise;
        try 
        {
            console.log(data)
            const sql = `
                    SELECT c.*, a.job_id, j.title, a.status, i.interview_date, i.interview_result
                    FROM ${config.TABLENAME2} c 
                    JOIN ${config.TABLENAME4} a ON c.candidate_id = a.candidate_id 
                    JOIN ${config.TABLENAME3} j ON a.job_id = j.job_id 
                    Join ${config.TABLENAME5} i ON  i.job_id = j.job_id AND i.candidate_id = c.candidate_id
                    WHERE j.manager_id = ?`

            const [result] = await pool.query(sql, [data]);
            console.log(result)
            if(result.length != null)
            {
                console.log(result)
                return { status: StatusCodes.OK, msg: result };
            }
            else
            {
                return { status: StatusCodes.NOT_FOUND, msg: "Candidate details not found for the given manager_id." }
            }
        } 
        catch (err) 
        {
            return { status: StatusCodes.CONFLICT, msg: "Invalid Credentials, check your email and password once." };
        }
    }


    static async update(data) {
        const pool = await poolPromise;
        try 
        {
            const [deadline] = await pool.query(`Select application_deadline from ${config.TABLENAME3} where job_id = ? and manager_id = ?`, [data.job_id, data.manager_id])
            console.log(deadline[0]);
                       
            if((new Date(deadline[0].application_deadline) <  new Date()))
            {
                const [status] = await pool.query(`Select a.status, a.application_id from ${config.TABLENAME4} a join ${config.TABLENAME3} j on a.job_id = ? WHERE j.manager_id = ? and a.candidate_id = ?`, [data.job_id, data.manager_id, data.candidate_id])
                console.log(status)
                if(status[0].status === "Pending")
                {
                    console.log(status)
                    const sql = `update ${config.TABLENAME4} SET status = ? where  application_id = ${status[0].application_id} and job_id = ?`;
                    const result = await pool.query(sql, [data.status, data.job_id]);
                    if(result!=null)
                        return { status: StatusCodes.OK, msg: `Successfully  Updated  the 'Pending' state to '${data.status}' state` };
                    else    
                        return { status: StatusCodes.ACCEPTED, msg : "Update is Unsuccessfull."}
                }
                else if(status[0].status === "Interview")
                {
                    console.log("Status is alread in Interview state");
                    return { status: StatusCodes.OK, msg: "Status already is in Interview State" };
                }
                else
                {
                    console.log("Rejected!")
                    return { status: StatusCodes.OK, msg: "Status already Rejected" };
                }
            }
            else
            {
                console.log("Still posts are not closed!")
                return { status: StatusCodes.OK, msg: "Still posts are not closed!" };
            }
        } 
        catch (err) 
        {
            console.error(err)
            return { status: StatusCodes.CONFLICT, msg: "Error while Updating the data." };
        }
    }

    static async interview(data) {
        const pool = await poolPromise;
        try 
        {
            const [Id] = await pool.query(`Select application_id, status from ${config.TABLENAME4} where job_id = ? and candidate_id = ?`, [data.job_id, data.candidate_id])
            console.log(Id[0])
            console.log(Id[0])
            // Id.filter(app => app.status === 'Interview');
            if(Id.filter(app => app.status === 'Interview'))
            {
                const sql = `INSERT INTO ${config.TABLENAME5} (application_id, job_id, candidate_id, interview_date) VALUES ( ?, ?, ?, ?)`;
                const result = await pool.query(sql, [Id[0].application_id, data.job_id, data.candidate_id, new Date(data.interview_date)]);
                if(result!=null)
                    return { status: StatusCodes.OK, msg: "Successfully The cadidate is assigned with a interview date and time" };
                else    
                    return { status: StatusCodes.ACCEPTED, msg : "Assigning interview is Unsuccessfull."}
            }
            else
            {
                console.log("Cannot Assign the interview date and time for the candidate.")
                return { status: StatusCodes.CONFLICT, msg : "Assigning interview to the candidate is Unsuccessfull. Reason: he is not selected for the 'Interview'"}
            }
        } 
        catch (err) 
        {
            return { status: StatusCodes.CONFLICT, msg: "Duplicate entry found" };
        }
    }


    static async updateInterview(data) {
        const pool = await poolPromise;
        try 
        {
            const [res] = await pool.query(`Select interview_date, interview_result from ${config.TABLENAME5} where job_id = ? and candidate_id = ?`, [data.job_id, data.candidate_id])
            if(res[0].interview_result === "Pending")
            {
                if(new Date(res[0].interview_date) < new Date())
                {
                    const sql = `Update ${config.TABLENAME5} set interview_result = ? where job_id = ? and candidate_id = ?`
                    const result = await pool.query(sql, [data.interview_result, data.job_id, data.candidate_id])
                    if(result!=null)
                        return { status: StatusCodes.OK, msg: `Successfully  Updated 'Pending' to '${data.interview_result}'` };
                }
                else
                {
                    return { status: StatusCodes.ACCEPTED, msg : "Unsuccessfull. Due to the Interview Date is in past."}
                }
            }
            else if(res[0].interview_result === "Selected")
            {
                return { status: StatusCodes.ACCEPTED, msg : "Already Selected"}
                    // "Cannot update the interview status for the candidate. Reason: Already the date is updated with the 'Selected' interview result."}

            }
            else 
            {
                console.log("Cannot update the interview status for the candidate.")
                return { status: StatusCodes.ACCEPTED, msg : "Already candidate is rejected"}
                    // "Cannot update the interview status for the candidate. Reason: Already the date is updated with the 'Rejected' interview result."}
            }
        } 
        catch (err) 
        {
            return { status: StatusCodes.FORBIDDEN, msg: `${err}` };
        }
    }

    static async Candidate(data) 
    {
        const pool = await poolPromise;
        try 
        {
            console.log(data)
            const sql = `Select c.first_name, c.last_name, c.email, a.resume_url, a.status from ${config.TABLENAME2}  c join ${config.TABLENAME4} a on c.candidate_id = ? and a.job_id = ?`
            const result = await pool.query(sql, [data.candidate_id, data.job_id]);
            if(result.length != null)
            {
                console.log(result[0][0])
                return { status: StatusCodes.OK, msg: result[0][0] };
            }
            else
            {
                return { status: StatusCodes.NOT_FOUND, msg: "Candidate details not found" }
            }
        } 
        catch (err) 
        {
            return { status: StatusCodes.CONFLICT, msg: err };
        }
    }

    
}

export default Manager;