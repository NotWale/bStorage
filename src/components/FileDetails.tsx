import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import AudioPlayer from "./AudioPlayer";
import { useContext, useState } from 'react';
import { PlayingContext } from './PlayingContext';

type Props = {
  file: any;
};

export default function Files({ file }: Props) {
  const { isPlaying, togglePlay } = useContext(PlayingContext);
  const [showPreview, setShowPreview] = useState(false);

  function downloadFile(hash: string) {
    var a = document.getElementById('dl') as HTMLAnchorElement;
    a!.href = `https://arweave.net/${hash}`;
    console.log("hash: ", hash);
  }

  function displayPreview() {
    if (file.filename.substring(file.filename.lastIndexOf('.') + 1) == 'mp3') {
      return(
        <div>
          <div className={`bg-gray-400 ${showPreview ? 'block' : 'hidden'}`}>
            <AudioPlayer isPlaying={isPlaying} togglePlay={togglePlay} hash={file.hash} author={file.author} description={file.description}/>
          </div>
        </div>
      );
    } else if (file.filename.substring(file.filename.lastIndexOf('.') + 1) == 'jpg') {
      return(
      <div className=''>
        <img src={`https://arweave.net/${file.hash}`} alt="image" />
      </div>
      );
    }    
  }

  return (
    <div>
      <div className={`flex justify-between hover:bg-gray-400 w-full ${showPreview ? 'bg-gray-400' : 'bg-white'}`}>
        <h2 className='px-2 py-4'>{file.filename}</h2>
        <h2 className='px-2 py-4'>{file.description}</h2>
        
        <div className='flex space-x-2 mr-2'>
          <button className='flex hover:cursor-pointer mr-4 px-4 py-1 h-8 my-auto border-2 border-gray-400 hover:border-blue-400 bg-orange-400 rounded-xl'
                  onClick={() => setShowPreview(!showPreview)}>
            <FontAwesomeIcon className="left-1 mr-2 my-1" icon={faPlay} size="sm"/>
            Preview
          </button>
          <a id="dl" href="/" className='flex hover:cursor-pointer mr-4 px-4 py-1 h-8 my-auto border-2 border-gray-400 hover:border-blue-400 bg-orange-400 rounded-xl'
              download={file.filename}
              onClick={() => downloadFile(file.hash)}
              >
                <FontAwesomeIcon className="left-1 mr-2 my-1" icon={faDownload} size="sm"/>
                Download</a>
        </div>             
      </div>
      <div className={`bg-gray-400 ${showPreview ? 'block' : 'hidden'}`}>
      {
        (() => {
          if (file.filename.substring(file.filename.lastIndexOf('.') + 1) == 'mp3')
          return(
            <div>
              <AudioPlayer isPlaying={isPlaying} togglePlay={togglePlay} hash={file.hash} author={file.author} description={file.description}/>
            </div>
          );
          else if (file.filename.substring(file.filename.lastIndexOf('.') + 1) == 'jpg')
          return(
            <img src={`https://arweave.net/${file.hash}`} alt="image" width={200} height={200}/>
          )
        })()
      }
      </div>
  </div>
  );
}
