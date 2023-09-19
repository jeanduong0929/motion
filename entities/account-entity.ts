import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  providerId: {
    type: String,
    required: true,
    unique: true,
  },
  providerType: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const AccountEntity =
  mongoose.models.Account || mongoose.model("Account", accountSchema);
export default AccountEntity;
