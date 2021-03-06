const UserModel = require("../models/user-model");
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require("./mail-service");
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error')

class UserService {
    async registration(name, email, password) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest(`User with such email ${email} already exists`)
        }
        const hashPassword = await bcrypt.hash(password, 3); 
        const activationLink = uuid.v4(); //creats hash password

        const user = await UserModel.create({name, email, password: hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('Activation Link is not correct')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password){
        const user = await UserModel.findOne({email})
        if (!user) {
            throw ApiError.BadRequest('User with such email is not found')
        }
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            throw ApiError.BadRequest('Incorrect password');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken){
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async getAllUsers(){
        const users = await UserModel.find();
        return users;
    }
    

    async getFriends(id){
        let newFriend=[]
        console.log(id,'AGAAG')
        const user = await UserModel.findOne({  _id: id})
        for (let i in user.friends) {
            console.log(newFriend,"dsdsddsdvxzxx")
            newFriend.push(await UserModel.findOne({  _id: user.friends[i]}))

            console.log(newFriend)

            // console.log(UserModel.findOne({  _id: newFriend}))
            // .findOne({  _id:user.friends[i]})
            // let newFriends=[];
            // newFriends=newFriends+[user.friends[i]]
            // console.log(newFriends,"ddsdsdcsccc")
          }
          
        return newFriend;
    }
    async getStatus(newstatus,id){
        const user = (await UserModel.findOne({  _id: id}))
        user.status=newstatus
       
        // UserModel.findOne({  _id: id})=user
        // console.log(user.status,"kkkkk")
        
        await user.save();
          
        return user;
    }


}

module.exports = new UserService();
