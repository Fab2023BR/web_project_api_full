import bcrypt from 'bcrypt';

export const createHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

export const validateHash = async (password, hashPassword) => {
    return bcrypt.compare(password, hashPassword).then((matched)=>{
        if(!matched){
            return {
                statusCode: 401,
                message: "Email ou senha incorreto",
              };
        }
        return hashPassword
    })
}