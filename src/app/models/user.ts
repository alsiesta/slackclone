export interface User {
    uid: string; // firebase authentication auto-generated id
    email: string;
    displayName: string;
    status: boolean;
    photoURL: string;
 }