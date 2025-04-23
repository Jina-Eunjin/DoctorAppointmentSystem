import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"))
        await mongoose.connect(`${process.env.MONGODB_URI}/booking-system`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // serverSelectionTimeoutMS: 30000,  // 타임아웃 시간 증가 (30초)
            // socketTimeoutMS: 30000,           // 소켓 타임아웃 시간 증가 (30초)
        });

        console.log("Database Connected");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1); // 연결 실패 시 프로세스 종료
    }
}

export default connectDB