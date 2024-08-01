import bcrypt from 'bcryptjs';
import { logger } from '../helpers/logger';
import UserSchema from '../MongoModels/userModel';

export async function updateUser(_id: string, userDetails: any): Promise<any> {
    if (userDetails.currentPassword) {
        try {
            const user = await UserSchema.findOne({ _id });
            if (!user) {
                throw new Error("This user does not exist");
            }

            const isMatch = await bcrypt.compare(userDetails.currentPassword, user.password);
            if (!isMatch) {
                throw new Error("Incorrect Password");
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userDetails.password, salt);
            userDetails.password = hashedPassword;

            const updatedUser = await user.update({ $set: { ...userDetails } }).lean().select("-password");
            return updatedUser;
        } catch (err: any) {
            logger.error(`Failed to update user with password: ${err.message}`);
            throw err;
        }
    } else {
        try {
            const updatedUser = await UserSchema.findOneAndUpdate(
                { _id },
                { $set: { ...userDetails } },
                { new: true }
            ).lean().select("-password");

            return updatedUser;
        } catch (err: any) {
            logger.error(`Failed to update user: ${err.message}`);
            throw err;
        }
    }
}

export async function deleteUser(email: string): Promise<boolean> {
    try {
        await UserSchema.deleteOne({ email });
        return true;
    } catch (err: any) {
        logger.error(`Failed to delete user: ${err.message}`);
        throw err;
    }
}
