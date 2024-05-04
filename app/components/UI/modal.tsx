// css
import '@/sass/components/modal.scss';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  className: string;
  children: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <>
      <div className={`mask ${isOpen ? 'isOpen' : ''}`} 
      onClick={onClose}>
      </div>
      <div className={`modal ${isOpen ? 'isOpen' : ''}`}>
        <div className="modalWrap">{children}</div>
      </div>
    </>
  );
};

{
  /* <div className={`allDeleteModal ${isAllDeleteModal ? 'isOpen' : ''}`}>
          <div className="modalWrap">
            <p>delete everything?</p>
            <div className="buttonBlock">
              <div
                className="yesBtn"
                onClick={() => {
                  dispatch(allDeleteItem());
                  setIsAllDeleteModal(false);
                }}
              >
                Yes
              </div>
              <div className="noBtn" onClick={() => setIsAllDeleteModal(false)}
              >
                No
              </div>
            </div>
          </div>
        </div> */
}

// <div
//   className={`deleteConfModal ${isAddConfModalOpen ? 'isOpen' : ''}`}
// >
//   <div className="modalWrap">
//     <p>Realy add?</p>
//     <div className="judgeBtn">
//       <button className="yesBtn" onClick={addExecution}>
//         Yes
//       </button>
//       <button
//         className="noBtn"
//         onClick={() => {
//           setIsAddConfModalOpen(false);
//         }}
//       >
//         No
//       </button>
//     </div>
//   </div>
// </div>

// <div className={`updateModal ${isSuccess ? 'isOpen' : ''}`}>
//   {/* 成功 */}
//   <div className="modalWrap">
//     {isSuccess ? <p>success</p> : <p></p>}
//     {isFailure ? <p>failure</p> : <p></p>}

//     <button
//       className="closeBtn"
//       onClick={() => {
//         setIsUpdateModalOpen(false);
//         setIsSuccess(false);
//       }}
//     >
//       close
//     </button>
//   </div>
// </div>
