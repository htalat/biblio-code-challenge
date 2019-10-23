const chai = require('chai');
const mongoose = require('mongoose');
const expect = chai.expect;

const testConfig = require('../../config/environment/test');
const UserModel = require('../../models/User');

const userData = {
    name: 'Hassan Talat', 
    email: 'htalat@lums.edu.pk', 
    password: 'haha123', 
    role: 'student' 
};

after(async ()=>{
    await mongoose.connection.db.dropDatabase();
})

describe('User Model Test', () => {

    beforeEach(async () =>{

        await mongoose.connection.db.dropDatabase();

        await mongoose.connect(testConfig.MONGO_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });

    });

    it('should save user successfully', async () => {
        const validUser = new UserModel(userData);
        const savedUser = await validUser.save();

        expect(savedUser._id).to.have.property('_id');
        expect(savedUser.name).to.equal(userData.name);
        expect(savedUser.email).to.equal(userData.email);
        expect(savedUser.role).to.equal(userData.role);
        expect(savedUser.institute).to.equal(undefined);
        expect(savedUser.password).to.not.equal(userData.password);
        expect(savedUser).to.have.property('salt');

        return true;
    });

    it('should not save duplicate email user', async () => {
        const validUser = new UserModel(userData);
        await validUser.save();

        const invalidUser = new UserModel(userData);
        let err;
        try {
            await invalidUser.save();
        } catch (error) {
            err = error;
        }

        expect(err).to.be.instanceOf(mongoose.Error.ValidationError);
        return true; 
    });
    
})

