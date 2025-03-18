
import express, { Request, Response } from "express";
const router = express.Router();
router.post('/signup', async (req:Request, res:Response) => {
    const e = await import("../middleware/student").then((ret)=> {ret.userCreate(req ,res)})
})
router.post('/login', async (req:Request, res:Response) => {
    const e = await import("../middleware/student").then((ret) => {ret.userFind(req ,res)})
})
router.post('/Forgot-password', async (req:Request, res:Response) => {
    const e = await import("../middleware/student").then((ret) => {ret.forgotPassword(req, res)})
})
router.put('/reset_password/:id/:token', async (req:Request, res:Response) => {
    const e = await import("../middleware/student").then((ret) => {ret.resetPassword(req, res)})
})
router.post('/userTopics', async (req:Request, res:Response) => {
    const e = await import("../middleware/student").then((ret) => {ret.userTopics(req, res)})
})
router.post('/Titles', async (req:Request, res:Response) => {
    const e = await import("../middleware/student").then((ret) => {ret.userTitles(req, res)})
})
router.post('/modelCreate', async (req:Request, res:Response) => {
    const e = await import("../middleware/student").then((ret) =>{ret.modelCreate(req, res)})
})
router.post('/getUserData', async (req:Request, res:Response) => {
    const e = await import("../middleware/student").then((ret) => {ret.userGetData(req, res)})
})
export {router}