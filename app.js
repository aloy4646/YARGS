const yargs = require("yargs")
const fs = require("fs")
const validator = require("validator")

//membuat folder data jika belum ada
const dirPath = './data'
if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath)
}

//membuat file contacts.json jika belum ada
const dataPath = dirPath + "/contacts.json"
if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

yargs.command({
    command:"add",
    describe:"add new contact",
    builder:{
        name:{
            describe:'contact name',
            demandOption:true,
            type:"string",
        },
        email:{
            describe:'contact email',
            demandOption:false,
            type:"string",
        },
        
        mobile:{
            describe:'contact mobile phone number',
            demandOption:true,
            type:"string",
        },
    },

    handler(argv){
        const contact = {
            name: argv.name,
            email: argv.email,
            mobile: argv.mobile,
        }
        
        console.log(contact)
        simpanContact(contact.name, contact.mobile, contact.email)
    },
})

yargs.parse()

function simpanContact(nama, nomorHandphone, email){
    //membuat object contact berisi nama, nomorHandphone dan email
    const contact = {nama, 
                    nomorHandphone, 
                    email}

    const file = fs.readFileSync(dataPath, 'utf-8')
    const contacts = JSON.parse(file)

    var isValid = true

    //pengecekan nama duplikat
    if(contacts.find(contact => contact.nama === nama)){
        console.log("- Nama sudah ada, tidak dapat digunakan")
        isValid = false
    }

    //pengecekan format email
    //pengecekan contact.email dipakai untuk memeriksa apakah email undefined atau tidak
    //jika contact.email undefined maka tidak dapat dipakai oleh validator
    if(contact.email && !validator.isEmail(contact.email)){
        console.log("- Format email tidak sesuai")
        isValid = false
    }

    //pengecekan format nomor handphone
    if(!validator.isMobilePhone(contact.nomorHandphone, "id-ID")){
        console.log("- Format nomor handphone tidak sesuai")
        isValid = false
    }

    if(isValid){
        contacts.push(contact)
        fs.writeFileSync(dataPath, JSON.stringify(contacts))
        console.log("Data anda sudah disimpan, terima kasih telah memberikan data!");
    }else console.log("Data gagal disimpan, silahkah coba lagi")
   
}