import ScrollContainer from 'react-indiana-drag-scroll'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import AudioPlayer from "./AudioPlayer";
import { useContext } from 'react';
import { PlayingContext } from './PlayingContext';

type Props = {
  posts: any;
};

export default function Files({ posts }: Props) {
  const { isPlaying, togglePlay } = useContext(PlayingContext);
  // const sortedFiles = posts.
  const arr = ["file1","file2","file3","file4","file5","file6","file7","file8","file9","file10"];

  function downloadFile(hash: string) {
    //window.open(`http://arweave.net/${hash}`);
    var a = document.getElementById('dl') as HTMLAnchorElement;
    a!.href = `http://arweave.net/${hash}`;
  }

  return (
        <ScrollContainer className="flex flex-col sm:mt-14 mt-28 h-full z-10 w-full" horizontal={false} >
          {posts.map((file: any, key: any) => {
            return (
              <div className='flex justify-between hover:bg-gray-400 w-full'>
                <h2 className='px-2 py-4'>{file.filename}</h2>
                <h2 className='px-2 py-4'>{file.description}</h2>
                
                <div className='flex space-x-2 mr-2'>
                  <button className='flex hover:cursor-pointer mr-4 px-4 py-1 h-8 my-auto border-2 border-gray-400 hover:border-blue-400 bg-orange-400 rounded-xl'>
                    <FontAwesomeIcon className="left-1 mr-2 my-1" icon={faPlay} size="sm"/>
                    Play
                  </button>
                  <a id="dl" href="/" className='flex hover:cursor-pointer mr-4 px-4 py-1 h-8 my-auto border-2 border-gray-400 hover:border-blue-400 bg-orange-400 rounded-xl'
                      download="filename"
                      onClick={() => downloadFile(file.hash)}
                      >
                        <FontAwesomeIcon className="left-1 mr-2 my-1" icon={faDownload} size="sm"/>
                        Download</a>
                </div>
                
              </div>
              // <AudioPlayer isPlaying={isPlaying} togglePlay={togglePlay} hash={file.song.hash} author={file.song.author} description={file.song.description}/>
            );
          })}
        </ScrollContainer>
  );
}
