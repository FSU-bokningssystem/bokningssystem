import type { CreateUserProfileDTO } from "../types/types";
import { postToApi } from "./postData";

export const createUserProfile = async (userData: CreateUserProfileDTO) => {
  // Anropar POST http://localhost:8080/api/users/register
  return await postToApi("api/users/register", userData);
};