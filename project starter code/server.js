import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8089  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  function isValidWebURL(imageURL) {
    var url;
    try {
      if(!imageURL){
        return false;
      }
      url = new URL(imageURL);
    } catch (_) {
      return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
  }
  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

  //! END @TODO1
  app.get('/filteredimage', async(req,res) => {
    const{image_url} = req.query;
    
    if(!isValidWebURL(image_url)){
      return res.status(400).json({error:`Image URL is invalid`});
    }

    try {
      
      const filteredPath = await filterImageFromURL(image_url);
      if(filteredPath){
        res.sendFile(filteredPath,(error) =>{
          if(!error){
            console.log(`Successfully sent file. Remove the local copy: ${filteredPath}`);
            deleteLocalFiles(filteredPath);
          }
        })
      }else{
        return res.status(400).json({error:`Cannot find image for image url: ${image_url}` });
      }
      
    } catch (exception) {
      return res.status(500).json({error: `An internal error occured: ${exception}`});
    }
  })

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
