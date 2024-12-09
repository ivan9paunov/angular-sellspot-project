import { UserData } from "./user";

export type Game = {
    _ownerId: string;
    title: string;
    imageUrl: string;
    platform: string;
    price: string;
    condition: string;
    genres: string;
    description: string;
    user: UserData;
    _createdOn: number;
    _id: string;
};