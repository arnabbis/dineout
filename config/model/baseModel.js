import docClient from "../../dbConfig.js";
import {PutCommand, GetCommand, ScanCommand, DeleteCommand} from "@aws-sdk/lib-dynamodb"


class BaseModel {
    constructor(tableName){
        this.tableName = tableName;
    }

    async put(data){
        await docClient.send(new PutCommand ({
            TableName: this.tableName,
            Item: data
        }));
        return data;
    }

    async getOne(key){
      const data = await docClient.send(new GetCommand({
            TableName: this.tableName,
            Key:key
        }));
        return data.Item || null;
    }

    async getAllData(){
        const getAllData = await docClient.send(new ScanCommand({
            TableName: this.tableName
        }));
        return getAllData || [];
    }

    async deleteData(key){
        await docClient.send(new DeleteCommand({
            TableName: this.tableName,
            Key:key
        }));
        return {delete:true};
    }

}

export default BaseModel;