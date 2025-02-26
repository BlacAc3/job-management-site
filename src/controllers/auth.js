import User from "../models/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;


        //Perform validation
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        //Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        //Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        //save new User
        const user = new User({ firstName, lastName, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }, 
            token: token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const loginUser = async (req, res) => {
    try{
        const {email, password }= req.body;
        //Request body validation
        if ( !email || !password ) {
            return res.status(400).json({message: 'All fields are required'});
        }

        //Get user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        //Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({message: 'Invalid Password'});
        
        res.status(200).json({
            token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' }),
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
        

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export { registerUser, loginUser}
