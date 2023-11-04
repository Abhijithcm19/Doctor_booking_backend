import dotenv from 'dotenv'
dotenv.config()


/*auth middleware */
// export default async function Auth(req,res,next){
//     try {

//         // access authorize header to validate request
//         const token = req.headers.authorization.split(" ")[1];


//         // retrive the user details fo the logged in user
//         const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)

//         req.user = decodedToken

        
//         next()

        
//     } catch (error) {
//         res.status(401).json({error : "Authentication Failed"})
//     }
// }


export function localVariables(req, res, next) {
    // Destructure the values from the request body
    const { name, password, photo, email, role, gender } = req.body;
  
    // Set the values as properties of req.app.locals
    req.app.locals = {
      OTP: null,
      resetSession: false,
      registrationData: {
        name,
        password,
        photo,
        email,
        role,
        gender,
      },
    };
  
    next();
  }
  

