const MongoLib = require('./../lib/mongo');
const bcrypt = require('bcrypt');

class UsersServices {
    constructor() {
        this.collection = 'users';
        this.mongoDB = new MongoLib();
    }

    async getUser({ email }) {
        const [ user ] = await this.mongoDB.getAll(this.collection, { email });
        return user;
    }

    async createUser({ user }) {
        const { name, email, password } = user;

        const hashedPassword = await bcrypt.hash(password, 10);

        let _getUser = await this.getUser({ email });

        console.log(_getUser);

        if(_getUser) {
            return false;
        }

        const createdUserId = await this.mongoDB.create(this.collection, {
            name,
            email,
            password: hashedPassword.toString()
        });

        return createdUserId;
    }
}

module.exports = UsersServices;