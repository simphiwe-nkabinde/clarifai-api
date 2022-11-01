const express = require('express')
const app = express()
const port = 3000

const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 07261570e02b4e96846724a6a284c766");

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/clarifai', (req,res) => {

    stub.PostModelOutputs(
        {
            model_id: "food-item-recognition",
            inputs: [
                {
                    data: {
                        image: {url: "https://images.unsplash.com/photo-1528825871115-3581a5387919?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80"}
                    }
                }
            ]
        },
        metadata,
        (err, res) => {
            if (err) {
                console.log(('Error: ' + err));
                return;
            }
            if (res.status.code !== 10000) {
                console.log("Received failed status: " + res.status.description + "\n" + res.status.details);
                return;
            }

            console.log("Predicted concepts, with confidence values:");
            for (const c of res.outputs[0].data.concepts) {
                console.log(c.name + ": " + c.value);
            }
        }
    )
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})