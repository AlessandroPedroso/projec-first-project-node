const { request, response } = require('express');
const express = require('express');
const cors = require('cors');
const uuid = require('uuid');

const port = 3000;

const app = express();
app.use(express.json());
app.use(cors());

const users = []

// const myFirstMiddleware = (request,response,next) =>{
//         console.log('fui chamado');

//         next();
// }

// app.use(myFirstMiddleware);

const checkUserId = (request, response, next) => {

        const { id } = request.params;

        const index = users.findIndex(user => user.id === id);

        if (index < 0) {

                return response.status(404).json({ message: "User not found" });
        }

        request.userIndex = index;
        request.userId = id;

        next();

}

app.get('/users', (request, response) => {

        return response.json(users);
})

app.post('/users', (request, response) => {

        try {

                const { name, age } = request.body;
                const ageInt = parseInt(age);
                if(ageInt < 18) throw new Error('Idade precisa ser maior ou igual a 18 anos');     
                
                const user = { id: uuid.v4(), name: name, age: ageInt };

                users.push(user);

                return response.status(201).json(user);

        } catch (error) {

                return response.status(400).json({erro: error.message});
        } finally{
                console.log('terminou tudo')
        }

})

app.put('/users/:id', checkUserId, (request, response) => {


        const { name, age } = request.body;

        const index = request.userIndex;
        const id = request.userId;

        const updateUser = { id: id, name: name, age: age };

        users[index] = updateUser

        return response.json(updateUser);
})

app.delete('/users/:id', checkUserId, (request, response) => {

        const index = request.userIndex;

        users.splice(index, 1);

        return response.status(204).json();
})

// app.get('/users', (request,response)=>{

//         //const {name,age} = request.query;
//         const {name,age} = request.body;
//         console.log(name,age);
//         // const nome = request.query.name;
//         // const idade = request.query.age;
//         // console.log(nome);
//         // console.log(idade);
//         return response.send({mensagem:"ok"});
//         // return response.json({name:name,age:age});
// })

// app.get('/users/:id', (request,response)=>{

//         const {id} = request.params;

//         // console.log(request.params.id)

//         return response.json({id});
// })



app.listen(port, () => {
        console.log("🫶🎆Server strated on port 3001");
});
