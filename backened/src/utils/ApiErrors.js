class ApiErrors extends Error {
    constructor(
        statuscode,
        message = "someting went wrong",
        errors=[],
        stack=""

    ){
        super(message)
        this.message = message
        this.data= null
        this.errors = this.errors
        this.stack = stack
        this.statuscode = statuscode
        this.success = false;

if (stack) {
    this.stack = stack;
}
else{
    Error.captureStackTrace(this,this.constructor)
}

}
}

export default ApiErrors;