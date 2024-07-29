import { User } from "../entities";
import { Like } from "typeorm";
import bcrypt from "bcrypt";

export const s_create_user = async (
  firstName: string,
  lastName: string,
  email: string,
  birthDate: Date,
  gender: string,
  password: string
) => {
  const existingUser = await User.findOneBy({ email });
  if (existingUser) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = User.create({
    firstName,
    lastName,
    email,
    birthDate,
    gender,
    password: hashedPassword,
  });

  await newUser.save();
  return newUser;
};

export const s_all_users = async (
  page: number,
  perPage: number,
  name: string
) => {
  const where = name
    ? [{ firstName: Like(`%${name}%`) }, { lastName: Like(`%${name}%`) }]
    : undefined;

  const [users, total] = await User.findAndCount({
    where,
    skip: (page - 1) * perPage,
    take: perPage,
    select: ["id", "firstName", "lastName", "email", "birthDate", "gender"],
  });

  return {
    users,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
};

export const s_get_user_by_id = async (id: number) => {
  const user = await User.findOneBy({ id });
  return user;
};

export const s_delete_user_by_id = async (id: number) => {
  const result = await User.delete({ id });
  return result.affected;
};

export const s_update_user_by_id = async (
  id: number,
  userData: Partial<User>
) => {
  const user = await User.findOneBy({ id });

  if (!user) {
    throw new Error("User not found");
  }

  user.firstName = userData.firstName ?? user.firstName;
  user.lastName = userData.lastName ?? user.lastName;
  user.email = userData.email ?? user.email;
  user.birthDate = userData.birthDate ?? user.birthDate;
  user.gender = userData.gender ?? user.gender;
  user.password = userData.password ?? user.password;

  if (userData.password) {
    user.password = await bcrypt.hash(userData.password, 10);
  }

  await User.save(user);

  const { password, ...updatedUserWithoutPassword } = user;

  return updatedUserWithoutPassword;
};
