import ScrollContainer from 'react-indiana-drag-scroll'
import { useContext, useState } from 'react';
import { PlayingContext } from './PlayingContext';
import FileDetails from './FileDetails';

type Props = {
  posts: any;
};

export default function Files({ posts }: Props) {
  const { isPlaying, togglePlay } = useContext(PlayingContext);
  const [showPreview, setShowPreview] = useState(false);

  function downloadFile(hash: string) {
    //window.open(`http://arweave.net/${hash}`);
    var a = document.getElementById('dl') as HTMLAnchorElement;
    a!.href = `https://arweave.net/${hash}`;
    console.log("hash: ", hash);
  }

  return (
        <ScrollContainer className="flex flex-col sm:mt-14 mt-28 h-full z-10 w-full" horizontal={false} >
          {posts.map((file: any, key: any) => {
            return (
              <FileDetails file={file} />           
            );
          })}
        </ScrollContainer>
  );
}
