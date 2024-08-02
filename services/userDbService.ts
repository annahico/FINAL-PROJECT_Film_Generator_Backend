import bcrypt from 'bcryptjs';
import { logger } from '../helpers/logger';
import UserSchema from '../MongoModels/userModel';

// Define una interfaz para los detalles del usuario
interface UserDetails {
    currentPassword?: string;
    password?: string;
    name?: string;
    userName?: string;
    email?: string;
    // Añade otros campos según sea necesario
}

export async function updateUser(_id: string, userDetails: UserDetails): Promise<any> {
    try {
        if (userDetails.currentPassword) {
            // Manejo del caso de actualización de la contraseña
            const user = await UserSchema.findOne({ _id });
            if (!user) {
                throw new Error("This user does not exist");
            }

            const isMatch = await bcrypt.compare(userDetails.currentPassword, user.password);
            if (!isMatch) {
                throw new Error("Incorrect Password");
            }

            // Hashear la nueva contraseña si se proporciona
            if (userDetails.password) {
                const salt = await bcrypt.genSalt(10);
                userDetails.password = await bcrypt.hash(userDetails.password, salt);
            }

            // Actualizar el usuario en la base de datos
            const updatedUser = await UserSchema.findByIdAndUpdate(
                _id,
                { $set: userDetails },
                { new: true, fields: { password: 0 } }  // Excluye el campo de la contraseña
            ).lean();
            
            return updatedUser;
        } else {
            // Manejo del caso de actualización sin cambio de contraseña
            const updatedUser = await UserSchema.findByIdAndUpdate(
                _id,
                { $set: userDetails },
                { new: true, fields: { password: 0 } }  // Excluye el campo de la contraseña
            ).lean();
            
            return updatedUser;
        }
    } catch (err: any) {
        logger.error(`Failed to update user: ${err.message}`);
        throw err;
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
