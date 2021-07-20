const MongoLib = require('./../lib/mongo');
const bcrypt = require('bcrypt');

class UsersServices {
    constructor() {
        this.collection = 'users';
        this.mongoDB = new MongoLib();
    }

    async getUser(email) {
        const user = await this.mongoDB.getAll(this.collection, { email });
        return user || {};
    }

    async getUserById(userId) {
        const user = await this.mongoDB.getByParam(this.collection, '_id', userId);
        return user || {};
    }

    async getUserToken(userId) {
        const userToken = await this.mongoDB.getByParam("user_token", "userId", userId);
        return userToken || {};
    }

    async createUser({ user }) {
        const { name, email, password } = user;

        const hashedPassword = await bcrypt.hash(password, 10);

        let _getUser = await this.getUser({ email });

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

    async resetUserPassword(userId, password) {
        const updatedUserId = await this.mongoDB.update(this.collection, userId, { password });
        return updatedUserId;
    }

    async createUserToken(userId, token) {
        const createdUserTokenId = await this.mongoDB.create("user_token", {
            userId,
            token
        })

        return createdUserTokenId;
    }
}

module.exports = UsersServices;