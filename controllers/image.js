const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const handleApiCall = (req, res) => {
    //db raw info
    const raw = JSON.stringify({
        user_app_id: {
          user_id: "n8ha1c21ofd6",
          app_id: "face-detect",
        },
        inputs: [
          {
            data: {
              image: {
                url: req.body.input,
              },
            },
            
          },
        ],
      });
    
    fetch(
        "https://api.clarifai.com/v2/models/f76196b43bbd45c99b4f3cd8e8b40a8a/outputs",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: "Key 3caddf5109af4bdd94fd3b6330f28179",
          },
          body: raw,
        }
      )
      .then(response => response.json())
      .then(data => {
        res.send(data);
      })
      .catch(err => res.status(400).json('unable to work with API'));
};


const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0].entries))
    .catch(err => res.status(400).json('unable to get entries/count'));
};

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
};