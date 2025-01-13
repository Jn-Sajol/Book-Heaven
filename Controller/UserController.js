const userRegistration = async (req,res) =>{
    try {
        res.send('all right')
    } catch (error) {
        res.status(500).json({
            success:false,
            message:`server error ${error}`
        })
    }
}

//User Login
const userLogin = async (req,res) =>{
    try {
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:`server error ${error}`
        })
    }
}

module.exports = {userRegistration,userLogin}