import { StatusCodes } from "http-status-codes";
import { poolPromise } from "../utils/dbConnection.js";
import config from "../../../../config.js";

class Dashboard {
  
    static async jobs(id) {
        try {
            const pool = await poolPromise;
            
            const query = `
                SELECT  j.job_id, j.title, j.description, j.salary, j.location, j.job_type, j.application_deadline, a.status
                FROM ${config.TABLENAME3} j 
                JOIN ${config.TABLENAME4} a 
                ON j.job_id = a.job_id 
                AND a.candidate_id = ?`;

            const [result] = await pool.query(query, [id]);

            return { status: StatusCodes.OK, msg: result };
        } catch (err) {
            console.error("Error executing query:", err);
            throw err;
        }
    }

}

export default Dashboard;
