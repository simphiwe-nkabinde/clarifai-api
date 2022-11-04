const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 07261570e02b4e96846724a6a284c766");

app.use(express.json())
app.use(express.urlencoded());
app.use(cors({origin: 'http://127.0.0.1:5500'}))


app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.post('/clarifai', (req,finalRes) => {
    const {imageUrl, category} = req.body;
    console.log(req.body);
    if (!imageUrl) return;

    let model_id = 'food-item-recognition';
    if (category == 'food') {
        model_id = 'food-item-recognition';
    } else if (category == 'apparel') {
        model_id = 'apparel-detection';
    }

    stub.PostModelOutputs(
        {
            model_id,
            inputs: [
                {
                    data: {
                        image: {url: imageUrl}
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
            console.log(res.outputs[0].data.regions);
            categoryID = ''
            if (category == 'food') categoryID = 'concepts'
            else categoryID = 'regions';
            
            return finalRes.status(200).json(res.outputs[0].data[categoryID]);
        }
    )
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})