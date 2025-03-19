import { PrismaClient } from "@prisma/client";
import express, {Request, Response} from 'express';
import nodemailer from 'nodemailer';
import moment from "moment";
const prisma = new PrismaClient();
const { createHash } = require('crypto');
const jwt = require('jsonwebtoken');
async function hashPassword(userPassword: string): Promise<string> {
   return createHash('md5').update(userPassword).digest('hex');
 }
export const userCreate = async (req: Request, res: Response) => {
   try {
      const userName: string = req.body.name;
      const userEmail: string = req.body.email;
      const userPassword: string = req.body.password;
      const existingUser = await prisma.users.findUnique({
         where: {
            email: userEmail,
         },
      });
      if (existingUser) {
         return res.status(400).json({ message: 'Email already in use' });
      }
      const hashedPassword = await hashPassword(userPassword);
      const create = await prisma.users.create({
         data: {
            username: userName,
            email: userEmail,
            password: hashedPassword,
         },
      });
      if (create) {
         res.status(201).json({ message: "User signup successfully" });
      }
   } catch (err) {
      console.error('Error creating user:', err);
      res.status(400).json({ error: 'Failed to create user' });
   }
};
export const userFind = async (req:Request, res: Response) => {
   try {
      const userEmail:string = req.body.email;
      const userPassword:string = req.body.password;
      const hashedPassword = await hashPassword(userPassword);
      const findUser = await prisma.users.findUnique({
         where: {
            email: userEmail,
            password: hashedPassword,
         },
         select: {
            id: true,
            username: true,
            email: true,
         }
      })
      if (findUser) {
         return res.status(201).json({ message: "User login successfully", userId: findUser?.id});
      }
      else if(!findUser) {
         return res.status(401).json({ message: "user is unauthorized"})
      }
   } catch (err) {
      console.error('Error finding user:', err);
      res.status(400).json({ error: 'Failed to find user' });
   }
}
export const forgotPassword = async (req:Request, res: Response) => {
   try {
      const email:string = req.body.email;
      const user = await prisma.users.findUnique({
         where:{
            email: email
         }
      })
      if (!user) {
         return res.status(400).json({ error: 'User not found' });
      }
      const token = jwt.sign({id: user.id}, "jwt_secret_key", {expiresIn: "1d"})
      var transporter = nodemailer.createTransport({
         service: 'gmail',
         host: 'smtp.gmail.com',
         auth: {
           user: 'imranexpo864@gmail.com',
           pass: 'imje mevz jjbf qwrg'
         },

       });
       var mailOptions = {
         to: `${email}`,
         subject: 'Reset Password Link',
         text: `http://localhost:3000/reset_password/${user.id}/${token}`
       };
       transporter.sendMail(mailOptions, function(error, info){
         if (error) {
           console.log(error);
         } else {
           return res.send({Status: "Success"})
         }
       });
   }catch (err) {
      console.error('Error forgot password:', err);
      res.status(400).json({ error: 'Failed to forgot password' });
   }
}
export const resetPassword = async (req:Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const token = String(req.params.token);
    const password: string = req.body.password;

    jwt.verify(token, "jwt_secret_key", async (err:any) => {
      if (err) {
         return res.status(400).json({error: 'Invalid token'})
      } else {
         const hashedPassword = await hashPassword(password);
         const updatePassword = await prisma.users.update({
            where:{id: userId},
            data:{password: hashedPassword}
         })
         if (updatePassword) {
            res.status(201).json({message: "success"})
         }
       }
    })
  }catch (err) {
      console.error('Error reset password:', err);
      res.status(400).json({ error: 'Failed to reset password'})
}
}
export const userTopics = async ( req: Request, res: Response ) => {
   try {
      const userId = Number(req.body.userId);
      const userTopics = await prisma.user_topics.findMany({
         where: {
            user_id: userId,
            status: 1
         },
         select: {
            id: true,
            topic: true
         }
      });
      const topics = userTopics.map((item: { id: number, topic: string }) => ({
         id: item.id,
         topic: item.topic
     }));
      res.status(201).json({ topics: topics });
   } catch (err) {
      console.error('Error finding topics:', err);
      res.status(400).json({ error: 'Failed to find topics' });
   }
}
export const userTitles = async (req: Request, res: Response) => {
   try {
       let get_columns_data 
       const userId = Number(req.body.topicId);
       const userTitles = await prisma.user_topics.findUnique({
         where: {
            id: userId,
            status: 1
         },
         select: {
            id:true,
            topic:true,
            name:true
         }
       })
       if (userId) {
         get_columns_data = await prisma.quotes_columns_data.findMany({
            where: {
               column_status: 1,
               status:1
            },
            select: {
               id:true,
               column_status:true,
               name:true,
               filter_status_id: true,
               sorting_status_id: true
            }
         })
       }
       res.status(201).json({ title: userTitles?.topic, titleId: userTitles?.id, content: userTitles?.name, get_columns: get_columns_data });
   } 
   catch (err) {
      console.error('Error finding titles:', err);
      res.status(400).json({ error: 'Failed to find titles' });
   }
}
export const modelCreate = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, titleName, textBox, titleId, userId, headerTitle } = req.body;
    if (!firstName || !lastName || !titleName || !textBox || !titleId || !userId || !headerTitle) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const authorName = `${firstName} ${lastName}`.trim();
    const existingUser = await prisma.main_table_data.findFirst({
      where: {
        topic_id: titleId,
        quotes_title: titleName,
        author_name: authorName,
      },
    });
    if (existingUser) {
      return res.status(201).json({ message: "This quote already exists!" });
    }
    const quoteData = textBox.map((quote:any) => ({
      topic_id: titleId,
      user_id: userId,
      quotes_title: titleName,
      header_title: headerTitle,
      quotes: quote, 
      author_name: authorName,
      status: 1,
      created_at: new Date(),
    }));
    const modelCreate = await prisma.main_table_data.createMany({
      data: quoteData
    });
    if(modelCreate) {
      return res.status(201).json({ message: "Your quote has been successfully created" });
    }
  } catch (err) {
    console.error("Error creating quote:", err);
    return res.status(500).json({ error: "Failed to create quote" });
  }
};

export const userGetData = async (req:Request, res:Response) => {
   try {
      const userId = Number(req.body.user_id);
      const topicId = Number(req.body.topicId);
      const page = Number(req.body.page) || 1;
      const pageSize = Number(req.body.pageSize) || 10;
      const filterValue = String(req.body.filteData || '').toLowerCase().replace(/\s+/g, '_');
      const searchQuery = String(req.body.searchData || '').trim();
      const columnName = String(req.body.ordered || '').trim().toLowerCase().replace(/\s+/g, '_');
      const ordered = String(req.body.order) === 'desc' ? 'desc' : 'asc';
      if (!userId && !topicId) {
         return res.status(400).json({error:'Field are required'})
      }
      let whereCondition: Record<string, any> = {
         user_id: userId,
         topic_id: topicId,
         status: 1,
       };
       if (searchQuery && filterValue !== 'undefined') {
         whereCondition[filterValue] = {
            contains: searchQuery,
         };
      }
      let orderedData: Record<string, any> = {};
      if (columnName !== 'undefined' && columnName) {
         orderedData = { [columnName]: ordered };
      }
      const totalQuotes = await prisma.main_table_data.findMany({
         distinct:['quotes_title'],
         where:whereCondition
      })
      let totalCount = totalQuotes.length;
      const get_columns_data = await prisma.main_table_data.findMany({
         distinct:['quotes_title'],
         where:whereCondition,
         select:{
           id:true,
           user_id:true,
           topic_id:true,
           quotes_title:true,
           author_name:true,
           created_at:true
         },
         skip: (page - 1) * pageSize,
         take: pageSize,
         orderBy: Object.keys(orderedData).length > 0 ? orderedData : undefined,
      });
      console.log(get_columns_data)
      const mapgetcolumndata = await Promise.all(
         get_columns_data?.map(async (point:any, index:any) => {
            const main_columns_data = await prisma.main_table_data.aggregate({
               where: {
                  quotes_title:point.quotes_title
               },
               _count :{
                  quotes:true
               }    
            })
            const serialNo = (page - 1) * pageSize + Number(index + 1);
            const quoteCount = main_columns_data._count.quotes;
            const created_at = moment(point.created_at, 'YYYY-MM-DD H:m:s').format('DD-MM-YY hh:mm A');
            return {
               S_no: serialNo,
               quotes_title: point.quotes_title,
               quotes_count: quoteCount,
               author_name: point.author_name,
               created_at: created_at,
               id: point.id
            }
         })
      )
      return res.status(201).json({rowsData: mapgetcolumndata, total: totalCount, page, pageSize})
   } catch (err) {
      console.error("Error getting quote:", err);
      return res.status(500).json({ error: "Failed to get quote"})
   }
}
