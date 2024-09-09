//model file 
import { poolPromise } from "../utils/dbConnection.js";
import config from "../../../../config.js";
import pkg from 'jsonwebtoken';
import { StatusCodes } from "http-status-codes";
const { sign } = pkg;

class Test {

    static async create(data) {
        const pool = await poolPromise;
        if(data.role === "Manager")
        {
            try 
            {
                const sql = `INSERT INTO ${config.M_TABLENAME} (first_name, last_name, email, password) VALUES (?, ?, ?, ?)`;
                const result = await pool.query(sql, [data.first_name, data.last_name, data.email, data.password]);
                console.log(result)
                return { status: StatusCodes.OK, msg: "Successfully  Manager Registered" };
            } 
            catch (err) 
            {
                console.error(err)
                return { status: StatusCodes.CONFLICT, msg: "Duplicate entry found" };
            }
        }
        else if(data.role === "Candidate")
        {
            try 
            {
                const sql = `INSERT INTO ${config.TABLENAME2} (first_name, last_name, email, password) VALUES (?, ?, ?, ?)`;
                const result = await pool.query(sql, [data.first_name, data.last_name, data.email, data.password]);
                return { status: StatusCodes.OK, msg: "Successfully Candidate Registered" };     
            } 
            catch (err) 
            {
                console.error(err)
                return { status: StatusCodes.CONFLICT, msg: "Duplicate entry found" };
            }
        }
        else
        {
            return { status: StatusCodes.FORBIDDEN, msg: "Choose the Role!" };
        }
    }

    static async login(data) 
    {
        const pool = await poolPromise
        if(data.role === "Manager")
        {
            try 
            {
                const sql = `Select manager_id, first_name, last_name, email from ${config.M_TABLENAME} where email  = ? and password = ?`;
                const [result] = await pool.query(sql, [data.email, data.password]);
                if(result[0].manager_id)
                {
                    const token = sign({ manager_id: result[0].manager_id }, config.SECRET_KEY , { expiresIn: "1h" });
                    if (!token) 
                    {
                        throw { status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Failed to generate token" };
                    }
                    console.log(token);
                    return { status: StatusCodes.OK, msg: {managerId: result[0].manager_id, firstName: result[0].first_name, email: result[0].email, lastName: result[0].last_name, token}};
                }
                else
                {
                    return { status: StatusCodes.FORBIDDEN, msg: "Invalid Credentials." }
                }  
            }
            catch (err) 
            {
                console.log(err)
                return { status: StatusCodes.FORBIDDEN, msg: "Invalid Credentials, check your email and password once." };
            }
        }

        else if(data.role === "Candidate")
        {
            try 
            {
                const sql = `Select candidate_id, first_name, last_name, email from ${config.TABLENAME2} where email  = ? and password = ?`;
                const [result] = await pool.query(sql, [data.email, data.password]);
                if(result[0].candidate_id)
                {
                    const token = sign({ candidate_id: result[0].candidate_id }, config.SECRET_KEY, { expiresIn: "1h" });
                    if (!token) 
                    {
                        throw { status: StatusCodes.INTERNAL_SERVER_ERROR, message: "Failed to generate token" };
                    }
                    return { status: StatusCodes.OK, msg: {candidateId: result[0].candidate_id, firstName: result[0].first_name, email: result[0].email, lastName: result[0].last_name, token}};
                }
                else
                {
                    console.log(err)
                    return { status: StatusCodes.FORBIDDEN, msg: "Invalid Credentials." }
                }
                
            } 
            catch (err) 
            {
                console.error(err)
                return { status: StatusCodes.FORBIDDEN, msg: "Invalid Credentials, check your email and password once." };
            }
        }
        else
        {
            return {status: StatusCodes.CONFLICT, msg:"Invalid info"}
        }
    } 



}

export default Test;
