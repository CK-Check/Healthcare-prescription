import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true 
    },
    dateOfBirth: {
        type: Date
    },
    phoneNumber: {
        type: Number, 
        required: true 
    },
    licenseNumber: {
        type: String
    },
    specialization: {
        type: String
    },
    address: {
        type: String
    },
    role: {
        type: String, 
        enum: ["doctor", "patient"]
    },
},
    {
        timestamps: true,
    }
);

// Check if the model already exists before creating it
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;