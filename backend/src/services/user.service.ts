import { User } from '../models/user.model';

let exampleUser: User = {
    id: 1,
    name: "John Doe",
    email: "rasealca@gmail.com",
}

let users: User[] = [exampleUser, exampleUser, exampleUser];

export const getAllUsers = (): User[] => {
    return users;
};

export const createUser = (user: User): User => {
    users.push(user);
    return user;
};
