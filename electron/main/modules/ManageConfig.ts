import fs from 'fs'
import {app} from 'electron'

const pathConfigFolder:string = app.getPath('appData')+ '/focus/'
const vaultConfigFileName:string = 'vaultConfig.json'

type vaultConfigFileNameType = {
    location:string;
}

export function initConfig(){
    try {
        fs.mkdirSync(pathConfigFolder)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export function getPathVault(){
    console.log(pathConfigFolder+vaultConfigFileName)
    if(! fs.existsSync(pathConfigFolder+vaultConfigFileName)){
        fs.writeFileSync(pathConfigFolder+vaultConfigFileName, JSON.stringify({
            location: null
        }))
        return null
    }
    let data = fs.readFileSync(pathConfigFolder+vaultConfigFileName, 'utf8');
    if(data){
        try {
            let res:vaultConfigFileNameType = JSON.parse(data)
            return res.location
        } catch (error) {
            return null
        }
    }else{
        return null
    }
    // fs.readFile(pathConfigFolder+'/'+vaultConfigFileName, 'utf8', (err:Error, data:string) => {
    //     if(err){
    //         return null
    //     }else{
    //         try {
    //             let res:vaultConfigFileNameType = JSON.parse(data)
    //             return res.location
    //         } catch (error) {
    //             return null
    //         }
    //     }
    // })
}