type Props = {
  openMessageModal: boolean;
  setOpenMessageModal: any;
  currentMessage: string;
};

export default function MessageModal({ openMessageModal, setOpenMessageModal, currentMessage }: Props) {  
  return (
    <button className={`fixed bottom-0 left-1/3 h-10 w-max py-1 px-6 rounded-xl bg-orange-400 border-2 border-gray-700 transform duration-300 ${openMessageModal ? "-translate-y-12" : "translate-y-12 "}`}
            onClick={() => setOpenMessageModal(false)}>
      {currentMessage}
    </button>
  );
}
