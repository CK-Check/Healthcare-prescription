import mongoose from 'mongoose';

const connectDB = async () => {
    const connectionState = mongoose.connection.readyState;

    if (connectionState === 1) {
        console.log('MongoDB is already connected');
        return;
    }

    if (connectionState === 2) {
        console.log('MongoDB is connecting...');
        return;
    }

    try {
        mongoose.connect(process.env.MONGODB_URI!, {
            dbName: 'monitoring',
            bufferCommands: true
        });
        console.log('MongoDB connected successfully');
    } catch (error: any) {
        console.error(`Error: ${error}`);
        throw new Error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;