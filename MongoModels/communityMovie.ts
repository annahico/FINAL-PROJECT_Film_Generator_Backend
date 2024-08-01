import mongoose, { Document, Schema } from 'mongoose';

// Define el esquema para CommunityMovie
const CommunityMovieSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // Agregar más campos según sea necesario
});

// Define y exporta el modelo
const CommunityMovie = mongoose.model<CommunityMovieDoc>('CommunityMovie', CommunityMovieSchema);

export default CommunityMovie;

// Define la interfaz del documento de Mongoose para CommunityMovie
export interface CommunityMovieDoc extends Document {
    title: string;
    description?: string;
    createdBy: mongoose.Schema.Types.ObjectId;
    // Agregar más campos según sea necesario
}
