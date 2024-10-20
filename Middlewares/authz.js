const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authz = async (req, res, next) => {
    try {
        //console.log("conole -> ",req.body.token);

        //.log(req.cookies);

        const token = req.body.token || req.cookies.token
       // console.log("re.body ", req.body.token);
        //console.log("cookies ",req.cookies.token);
        //console.log("header ",req.header("Authorization").replace("Bearer ",""))
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing, please login first"
            });
        }

        // console.log("19")
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            //console.log(payload);

            req.user = payload;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while verifying the token"
        });
    }
    next();
};
