import "next-auth";
import { Interface } from "readline";

declare module 'next-auth'{
    interface User {
        _id? : string,
        name? : string
    }
    interface Session {
        user: {
            id? : string,
            email? : string,
            name? : string
        }
    }
    interface jwt {
        id? : string,
        name? : string
    }
}