import mongoose from "mongoose";

const connectionRequest = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    connectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status_accepted: {
        type: Boolean,
        default: null,
    }
});

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequest);

// export const getConnectionRequest = async (userId) => {
//     try {
//         const connectionRequest = await ConnectionRequest.find({
//             userId,
//             status_accepted: false
//         }).populate("connectionId");
//         return connectionRequest;
//     } catch (error) {
//         throw error;
//     }
// }


export default ConnectionRequest;