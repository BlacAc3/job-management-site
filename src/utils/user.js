import jwt from "jsonwebtoken"
import User from "../models/user.js"

const getUserFromToken = async (token) =>{

    try{ 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id
        const user = await User.findById(userId);
        return user || null;
        
    } catch (error){
        console.error('Error getting user from token:', error);
        return null;
    }
};


export default getUserFromToken;
