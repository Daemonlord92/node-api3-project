const server = require('./server');
const port = 4000;
server.listen(port, ()=>{
    console.log(`\n***Magic happening on port ${port}***\n`)
})