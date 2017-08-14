export class User {
    constructor(public email: string,
                public password: string,
                public firstName?: string,
                public lastName?: string,
        // should these 2 be grouped? they're practically the same and mutually exclusive anyway
                public facebookID?: string,
                public facebookToken?: string,
                public googleID?: string,
                public googleToken?: string) {}
}
