const asynchandler = (requesthandler) => {
 return (req , res, next,err) =>{
    Promise.resolve(requesthandler(req , res , next , err)).catch(err => next(err));
 }
}

export  {asynchandler};