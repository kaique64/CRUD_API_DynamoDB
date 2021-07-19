import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { DynamoDB } from 'aws-sdk';
import { config } from 'dotenv';

config();

const document = new DynamoDB.DocumentClient({
    accessKeyId: process.env.ACCESS_KEY_ID, 
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
});

class UserController {
    create(req: Request, res: Response) {
        const { name, lastname } = req.body;

        const user_id = uuid();

        const values = {
            TableName: process.env.TABLE,
            Item: {
                "user_id": user_id,
                "user_name": name,
                "lastname": lastname,
            },
        };

        document.put(values, (err, data) => {
            if (err) {
                console.log(`Erro: ${err}`);
            } else {
                return res.status(200).json('Usuário cadastrado com sucesso!');
            }
        });
    }

    read(req: Request, res: Response) {
        const { user_id } = req.params;

        const values = {
            TableName: process.env.TABLE,
            Key: {
                "user_id": user_id,
            },
        };

        document.get(values ,(err, data) => {
            if (err) {
                console.log(`Erro: ${err}`);
            } else {
                // Verifying if user exists
                if (!data.Item) {
                    return res.status(400).json('Usuário inexistente!');
                } else {
                    delete data.Item.user_id;
                    return res.status(200).json(data);
                }
            }
        });
    }

    update(req: Request, res: Response) {
        const { name, lastname, phone } = req.body;
        const { user_id } = req.params;

        const verifyUser = {
            TableName: process.env.TABLE,
            Key: {
                "user_id": user_id,
            },
        };
        
        // Verifying if user exists
        document.get(verifyUser ,(err, data) => {
            if (err) {
                console.log(`Erro: ${err}`);
            } else {
                if (!data.Item) {
                    return res.status(400).json('Usuário inexistente!');
                } else {
                    const values = {
                        TableName: process.env.TABLE,
                        Item: {
                            "user_id": user_id,
                            "user_name": name,
                            "lastname": lastname,
                            "phone": phone,
                        },
                    };
            
                    // Updating user
                    document.put(values ,(err, data) => {
                        if (err) {
                            console.log(`Erro: ${err}`);
                        } else {
                            return res.status(200).json('Usuário atualizado com sucesso!');
                        }
                    });
                }
            }
        });
    }

    delete(req: Request, res: Response) {
        const { user_id } = req.params;

        const verifyUser = {
            TableName: process.env.TABLE,
            Key: {
                "user_id": user_id,
            },
        };
        
        document.get(verifyUser ,(err, data) => {
            if (err) {
                console.log(`Erro: ${err}`);
            } else {
                if (!data.Item) {
                    return res.status(400).json('Usuário inexistente!');
                } else {
                    const values = {
                        TableName: process.env.TABLE,
                        Key: {
                            "user_id": user_id,
                        },
                    }

                    document.delete(values ,(err, data) => {
                        if (err) {
                            console.log(`Erro: ${err}`);
                        } else {
                            return res.status(200).json('Usuário deletado com sucesso!');
                        }
                    });
                }
            }
        });

    }
}

export default new UserController();
