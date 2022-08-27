import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import ReactiveButton from 'reactive-button';

type Props = {
  uploadPost: any;
  setSelectedFile: any;
  selectedFile: File | undefined;
  state: any;
  setState: any;
};

export default function UploadFile({ uploadPost, setSelectedFile, selectedFile, setState, state }: Props) {
  const [desc, setDesc] = useState("");
  
  return (
    <div className="flex h-screen w-max px-4 bg-gray-900">
      <div className="flex flex-col my-auto top-1/2 px-1 lg:w-72 w-36 h-72 lg:rounded-full rounded-md shadow-2xl bg-orange-400">
        <form
          className="my-auto flex flex-col"
          onSubmit={(event) => {
            setState('loading');
            event.preventDefault();
            uploadPost(desc);
          }}
        >
          <p className="mx-auto"> {selectedFile ? selectedFile.name : "Upload a File"} </p>
          <label htmlFor="inputTag" className="w-max mx-auto cursor-pointer">
          <FontAwesomeIcon className="my-1" icon={faUpload} size="3x" beatFade/>
            <input
              id="inputTag"
              className="hidden"
              type="file"
              //accept=".mp3, .wav"
              onChange={(event: React.FormEvent) => {
                const files = (event.target as HTMLInputElement).files;

                if (files && files.length > 0) {
                  setSelectedFile(files[0]);
                }
              }}
            />
          </label>
          
          <input
            id="musicDescription"
            type="text"
            className="grow rounded-xl my-4 lg:h-8 h-16 form-control lg:w-max w-32 mx-auto"
            placeholder="File description..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
          <ReactiveButton type="submit" buttonState={state} idleText={'Upload File'} loadingText={'This takes a while... :I'} className="rounded-xl lg:w-[188px] w-[88px] lg:ml-12 ml-6 bg-blue-700"/>
        </form>
      </div>
    </div>
  );
}
