import Category from "../models/Category.js";
import User from "../models/User.js";

const addCategory = async (req,res,next) => {
    try{
        const {title,desc} = req.body;
        const {_id} = req.user;

        const isCategoryExist = await Category.findOne({title});
        if (isCategoryExist){
            res.code = 400;
            throw new Error("Category already exist.");
        }

        const user = await User.findById(_id);

        if (!user){
            res.code = 404;
            throw new Error("User not found.");
        }

        const newCategory = new Category({title,desc,updatedBy: _id});
        await newCategory.save();

        res.status(200).json({code: 200, status: true, message: "Category added successfully."})

    }catch (e){
        next(e);
    }
}

export {addCategory};